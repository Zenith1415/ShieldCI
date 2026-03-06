"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShieldAlert,
  GitPullRequest,
  Clock,
  Github,
  BookOpen,
  Settings,
  ChevronDown,
  LogOut,
  Shield,
} from "lucide-react"

const navItems = [
  { label: "Overview",        href: "/dashboard",                  icon: LayoutDashboard },
  { label: "Repositories",    href: "/dashboard/repositories",     icon: Shield          },
  { label: "Vulnerabilities", href: "/dashboard/vulnerabilities",  icon: ShieldAlert     },
  { label: "Fix PR Tracker",  href: "/dashboard/fix-pr-tracker",   icon: GitPullRequest  },
  { label: "Scan History",    href: "/dashboard/scan-history",     icon: Clock           },
  { label: "Connect Repo",    href: "/dashboard/connect-repo",     icon: Github          },
  { label: "Installation",    href: "/dashboard/installation",     icon: BookOpen        },
]


export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: "240px",
      minHeight: "100vh",
      background: "#080808",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0, top: 0, bottom: 0,
      zIndex: 40,
    }}>

      {/* Logo */}
      <div style={{
        padding: "22px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}>
        <div style={{
          width: "30px", height: "30px",
          borderRadius: "7px",
          background: "linear-gradient(135deg, #5A0B91, #8b22e0)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 0 12px rgba(106,13,173,0.4)",
        }}>
          <Shield size={15} color="white" />
        </div>
        <span style={{
          color: "white", fontWeight: 700, fontSize: "17px",
          fontFamily: "'Georgia', serif", letterSpacing: "-0.02em",
        }}>ShieldCI</span>
      </div>

      {/* Repo selector */}
      <div style={{ padding: "14px 12px" }}>
        <button style={{
          width: "100%", padding: "9px 12px",
          borderRadius: "8px",
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer", gap: "8px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Github size={13} color="rgba(255,255,255,0.4)" />
            <span style={{
              fontSize: "13px", color: "rgba(255,255,255,0.6)",
              fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 500,
            }}>my-repo</span>
          </div>
          <ChevronDown size={13} color="rgba(255,255,255,0.25)" />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "4px 10px", display: "flex", flexDirection: "column", gap: "1px" }}>
        <p style={{
          fontSize: "10px", color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.1em", textTransform: "uppercase",
          fontFamily: "'Trebuchet MS', sans-serif",
          padding: "4px 8px 8px", fontWeight: 600,
        }}>Main Menu</p>

        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 12px", borderRadius: "8px",
                textDecoration: "none", transition: "all 0.15s ease",
                background: isActive ? "rgba(106,13,173,0.25)" : "transparent",
                border: isActive ? "1px solid rgba(160,80,255,0.2)" : "1px solid transparent",
              }}
            >
              <Icon size={15} color={isActive ? "#c084fc" : "rgba(255,255,255,0.3)"} />
              <span style={{
                fontSize: "14px",
                fontFamily: "'Trebuchet MS', sans-serif",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#e0ccff" : "rgba(255,255,255,0.4)",
              }}>
                {item.label}
              </span>

              {isActive && (
                <div style={{
                  marginLeft: "auto",
                  width: "5px", height: "5px", borderRadius: "50%",
                  background: "#a855f7",
                  boxShadow: "0 0 6px #a855f7",
                }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User profile */}
      <div style={{
        padding: "12px 10px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 12px", borderRadius: "8px",
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: "linear-gradient(135deg, #5A0B91, #8b22e0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 700, color: "white", flexShrink: 0,
          }}>U</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: "13px", fontWeight: 600,
              color: "rgba(255,255,255,0.8)",
              fontFamily: "'Trebuchet MS', sans-serif",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>username</p>
            <p style={{
              fontSize: "11px", color: "rgba(255,255,255,0.25)",
              fontFamily: "'Trebuchet MS', sans-serif",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>user@email.com</p>
          </div>

          <button style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
            <LogOut size={13} color="rgba(255,255,255,0.2)" />
          </button>
        </div>
      </div>
    </aside>
  )
}