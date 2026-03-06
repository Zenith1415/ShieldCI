import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import Scan from "@/models/Scan"
import Vulnerability from "@/models/Vulnerability"

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? "s" : ""} ago`
}

// GET — per-repo stats for all connected repos, or single repo if ?repo= is provided
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const githubUsername = (session.user as any).githubUsername
    await connectDB()

    const user = await User.findOne({ githubUsername })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const repoFilter = searchParams.get("repo")

    const repos = repoFilter
      ? user.connectedRepos.filter((r: string) => r === repoFilter)
      : user.connectedRepos

    if (repos.length === 0) {
      return NextResponse.json({ repos: [] })
    }

    // Get aggregate stats per repo
    const [scanAggs, vulnAggs, vulnSeverityAggs, recentScans] = await Promise.all([
      Scan.aggregate([
        { $match: { repo: { $in: repos } } },
        {
          $group: {
            _id: "$repo",
            totalScans: { $sum: 1 },
            cleanScans: { $sum: { $cond: [{ $eq: ["$status", "Clean"] }, 1, 0] } },
            issueScans: { $sum: { $cond: [{ $eq: ["$status", "Issues Found"] }, 1, 0] } },
            totalVulnsFound: { $sum: "$vulnsFound" },
            lastScanDate: { $max: "$createdAt" },
          },
        },
      ]),
      Vulnerability.aggregate([
        { $match: { repo: { $in: repos } } },
        {
          $group: {
            _id: "$repo",
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
            resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } },
            fixPrRaised: { $sum: { $cond: [{ $eq: ["$status", "Fix PR Raised"] }, 1, 0] } },
          },
        },
      ]),
      Vulnerability.aggregate([
        { $match: { repo: { $in: repos } } },
        {
          $group: {
            _id: { repo: "$repo", severity: "$severity" },
            count: { $sum: 1 },
          },
        },
      ]),
      Scan.find({ repo: { $in: repos } }).sort({ createdAt: -1 }).limit(5 * repos.length).lean(),
    ])

    // Build per-severity map: { repo -> { Critical: n, High: n, ... } }
    const sevByRepo: Record<string, Record<string, number>> = {}
    vulnSeverityAggs.forEach((item: any) => {
      const repo = item._id.repo
      if (!sevByRepo[repo]) sevByRepo[repo] = { Critical: 0, High: 0, Medium: 0, Low: 0 }
      sevByRepo[repo][item._id.severity] = item.count
    })

    // Build scan map
    const scanByRepo: Record<string, any> = {}
    scanAggs.forEach((item: any) => { scanByRepo[item._id] = item })

    // Build vuln map
    const vulnByRepo: Record<string, any> = {}
    vulnAggs.forEach((item: any) => { vulnByRepo[item._id] = item })

    // Build score history per repo from recent scans
    const scansByRepo: Record<string, any[]> = {}
    recentScans.forEach((scan: any) => {
      if (!scansByRepo[scan.repo]) scansByRepo[scan.repo] = []
      scansByRepo[scan.repo].push(scan)
    })

    const repoStats = repos.map((repo: string) => {
      const scan = scanByRepo[repo] || { totalScans: 0, cleanScans: 0, issueScans: 0, totalVulnsFound: 0, lastScanDate: null }
      const vuln = vulnByRepo[repo] || { total: 0, pending: 0, resolved: 0, fixPrRaised: 0 }
      const sev = sevByRepo[repo] || { Critical: 0, High: 0, Medium: 0, Low: 0 }

      // Security score: start at 100, penalize by severity
      const sevPenalty = sev.Critical * 25 + sev.High * 15 + sev.Medium * 5 + sev.Low * 2
      const resolvedBonus = vuln.resolved * 5
      const securityScore = Math.max(0, Math.min(100, 100 - sevPenalty + resolvedBonus))

      // Score history from last 5 scans
      const repoScans = (scansByRepo[repo] || []).reverse().map((s: any, i: number) => {
        const penalty = s.vulnsFound * 10
        return { commit: s.commit?.slice(0, 5) || `s${i}`, score: Math.max(20, Math.min(100, 100 - penalty)) }
      })

      return {
        repo,
        securityScore,
        totalScans: scan.totalScans,
        cleanScans: scan.cleanScans,
        issueScans: scan.issueScans,
        lastScanDate: scan.lastScanDate,
        lastScanAgo: scan.lastScanDate ? timeAgo(scan.lastScanDate) : "Never",
        vulnerabilities: {
          total: vuln.total,
          pending: vuln.pending,
          resolved: vuln.resolved,
          fixPrRaised: vuln.fixPrRaised,
        },
        severities: sev,
        scoreHistory: repoScans,
      }
    })

    // Overall aggregated stats
    const overall = {
      totalRepos: repos.length,
      totalScans: repoStats.reduce((a: number, r: any) => a + r.totalScans, 0),
      totalVulns: repoStats.reduce((a: number, r: any) => a + r.vulnerabilities.total, 0),
      pendingVulns: repoStats.reduce((a: number, r: any) => a + r.vulnerabilities.pending, 0),
      resolvedVulns: repoStats.reduce((a: number, r: any) => a + r.vulnerabilities.resolved, 0),
      avgScore: repoStats.length > 0 ? Math.round(repoStats.reduce((a: number, r: any) => a + r.securityScore, 0) / repoStats.length) : 0,
      severities: {
        Critical: repoStats.reduce((a: number, r: any) => a + r.severities.Critical, 0),
        High: repoStats.reduce((a: number, r: any) => a + r.severities.High, 0),
        Medium: repoStats.reduce((a: number, r: any) => a + r.severities.Medium, 0),
        Low: repoStats.reduce((a: number, r: any) => a + r.severities.Low, 0),
      },
    }

    return NextResponse.json({ repos: repoStats, overall })
  } catch (error) {
    console.error("GET /api/repos/stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
