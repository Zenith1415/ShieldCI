"use client"

import { ArrowRight, GitPullRequest, MessageSquare, Shield } from "lucide-react"

export function SolutionSection() {
  return (
    <section id="solution" className="relative py-32 px-6 md:px-8 overflow-hidden">
      {/* Subtle purple glow behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#5A0B91]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-sm font-medium uppercase tracking-widest text-[#5A0B91]">
            The Solution
          </span>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tighter text-white sm:text-5xl md:text-6xl">
            Meet{" "}
            <span className="bg-gradient-to-r from-[#5A0B91] to-[#b388e0] bg-clip-text text-transparent">
              ShieldCI
            </span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-[#a0a0a0] leading-relaxed">
            The only platform that completes the full security loop: detect
            vulnerabilities, generate AI fixes, raise pull requests, and update
            your CI pipeline. All automatically.
          </p>
        </div>

        {/* Solution Visual */}
        <div className="scroll-animate grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Detect */}
          <div className="group relative flex flex-col rounded-2xl border border-[#5A0B91]/20 bg-gradient-to-b from-[#5A0B91]/5 to-[#0A0A0A] p-10 transition-all duration-500 hover:border-[#5A0B91]/40">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5A0B91]/15 text-[#b388e0]">
              <Shield className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-white">Detect</h3>
            <p className="text-[#808080] leading-relaxed flex-1">
              Semgrep-powered deep scan against OWASP Top 10 patterns on every
              commit. SQL injection, hardcoded secrets, XSS, auth flaws and more
              are caught instantly.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-[#5A0B91] font-medium">
              <span>Automatic on every push</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Card 2: Fix */}
          <div className="group relative flex flex-col rounded-2xl border border-[#5A0B91]/30 bg-gradient-to-b from-[#5A0B91]/10 to-[#0A0A0A] p-10 transition-all duration-500 hover:border-[#5A0B91]/50 lg:scale-105 lg:shadow-[0_0_60px_rgba(106,13,173,0.15)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#5A0B91] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Core
            </div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5A0B91]/20 text-[#b388e0]">
              <GitPullRequest className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-white">Fix & PR</h3>
            <p className="text-[#808080] leading-relaxed flex-1">
              GPT-4 analyzes the vulnerable code in context, generates a secure
              replacement patch, and raises a pull request with the fix.
              Human stays in control  nothing merges without review.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-[#5A0B91] font-medium">
              <span>AI-generated, human-approved</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Card 3: Explain */}
          <div className="group relative flex flex-col rounded-2xl border border-[#5A0B91]/20 bg-gradient-to-b from-[#5A0B91]/5 to-[#0A0A0A] p-10 transition-all duration-500 hover:border-[#5A0B91]/40">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5A0B91]/15 text-[#b388e0]">
              <MessageSquare className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-white">Explain</h3>
            <p className="text-[#808080] leading-relaxed flex-1">
              Inline PR comments explain the vulnerability, the attack vector,
              OWASP category, and the fix. Like having a senior security
              engineer reviewing every PR.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-[#5A0B91] font-medium">
              <span>Learn while you ship</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
