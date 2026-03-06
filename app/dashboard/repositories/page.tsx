"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  Shield, ShieldAlert, ScanLine, CheckCircle2, AlertTriangle,
  GitBranch, Clock, TrendingUp, TrendingDown, ChevronRight,
  Lock, Globe, ExternalLink, Loader2
} from "lucide-react"

interface RepoStats {
  repo: string
  securityScore: number
  totalScans: number
  cleanScans: number
  issueScans: number
  lastScanAgo: string
  vulnerabilities: { total: number; pending: number; resolved: number; fixPrRaised: number }
  severities: { Critical: number; High: number; Medium: number; Low: number }
  scoreHistory: { commit: string; score: number }[]
}

interface OverallStats {
  totalRepos: number
  totalScans: number
  totalVulns: number
  pendingVulns: number
  resolvedVulns: number
  avgScore: number
  severities: { Critical: number; High: number; Medium: number; Low: number }
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#a855f7" : score >= 40 ? "#eab308" : "#ef4444"
  return (
    <div style={{
      width: "48px", height: "48px", borderRadius: "50%",
      background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      <div style={{
        width: "40px", height: "40px", borderRadius: "50%",
        background: "#0a0015",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color, fontFamily: "'Georgia', serif" }}>{score}</span>
      </div>
    </div>
  )
}

function SeverityBar({ severities }: { severities: { Critical: number; High: number; Medium: number; Low: number } }) {
  const total = severities.Critical + severities.High + severities.Medium + severities.Low
  if (total === 0) return <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>No vulnerabilities</span>

  const segments = [
    { key: "Critical", count: severities.Critical, color: "#ef4444" },
    { key: "High", count: severities.High, color: "#f97316" },
    { key: "Medium", count: severities.Medium, color: "#eab308" },
    { key: "Low", count: severities.Low, color: "#3b82f6" },
  ].filter(s => s.count > 0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      <div style={{ display: "flex", height: "6px", borderRadius: "3px", overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
        {segments.map(s => (
          <div key={s.key} style={{ width: `${(s.count / total) * 100}%`, background: s.color }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {segments.map(s => (
          <span key={s.key} style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.color, display: "inline-block" }} />
            {s.count} {s.key}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function RepositoriesPage() {
  const { data: session } = useSession()
  const [repos, setRepos] = useState<RepoStats[]>([])
  const [overall, setOverall] = useState<OverallStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return
    fetch("/api/repos/stats")
      .then(res => res.json())
      .then(data => {
        setRepos(data.repos || [])
        setOverall(data.overall || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session])

  const selected = repos.find(r => r.repo === selectedRepo)

  if (loading) return (
    <div style={{ padding: "40px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
        <Loader2 size={24} color="rgba(168,85,247,0.6)" style={{ animation: "spin 1s linear infinite" }} />
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .repo-card:hover{border-color:rgba(168,85,247,0.4) !important;background:rgba(106,13,173,0.08) !important;}
      `}</style>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "white", fontFamily: "'Georgia', serif", letterSpacing: "-0.02em", marginBottom: "4px" }}>
          Repositories
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(150,100,220,0.6)", fontFamily: "'Trebuchet MS', sans-serif" }}>
          Security posture across {repos.length} connected {repos.length === 1 ? "repository" : "repositories"}
        </p>
      </div>

      {/* Overall summary cards */}
      {overall && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }}>
          {[
            { label: "Avg Score", value: `${overall.avgScore}`, color: overall.avgScore >= 70 ? "#22c55e" : "#eab308", icon: Shield },
            { label: "Total Scans", value: `${overall.totalScans}`, color: "#3b82f6", icon: ScanLine },
            { label: "Total Vulns", value: `${overall.totalVulns}`, color: "#ef4444", icon: ShieldAlert },
            { label: "Pending", value: `${overall.pendingVulns}`, color: "#f97316", icon: AlertTriangle },
            { label: "Resolved", value: `${overall.resolvedVulns}`, color: "#22c55e", icon: CheckCircle2 },
          ].map(card => {
            const Icon = card.icon
            return (
              <div key={card.label} style={{
                background: "rgba(10,0,20,0.6)",
                border: "1px solid rgba(90,11,145,0.25)",
                borderRadius: "12px",
                padding: "16px",
                display: "flex", flexDirection: "column", gap: "8px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", color: "rgba(150,100,220,0.6)", fontFamily: "'Trebuchet MS', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {card.label}
                  </span>
                  <Icon size={14} color={card.color} />
                </div>
                <span style={{ fontSize: "28px", fontWeight: 800, color: "white", fontFamily: "'Georgia', serif" }}>{card.value}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Severity breakdown bar (overall) */}
      {overall && overall.totalVulns > 0 && (
        <div style={{
          background: "rgba(10,0,20,0.6)",
          border: "1px solid rgba(90,11,145,0.25)",
          borderRadius: "12px",
          padding: "20px",
        }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", fontFamily: "'Trebuchet MS', sans-serif", marginBottom: "12px" }}>
            Overall Severity Distribution
          </p>
          <SeverityBar severities={overall.severities} />
        </div>
      )}

      {repos.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          border: "1px dashed rgba(90,11,145,0.3)",
          borderRadius: "16px",
          background: "rgba(10,0,20,0.3)",
        }}>
          <Shield size={40} color="rgba(168,85,247,0.3)" style={{ marginBottom: "16px" }} />
          <p style={{ fontSize: "16px", fontWeight: 600, color: "rgba(255,255,255,0.5)", fontFamily: "'Trebuchet MS', sans-serif", marginBottom: "8px" }}>
            No repositories connected
          </p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", fontFamily: "'Trebuchet MS', sans-serif" }}>
            Go to <a href="/dashboard/connect-repo" style={{ color: "#a855f7", textDecoration: "underline" }}>Connect Repo</a> to initialize your first repository.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Repo list */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            {repos.map(repo => {
              const isSelected = selectedRepo === repo.repo
              const scoreColor = repo.securityScore >= 80 ? "#22c55e" : repo.securityScore >= 60 ? "#a855f7" : repo.securityScore >= 40 ? "#eab308" : "#ef4444"
              const repoName = repo.repo.split("/").pop() || repo.repo
              return (
                <div
                  key={repo.repo}
                  className="repo-card"
                  onClick={() => setSelectedRepo(isSelected ? null : repo.repo)}
                  style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    padding: "18px 20px",
                    borderRadius: "14px",
                    background: isSelected ? "rgba(106,13,173,0.12)" : "rgba(10,0,20,0.5)",
                    border: `1px solid ${isSelected ? "rgba(168,85,247,0.4)" : "rgba(90,11,145,0.2)"}`,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <ScoreBadge score={repo.securityScore} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 600, color: "white", fontFamily: "'Trebuchet MS', sans-serif" }}>
                        {repoName}
                      </span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "'Trebuchet MS', sans-serif" }}>
                        {repo.repo}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <ScanLine size={10} /> {repo.totalScans} scans
                      </span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <ShieldAlert size={10} /> {repo.vulnerabilities.total} vulns
                      </span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={10} /> {repo.lastScanAgo}
                      </span>
                    </div>

                    <div style={{ marginTop: "8px" }}>
                      <SeverityBar severities={repo.severities} />
                    </div>
                  </div>

                  <ChevronRight size={16} color="rgba(255,255,255,0.2)" style={{ transform: isSelected ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                </div>
              )
            })}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{
              width: "380px", flexShrink: 0,
              background: "rgba(10,0,20,0.6)",
              border: "1px solid rgba(90,11,145,0.3)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex", flexDirection: "column", gap: "20px",
              position: "sticky", top: "92px", alignSelf: "flex-start",
            }}>
              {/* Header */}
              <div>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "white", fontFamily: "'Georgia', serif", marginBottom: "4px" }}>
                  {selected.repo.split("/").pop()}
                </p>
                <p style={{ fontSize: "12px", color: "rgba(150,100,220,0.5)", fontFamily: "'Trebuchet MS', sans-serif" }}>
                  {selected.repo}
                </p>
              </div>

              {/* Score */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <ScoreBadge score={selected.securityScore} />
                <div>
                  <p style={{
                    fontSize: "14px", fontWeight: 600, fontFamily: "'Trebuchet MS', sans-serif",
                    color: selected.securityScore >= 80 ? "#22c55e" : selected.securityScore >= 60 ? "#a855f7" : selected.securityScore >= 40 ? "#eab308" : "#ef4444",
                  }}>
                    {selected.securityScore >= 80 ? "Strong" : selected.securityScore >= 60 ? "Moderate" : selected.securityScore >= 40 ? "Fair" : "At Risk"}
                  </p>
                  <p style={{ fontSize: "11px", color: "rgba(150,100,220,0.5)", fontFamily: "'Trebuchet MS', sans-serif" }}>
                    Security Score
                  </p>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Total Scans", value: selected.totalScans, color: "#3b82f6" },
                  { label: "Clean Scans", value: selected.cleanScans, color: "#22c55e" },
                  { label: "Issue Scans", value: selected.issueScans, color: "#f97316" },
                  { label: "Last Scan", value: selected.lastScanAgo, color: "#a855f7" },
                ].map(stat => (
                  <div key={stat.label} style={{
                    padding: "12px",
                    borderRadius: "10px",
                    background: "rgba(106,13,173,0.06)",
                    border: "1px solid rgba(90,11,145,0.15)",
                  }}>
                    <p style={{ fontSize: "10px", color: "rgba(150,100,220,0.5)", fontFamily: "'Trebuchet MS', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                      {stat.label}
                    </p>
                    <p style={{ fontSize: "20px", fontWeight: 700, color: "white", fontFamily: "'Georgia', serif" }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Vulnerability breakdown */}
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", fontFamily: "'Trebuchet MS', sans-serif", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Vulnerabilities
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {[
                    { label: "Pending", value: selected.vulnerabilities.pending, color: "#f97316" },
                    { label: "Fix PR Raised", value: selected.vulnerabilities.fixPrRaised, color: "#a855f7" },
                    { label: "Resolved", value: selected.vulnerabilities.resolved, color: "#22c55e" },
                  ].map(v => (
                    <div key={v.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: "8px", background: "rgba(106,13,173,0.04)", border: "1px solid rgba(90,11,145,0.1)" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontFamily: "'Trebuchet MS', sans-serif" }}>{v.label}</span>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: v.color, fontFamily: "'Georgia', serif" }}>{v.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Severity breakdown */}
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", fontFamily: "'Trebuchet MS', sans-serif", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  By Severity
                </p>
                <SeverityBar severities={selected.severities} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "10px" }}>
                  {[
                    { label: "Critical", value: selected.severities.Critical, color: "#ef4444" },
                    { label: "High", value: selected.severities.High, color: "#f97316" },
                    { label: "Medium", value: selected.severities.Medium, color: "#eab308" },
                    { label: "Low", value: selected.severities.Low, color: "#3b82f6" },
                  ].map(s => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: "6px", background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                      <span style={{ fontSize: "11px", color: s.color, fontFamily: "'Trebuchet MS', sans-serif" }}>{s.label}</span>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "white", fontFamily: "'Georgia', serif" }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action links */}
              <div style={{ display: "flex", gap: "8px" }}>
                <a href={`/dashboard/vulnerabilities?repo=${encodeURIComponent(selected.repo)}`} style={{
                  flex: 1, padding: "10px", borderRadius: "8px",
                  background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)",
                  color: "#c084fc", fontSize: "12px", fontWeight: 600, fontFamily: "'Trebuchet MS', sans-serif",
                  textAlign: "center", textDecoration: "none",
                }}>
                  View Vulns
                </a>
                <a href={`/dashboard/scan-history?repo=${encodeURIComponent(selected.repo)}`} style={{
                  flex: 1, padding: "10px", borderRadius: "8px",
                  background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
                  color: "#60a5fa", fontSize: "12px", fontWeight: 600, fontFamily: "'Trebuchet MS', sans-serif",
                  textAlign: "center", textDecoration: "none",
                }}>
                  Scan History
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
