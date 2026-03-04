"use client"

const features = [
  {
    tag: "SCAN",
    title: "OWASP Top 10 Scanning",
    description:
      "Deep Semgrep scans against industry-standard vulnerability patterns on every commit and PR.",
    visual: (
      <div className="font-mono text-[11px] leading-relaxed text-[#505050] select-none">
        <div><span className="text-[#6A0DAD]">$</span> semgrep --config owasp</div>
        <div className="text-[#c9a0ff]/60">{'> scanning 247 files...'}</div>
        <div className="text-red-400/70">{'> 3 critical findings'}</div>
        <div className="text-[#6A0DAD]/70">{'> generating patches...'}</div>
      </div>
    ),
    span: "lg:col-span-2",
    height: "min-h-[320px]",
  },
  {
    tag: "FIX",
    title: "AI-Powered Fix Generation",
    description:
      "GPT-4 via LangChain analyzes vulnerable code in context and generates secure replacement patches.",
    visual: (
      <div className="font-mono text-[11px] leading-relaxed select-none">
        <div className="text-red-400/50 line-through decoration-red-400/30">
          {'query = "SELECT * FROM users WHERE id=" + user_id'}
        </div>
        <div className="text-emerald-400/60 mt-1">
          {'query = "SELECT * FROM users WHERE id = %s"'}
        </div>
        <div className="text-emerald-400/40">
          {'cursor.execute(query, (user_id,))'}
        </div>
      </div>
    ),
    span: "lg:col-span-1",
    height: "min-h-[320px]",
  },
  {
    tag: "SHIP",
    title: "Automatic Fix PRs",
    description:
      "A brand new pull request with the fix, severity level, OWASP category, and full explanation. Ready to merge.",
    visual: (
      <div className="flex items-center gap-3 select-none">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6A0DAD]/20 border border-[#6A0DAD]/30">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z" fill="#c9a0ff" fillOpacity="0.6"/>
          </svg>
        </div>
        <div className="text-[11px] font-mono">
          <div className="text-[#c9a0ff]/70">fix/sql-injection-patch</div>
          <div className="text-[#404040]">ready to merge</div>
        </div>
      </div>
    ),
    span: "lg:col-span-1",
    height: "min-h-[320px]",
  },
  {
    tag: "REVIEW",
    title: "Inline PR Comments",
    description:
      "Explanatory comments posted directly on the vulnerable line in your original PR. Review in context.",
    visual: (
      <div className="rounded-lg border border-[#ffffff08] bg-[#0d0d0d] p-3 font-mono text-[10px] select-none">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 rounded-full bg-[#6A0DAD]/30 flex items-center justify-center text-[8px] text-[#c9a0ff]">S</div>
          <span className="text-[#c9a0ff]/60">ShieldCI Bot</span>
          <span className="text-[#303030] ml-auto">now</span>
        </div>
        <div className="text-[#606060] leading-relaxed">
          {'This concatenation is vulnerable to SQL injection (OWASP A03:2021). Use parameterized queries instead.'}
        </div>
      </div>
    ),
    span: "lg:col-span-1",
    height: "min-h-[320px]",
  },
  {
    tag: "HARDEN",
    title: "CI Workflow Hardening",
    description:
      "Automatically updates your .yml pipeline with tighter permissions, validation steps, and security checks.",
    visual: (
      <div className="font-mono text-[11px] leading-relaxed select-none">
        <div className="text-[#404040]">permissions:</div>
        <div className="text-[#c9a0ff]/50">{'  contents: read'}</div>
        <div className="text-[#c9a0ff]/50">{'  pull-requests: write'}</div>
        <div className="text-emerald-400/40 mt-1">{'+ security-events: write'}</div>
        <div className="text-emerald-400/40">{'+ actions: none'}</div>
      </div>
    ),
    span: "lg:col-span-1",
    height: "min-h-[320px]",
  },
  {
    tag: "TRACK",
    title: "Security Score Dashboard",
    description:
      "Track your repo's security health 0-100 over time. See vulnerabilities found, fixed, and merged at a glance.",
    visual: (
      <div className="flex items-end gap-[6px] h-12 select-none">
        {[28, 35, 22, 45, 55, 50, 65, 72, 68, 80, 85, 92].map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-sm transition-all duration-300"
            style={{
              height: `${h}%`,
              backgroundColor: h > 70 ? "#6A0DAD" : h > 45 ? "#6A0DAD80" : "#6A0DAD30",
            }}
          />
        ))}
      </div>
    ),
    span: "lg:col-span-2",
    height: "min-h-[320px]",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-sm font-medium uppercase tracking-widest text-[#6A0DAD] mb-4">
            Features
          </span>
          <h2 className="text-balance text-4xl font-semibold tracking-tighter text-white sm:text-5xl md:text-6xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-[#6A0DAD] to-[#c9a0ff] bg-clip-text text-transparent">
              ship securely
            </span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-[#a0a0a0] leading-relaxed">
            From detection to remediation to tracking. ShieldCI covers the
            entire security lifecycle inside your CI/CD pipeline.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <div
              key={feature.tag}
              className={`scroll-animate group relative rounded-2xl border border-[#ffffff06] bg-[#141414] overflow-hidden
                transition-all duration-700 hover:border-[#6A0DAD]/25
                ${feature.span} ${feature.height}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* Left accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#6A0DAD]/40 via-[#6A0DAD]/10 to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="p-8 flex flex-col h-full relative z-10">
                {/* Tag */}
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#6A0DAD] mb-6 block">
                  {feature.tag}
                </span>

                {/* Visual element */}
                <div className="mb-6 p-4 rounded-xl bg-[#0d0d0d] border border-[#ffffff04] 
                  transition-all duration-500 group-hover:border-[#6A0DAD]/10 group-hover:bg-[#0f0a14]">
                  {feature.visual}
                </div>

                {/* Text */}
                <h3 className="text-lg font-semibold tracking-tight text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#606060] flex-1">
                  {feature.description}
                </p>

                {/* Bottom corner glow on hover */}
                <div className="absolute bottom-0 right-0 w-32 h-32 rounded-tl-full
                  bg-[radial-gradient(circle_at_100%_100%,#6A0DAD08,transparent_70%)]
                  opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
