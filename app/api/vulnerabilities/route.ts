import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import Vulnerability from "@/models/Vulnerability"

// GET — dashboard fetches vulnerabilities (scoped to user's connected repos)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const repo = searchParams.get("repo")
    const severity = searchParams.get("severity")
    const status = searchParams.get("status")

    await connectDB()

    const filter: any = {}
    if (repo) {
      filter.repo = repo
    } else {
      // Show vulns for user's connected repos + repos with existing data
      try {
        const session = await getServerSession(authOptions)
        if (session?.user) {
          const githubUsername = (session.user as any).githubUsername
          const user = await User.findOne({ githubUsername })
          const connectedRepos = user?.connectedRepos || []
          const scannedRepos = await Vulnerability.distinct("repo")
          const allRepos = [...new Set([...connectedRepos, ...scannedRepos])]
          if (allRepos.length > 0) {
            filter.repo = { $in: allRepos }
          }
        }
      } catch {
        // Fall through to unfiltered
      }
    }
    if (severity) filter.severity = severity
    if (status) filter.status = status

    const vulnerabilities = await Vulnerability.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    return NextResponse.json({ vulnerabilities })
  } catch (error) {
    console.error("GET /api/vulnerabilities error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
