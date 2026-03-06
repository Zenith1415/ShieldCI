"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import {
  Search, RefreshCw, Lock, Globe, ExternalLink,
  ChevronDown, CheckCircle2, AlertCircle, Loader2, GitBranch
} from "lucide-react"

interface GitHubProfile {
  username: string
  name: string
  avatar: string
  bio: string
  followers: number
  following: number
  publicRepos: number
  url: string
}

interface Repo {
  id: number
  name: string
  fullName: string
  owner: string
  description: string
  private: boolean
  language: string
  stars: number
  updatedAt: string
  url: string
  defaultBranch: string
  isConnected: boolean
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Go: "#00ADD8", Rust: "#dea584", Java: "#b07219", "C++": "#f34b7d",
  C: "#555555", Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138",
  Kotlin: "#A97BFF", Dart: "#00B4AB", Shell: "#89e051", Vue: "#41b883",
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export default function ConnectRepoPage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<GitHubProfile | null>(null)
  const [repos, setRepos] = useState<Repo[]>([])
  const [hasToken, setHasToken] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [initializing, setInitializing] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [justInitialized, setJustInitialized] = useState<string | null>(null)
  const [workflowStatus, setWorkflowStatus] = useState<Record<string, { pushed: boolean; error?: string }>>({})
  const searchRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    try {
      const res = await fetch("/api/github/data")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setProfile(data.profile)
      setRepos(data.repos)
      setHasToken(data.hasToken)
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to load GitHub data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { if (session) fetchData() }, [session])

  const handleRefresh = () => { setRefreshing(true); fetchData() }

  const handleInitialize = async (repo: Repo) => {
    setInitializing(repo.fullName)
    try {
      const res = await fetch("/api/repos/connect", {
        method: repo.isConnected ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoFullName: repo.fullName }),
      })
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setRepos(prev => prev.map(r =>
        r.fullName === repo.fullName ? { ...r, isConnected: !r.isConnected } : r
      ))
      if (!repo.isConnected) {
        setJustInitialized(repo.fullName)
        setWorkflowStatus(prev => ({
          ...prev,
          [repo.fullName]: { pushed: data.workflowPushed, error: data.workflowError }
        }))
        setTimeout(() => setJustInitialized(null), 5000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setInitializing(null)
    }
  }

  const filteredRepos = repos.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (r.description || "").toLowerCase().includes(search.toLowerCase())
  )

  const connectedRepos = repos.filter(r => r.isConnected)
  const unconnectedRepos = filteredRepos.filter(r => !r.isConnected)

  if (loading) return (
    <div style={{ padding: "40px 32px", maxWidth: "780px" }}>
      <style>{`@keyframes shimmer{0%{opacity:0.4}50%{opacity:0.8}100%{opacity:0.4}}`}</style>
      {/* Header skeleton */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ width: "220px", height: "28px", borderRadius: "6px", background: "rgba(255,255,255,0.06)", marginBottom: "10px", animation: "shimmer 1.5s infinite" }} />
        <div style={{ width: "360px", height: "14px", borderRadius: "4px", background: "rgba(255,255,255,0.04)", animation: "shimmer 1.5s infinite" }} />
      </div>
      {/* Search skeleton */}
      <div style={{ height: "44px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", marginBottom: "24px", animation: "shimmer 1.5s infinite" }} />
      {/* Repo skeletons */}
      {[1,2,3,4,5,6].map(i => (
        <div key={i} style={{ height: "68px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "2px", animation: "shimmer 1.5s infinite", animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  )

  if (error) return (
    <div style={{ padding: "40px 32px", maxWidth: "780px" }}>
      <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: "1px" }} />
        <div>
          <p style={{ color: "#ef4444", fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>Failed to load repositories</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "0 0 14px" }}>{error}</p>
          <button onClick={handleRefresh} style={{ padding: "8px 16px", borderRadius: "7px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: "13px", cursor: "pointer" }}>
            Try again
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ padding: "40px 32px", maxWidth: "780px" }}>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        .repo-row:hover { background: rgba(255,255,255,0.03) !important; }
        .init-btn:hover { opacity: 0.85; }
        .deinit-btn:hover { background: rgba(239,68,68,0.12) !important; border-color: rgba(239,68,68,0.35) !important; color: #ef4444 !important; }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: "white", margin: 0, letterSpacing: "-0.02em", fontFamily: "'Trebuchet MS', sans-serif" }}>
            Import Git Repository
          </h1>
          <button onClick={handleRefresh} disabled={refreshing} style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "7px 13px",
            borderRadius: "7px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.45)", fontSize: "12px", cursor: "pointer",
          }}>
            <RefreshCw size={12} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            Refresh
          </button>
        </div>

        {/* Profile row */}
        {profile && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px" }}>
            <img src={profile.avatar} alt={profile.name}
              style={{ width: "22px", height: "22px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "'Trebuchet MS', sans-serif" }}>
              {profile.username}
            </span>
            <ChevronDown size={13} color="rgba(255,255,255,0.3)" />
            {!hasToken && (
              <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", color: "#eab308" }}>
                Public repos only — use "Continue with GitHub" for private
              </span>
            )}
            {hasToken && (
              <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e" }}>
                ✓ Private repos enabled
              </span>
            )}
          </div>
        )}
      </div>

      {/* Already initialized section */}
      {connectedRepos.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontFamily: "'Trebuchet MS', sans-serif", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Initialized ({connectedRepos.length})
          </p>
          <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
            {connectedRepos.map((repo, i) => (
              <div key={repo.id} className="repo-row" style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 18px",
                borderBottom: i < connectedRepos.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                background: "rgba(34,197,94,0.03)",
                transition: "background 0.1s ease",
              }}>
                {/* Icon */}
                <div style={{ width: "32px", height: "32px", borderRadius: "7px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {repo.private
                    ? <Lock size={12} color="#22c55e" />
                    : <Globe size={12} color="#22c55e" />
                  }
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "white", fontFamily: "'Trebuchet MS', sans-serif" }}>
                      {repo.name}
                    </span>
                    {repo.private && (
                      <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        Private
                      </span>
                    )}
                    <CheckCircle2 size={13} color="#22c55e" />
                    {workflowStatus[repo.fullName]?.pushed && (
                      <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "4px", background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}>
                        ⚡ Workflow active
                      </span>
                    )}
                    {workflowStatus[repo.fullName] && !workflowStatus[repo.fullName].pushed && (
                      <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "4px", background: "rgba(234,179,8,0.1)", color: "#eab308", border: "1px solid rgba(234,179,8,0.2)" }}>
                        Workflow push failed
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "3px" }}>
                    {repo.language && (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: LANGUAGE_COLORS[repo.language] || "#888", display: "inline-block" }} />
                        {repo.language}
                      </span>
                    )}
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
                      <GitBranch size={10} style={{ display: "inline", marginRight: "3px" }} />
                      {repo.defaultBranch}
                    </span>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
                      Updated {timeAgo(repo.updatedAt)}
                    </span>
                  </div>
                </div>

                {/* Deinitialize */}
                <button
                  className="deinit-btn"
                  onClick={() => handleInitialize(repo)}
                  disabled={initializing === repo.fullName}
                  style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    padding: "7px 14px", borderRadius: "7px", cursor: "pointer",
                    fontSize: "12px", fontWeight: 500, flexShrink: 0,
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.45)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {initializing === repo.fullName
                    ? <Loader2 size={12} style={{ animation: "spin 0.8s linear infinite" }} />
                    : "Deinitialize"
                  }
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search + import section */}
      <div>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontFamily: "'Trebuchet MS', sans-serif", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Import a repository
        </p>

        {/* Search input — Vercel style */}
        <div style={{ position: "relative", marginBottom: "2px" }}>
          <Search size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)", pointerEvents: "none" }} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", height: "44px", borderRadius: "10px 10px 0 0",
              border: "1px solid rgba(255,255,255,0.09)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              background: "#111",
              paddingLeft: "40px", paddingRight: "16px",
              fontSize: "14px", color: "white", outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Repo list */}
        <div style={{ border: "1px solid rgba(255,255,255,0.09)", borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
          {unconnectedRepos.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>
              {search ? `No repositories matching "${search}"` : "All repositories are initialized"}
            </div>
          ) : (
            unconnectedRepos.slice(0, 20).map((repo, i) => (
              <div key={repo.id} className="repo-row" style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 18px",
                borderBottom: i < Math.min(unconnectedRepos.length, 20) - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                background: justInitialized === repo.fullName ? "rgba(34,197,94,0.04)" : "transparent",
                transition: "background 0.15s ease",
                animation: "fadeIn 0.2s ease",
              }}>
                {/* Icon */}
                <div style={{ width: "32px", height: "32px", borderRadius: "7px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {repo.private
                    ? <Lock size={12} color="rgba(255,255,255,0.3)" />
                    : <Globe size={12} color="rgba(255,255,255,0.3)" />
                  }
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "white", fontFamily: "'Trebuchet MS', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {repo.name}
                    </span>
                    {repo.private && (
                      <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
                        Private
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "3px" }}>
                    {repo.language && (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: LANGUAGE_COLORS[repo.language] || "#888", display: "inline-block" }} />
                        {repo.language}
                      </span>
                    )}
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
                      <GitBranch size={10} style={{ display: "inline", marginRight: "3px" }} />
                      {repo.defaultBranch}
                    </span>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
                      {timeAgo(repo.updatedAt)}
                    </span>
                    <a href={repo.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                      style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "11px", color: "rgba(160,80,255,0.5)", textDecoration: "none" }}>
                      <ExternalLink size={9} />
                    </a>
                  </div>
                </div>

                {/* Initialize button */}
                <button
                  className="init-btn"
                  onClick={() => handleInitialize(repo)}
                  disabled={initializing === repo.fullName}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "8px 18px", borderRadius: "7px", cursor: "pointer",
                    fontSize: "13px", fontWeight: 600, flexShrink: 0,
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    color: "white",
                    boxShadow: "0 1px 8px rgba(34,197,94,0.2)",
                    transition: "opacity 0.15s ease",
                    opacity: initializing === repo.fullName ? 0.6 : 1,
                  }}
                >
                  {initializing === repo.fullName
                    ? <><Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} /> Initializing...</>
                    : "Initialize"
                  }
                </button>
              </div>
            ))
          )}
          {unconnectedRepos.length > 20 && (
            <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "12px", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
              Showing 20 of {unconnectedRepos.length} repos — use search to find others
            </div>
          )}
        </div>
      </div>
    </div>
  )
}