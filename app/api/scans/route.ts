import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Scan from "@/models/Scan"
import Vulnerability from "@/models/Vulnerability"

const API_KEY = process.env.SHIELDCI_API_KEY

// POST — engine pushes scan results
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!API_KEY || authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { repo, branch, commit, commitMessage, status, duration, triggeredBy, reportMarkdown, vulnerabilities } = body

    if (!repo) {
      return NextResponse.json({ error: "repo is required" }, { status: 400 })
    }

    await connectDB()

    // If engine sent no structured vulns but report has content, detect from report
    const hasReport = reportMarkdown && reportMarkdown.trim().length > 0
    const hasStructuredVulns = vulnerabilities && vulnerabilities.length > 0
    const reportHasFindings = hasReport && /vulnerab|injection|xss|exploit|insecure|attack|malicious|unsafe|flaw/i.test(reportMarkdown)
    // If engine says "Clean" but report clearly has findings, override to "Issues Found"
    const effectiveStatus = hasStructuredVulns ? "Issues Found"
      : (reportHasFindings ? "Issues Found"
      : (status || "Clean"))
    const effectiveVulnCount = hasStructuredVulns ? vulnerabilities.length : (reportHasFindings ? 1 : 0)

    const scan = await Scan.create({
      repo,
      branch: branch || "main",
      commit: commit || "",
      commitMessage: commitMessage || "",
      status: effectiveStatus,
      vulnsFound: effectiveVulnCount,
      duration: duration || "",
      triggeredBy: triggeredBy || "PR",
      reportMarkdown: reportMarkdown || "",
    })

    if (hasStructuredVulns) {
      const vulnDocs = vulnerabilities.map((v: any) => ({
        repo,
        file: v.file || "",
        line: v.line || 0,
        type: v.type || "Unknown",
        severity: v.severity || "Medium",
        status: "Pending",
        commit: commit || "",
        description: v.description || "",
        codeSnippet: v.codeSnippet || "",
        fixSnippet: v.fixSnippet || "",
        scanId: scan._id,
      }))
      await Vulnerability.insertMany(vulnDocs)
    } else if (reportHasFindings) {
      // Create a single vulnerability from the report content
      await Vulnerability.create({
        repo,
        file: "(detected from report)",
        line: 0,
        type: "AI-Detected",
        severity: /critical|severe/i.test(reportMarkdown) ? "Critical" : /high|dangerous/i.test(reportMarkdown) ? "High" : "Medium",
        status: "Pending",
        commit: commit || "",
        description: reportMarkdown.substring(0, 500),
        codeSnippet: "",
        fixSnippet: "",
        scanId: scan._id,
      })
    }

    return NextResponse.json({ message: "Scan recorded", scanId: scan._id }, { status: 201 })
  } catch (error) {
    console.error("POST /api/scans error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET — dashboard fetches scan history (scoped to user's connected repos)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const repo = searchParams.get("repo")

    await connectDB()

    const filter: any = {}
    if (repo) {
      filter.repo = repo
    } else {
      // Show scans for user's connected repos + repos with existing scans
      try {
        const { getServerSession } = await import("next-auth")
        const { authOptions } = await import("@/lib/auth")
        const session = await getServerSession(authOptions)
        if (session?.user) {
          const User = (await import("@/models/User")).default
          const githubUsername = (session.user as any).githubUsername
          const user = await User.findOne({ githubUsername })
          const connectedRepos = user?.connectedRepos || []
          const scannedRepos = await Scan.distinct("repo")
          const allRepos = [...new Set([...connectedRepos, ...scannedRepos])]
          if (allRepos.length > 0) {
            filter.repo = { $in: allRepos }
          }
        }
      } catch {
        // Fall through to unfiltered
      }
    }

    const scans = await Scan.find(filter).sort({ createdAt: -1 }).limit(50).lean()

    return NextResponse.json({ scans })
  } catch (error) {
    console.error("GET /api/scans error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
