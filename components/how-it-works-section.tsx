"use client"

const steps = [
  {
    number: "01",
    title: "Push Code",
    description:
      "A developer pushes a commit or opens a pull request. The ShieldCI GitHub Action triggers automatically.",
  },
  {
    number: "02",
    title: "Deep Scan",
    description:
      "A Docker container with Kali Linux spins up. Semgrep runs a deep scan against OWASP Top 10 patterns on all changed files.",
  },
  {
    number: "03",
    title: "AI Analysis",
    description:
      "GPT-4 via LangChain receives the vulnerable code, understands context, and generates a secure replacement patch specific to your code.",
  },
  {
    number: "04",
    title: "Inline Comment",
    description:
      "ShieldCI posts an inline comment on the exact vulnerable line in your PR explaining the flaw, attack vector, and the fix.",
  },
  {
    number: "05",
    title: "Fix PR Raised",
    description:
      "A new pull request is created with the AI-generated fix, severity level, OWASP category, and full explanation. You review and merge.",
  },
  {
    number: "06",
    title: "Pipeline Hardened",
    description:
      "Your CI workflow .yml is automatically updated with tighter permissions, new security check steps, and env variable validation.",
  },
  {
    number: "07",
    title: "Score Updated",
    description:
      "Your repository Security Score (0-100) updates in real time on the dashboard. Track improvement over every sprint.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-32 px-6 md:px-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#5A0B91]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-sm font-medium uppercase tracking-widest text-[#5A0B91]">
            How It Works
          </span>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tighter text-white sm:text-5xl md:text-6xl">
            Seven steps to{" "}
            <span className="bg-gradient-to-r from-[#5A0B91] to-[#b388e0] bg-clip-text text-transparent">
              zero vulnerabilities
            </span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#5A0B91]/50 via-[#5A0B91]/20 to-transparent md:left-1/2 md:-translate-x-px" />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="scroll-animate relative mb-12 last:mb-0"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={`flex items-start gap-8 md:gap-16 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`ml-16 md:ml-0 md:w-1/2 ${
                    i % 2 === 0 ? "md:text-right md:pr-16" : "md:text-left md:pl-16"
                  }`}
                >
                  <span className="text-sm font-mono font-bold text-[#5A0B91]">
                    {step.number}
                  </span>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#808080]">
                    {step.description}
                  </p>
                </div>

                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex h-3 w-3 items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-[#5A0B91] shadow-[0_0_12px_rgba(106,13,173,0.6)]" />
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
