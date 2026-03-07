import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

const WORKFLOW_YAML = `name: ShieldCI Security Scan

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  workflow_dispatch:

jobs:
  shieldci-scan:
    runs-on: self-hosted
    timeout-minutes: 30

    steps:
      - name: Checkout target repository
        uses: actions/checkout@v4

      - name: Gather metadata
        id: meta
        run: |
          echo "repo=\${{ github.repository }}" >> "\$GITHUB_OUTPUT"
          if [ "\${{ github.event_name }}" = "pull_request" ]; then
            echo "branch=\${{ github.head_ref }}" >> "\$GITHUB_OUTPUT"
            echo "commit=\${{ github.event.pull_request.head.sha }}" >> "\$GITHUB_OUTPUT"
            echo "trigger=PR" >> "\$GITHUB_OUTPUT"
          else
            echo "branch=\${{ github.ref_name }}" >> "\$GITHUB_OUTPUT"
            echo "commit=\${{ github.sha }}" >> "\$GITHUB_OUTPUT"
            echo "trigger=\${{ github.event_name }}" >> "\$GITHUB_OUTPUT"
          fi
          echo "commit_msg=\$(git log -1 --pretty=%s 2>/dev/null || echo 'scan')" >> "\$GITHUB_OUTPUT"

      - name: Check ShieldCI engine is available
        run: |
          if [ ! -f "\$HOME/Desktop/ShieldCI/target/release/shield-ci" ]; then
            echo "ERROR: ShieldCI engine not found"
            exit 1
          fi

      - name: Copy shieldci.yml config
        run: |
          if [ -f "shieldci.yml" ]; then
            cp shieldci.yml "\$HOME/Desktop/ShieldCI/tests/shieldci.yml"
          fi

      - name: Copy target repo to engine
        run: |
          rm -rf "\$HOME/Desktop/ShieldCI/tests/repo"
          cp -r "\$GITHUB_WORKSPACE" "\$HOME/Desktop/ShieldCI/tests/repo"

      - name: Run ShieldCI engine
        id: scan
        run: |
          START_TIME=\$(date +%s)
          cd "\$HOME/Desktop/ShieldCI/tests"
          "\$HOME/Desktop/ShieldCI/target/release/shield-ci" 2>&1 | tee scan_output.log || true
          END_TIME=\$(date +%s)
          echo "duration=\$((END_TIME - START_TIME))s" >> "\$GITHUB_OUTPUT"

      - name: Push results to ShieldCI dashboard
        if: always()
        env:
          SHIELDCI_REPO: \${{ steps.meta.outputs.repo }}
          SHIELDCI_BRANCH: \${{ steps.meta.outputs.branch }}
          SHIELDCI_COMMIT: \${{ steps.meta.outputs.commit }}
          SHIELDCI_COMMIT_MSG: \${{ steps.meta.outputs.commit_msg }}
          SHIELDCI_DURATION: \${{ steps.scan.outputs.duration }}
          SHIELDCI_TRIGGERED_BY: \${{ steps.meta.outputs.trigger }}
        run: |
          export SHIELDCI_API_URL="PLACEHOLDER_API_URL"
          export SHIELDCI_API_KEY="PLACEHOLDER_API_KEY"
          export SHIELDCI_RESULTS_FILE="\$HOME/Desktop/ShieldCI/tests/shield_results.json"
          python3 "\$HOME/Desktop/ShieldCI/push_results.py"

      - name: Post scan summary as PR comment
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const reportPath = process.env.HOME + '/Desktop/ShieldCI/tests/SHIELD_REPORT.md';
            let report = 'Scan completed but no report was generated.';
            try {
              report = fs.readFileSync(reportPath, 'utf8');
              if (report.length > 60000) report = report.substring(0, 60000) + '\\n\\n... (truncated)';
            } catch (e) { report = 'Could not read scan report.'; }
            await github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '## 🛡️ ShieldCI Security Scan Results\\n\\n' + report
            });
`

async function pushWorkflowToRepo(token: string, repoFullName: string): Promise<{ success: boolean; error?: string }> {
  const [owner, repo] = repoFullName.split("/")

  // Inject the actual API URL and key into the workflow YAML
  const shieldApiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const apiKey = process.env.SHIELDCI_API_KEY || ""
  const finalYaml = WORKFLOW_YAML
    .replace("PLACEHOLDER_API_URL", shieldApiUrl)
    .replace("PLACEHOLDER_API_KEY", apiKey)

  const readHeaders = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ShieldCI-App",
  }
  const writeHeaders = {
    ...readHeaders,
    "Content-Type": "application/json",
  }

  // 1. Verify we can access the repo and get default branch
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: readHeaders })
  if (!repoRes.ok) {
    const err = await repoRes.json().catch(() => ({}))
    return { success: false, error: `Cannot access repo (${repoRes.status}): ${err.message || "check token permissions"}` }
  }
  const repoData = await repoRes.json()
  const defaultBranch = repoData.default_branch || "main"

  // 2. Check if repo is empty (size 0 = no commits, can't push via Contents API)
  if (repoData.size === 0) {
    return { success: false, error: "Repo is empty (no commits). Push an initial commit first, then re-initialize." }
  }

  // 3. Check if workflow file already exists (to get sha for update)
  const filePath = ".github/workflows/shieldci.yml"
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`
  let existingSha: string | undefined
  try {
    const checkRes = await fetch(`${apiUrl}?ref=${defaultBranch}`, { headers: readHeaders })
    if (checkRes.ok) {
      const existing = await checkRes.json()
      existingSha = existing.sha
    }
  } catch {
    // file doesn't exist, that's fine
  }

  // 4. Push/update the workflow file
  const content = Buffer.from(finalYaml).toString("base64")
  const body: any = {
    message: "ci: add ShieldCI security scan workflow",
    content,
    branch: defaultBranch,
  }
  if (existingSha) {
    body.sha = existingSha
    body.message = "ci: update ShieldCI security scan workflow"
  }

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: writeHeaders,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    return { success: false, error: `Push failed (${res.status}): ${errData.message || "Unknown error"}` }
  }

  // 5. Trigger the workflow immediately via workflow_dispatch
  try {
    // Wait a moment for GitHub to register the new workflow file
    await new Promise(resolve => setTimeout(resolve, 2000))
    const dispatchRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/shieldci.yml/dispatches`,
      {
        method: "POST",
        headers: writeHeaders,
        body: JSON.stringify({ ref: defaultBranch }),
      }
    )
    if (!dispatchRes.ok) {
      // Not a fatal error — workflow was pushed, just couldn't trigger immediately
      console.log(`Workflow dispatch failed (${dispatchRes.status}), will run on next push/PR`)
    }
  } catch {
    // Non-fatal
  }

  return { success: true }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { repoFullName } = await req.json()
    if (!repoFullName) return NextResponse.json({ error: "Repo name required" }, { status: 400 })

    const githubUsername = (session.user as any).githubUsername
    await connectDB()

    // Get the user's GitHub access token from DB
    const user = await User.findOne({ githubUsername })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const token = user.githubAccessToken || (session.user as any).githubAccessToken
    if (!token) {
      return NextResponse.json({ error: "No GitHub access token. Please re-login with GitHub OAuth." }, { status: 403 })
    }

    // Push the workflow file into the repo
    const pushResult = await pushWorkflowToRepo(token, repoFullName)

    // Add to connected repos regardless (user may want to track even if push fails)
    await User.findOneAndUpdate({ githubUsername }, { $addToSet: { connectedRepos: repoFullName } })

    return NextResponse.json({
      message: "Repo connected",
      repoFullName,
      workflowPushed: pushResult.success,
      workflowError: pushResult.error,
    })
  } catch (error) {
    console.error("POST /api/repos/connect error:", error)
    return NextResponse.json({ error: "Failed to connect repo" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { repoFullName } = await req.json()
    const githubUsername = (session.user as any).githubUsername
    await connectDB()
    await User.findOneAndUpdate({ githubUsername }, { $pull: { connectedRepos: repoFullName } })

    return NextResponse.json({ message: "Repo disconnected", repoFullName })
  } catch (error) {
    return NextResponse.json({ error: "Failed to disconnect repo" }, { status: 500 })
  }
}