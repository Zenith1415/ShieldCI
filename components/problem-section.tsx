"use client"

import { useEffect, useRef, useState } from "react"

const problems = [
  {
    number: "01",
    title: "Tools detect, never fix",
    description:
      "Snyk, CodeQL, SonarQube find vulnerabilities but leave you to fix them manually. Security debt piles up sprint after sprint.",
    stat: "87%",
    statLabel: "of alerts ignored",
    accentColor: "#6A0DAD",
  },
  {
    number: "02",
    title: "Nobody has time to audit every PR",
    description:
      "Manual code review for security is slow, error-prone, and impossible to scale across a growing team.",
    stat: "14hrs",
    statLabel: "avg weekly drain per dev",
    accentColor: "#8B2FC9",
  },
  {
    number: "03",
    title: "Vulnerabilities sit unpatched",
    description:
      "Without automated remediation, critical flaws like SQL injection and hardcoded secrets stay in production for months.",
    stat: "206",
    statLabel: "days avg to patch",
    accentColor: "#A855F7",
  },
  {
    number: "04",
    title: "Breaches cost millions",
    description:
      "The average data breach costs $4.45M. Most start with a vulnerability that was detected but never fixed.",
    stat: "$4.45M",
    statLabel: "avg breach cost",
    accentColor: "#C084FC",
  },
]

function AnimatedCounter({ value, inView }: { value: string; inView: boolean }) {
  const [display, setDisplay] = useState("---")

  useEffect(() => {
    if (!inView) return
    const chars = value.split("")
    let current = chars.map(() => "")
    const scrambleChars = "0123456789$Mhrs%"
    let frame = 0
    const maxFrames = 20

    const interval = setInterval(() => {
      frame++
      current = chars.map((char, i) => {
        if (frame > maxFrames * ((i + 1) / chars.length)) return char
        if (/[a-zA-Z$%.]/.test(char) && frame > maxFrames * 0.5) return char
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
      })
      setDisplay(current.join(""))
      if (frame >= maxFrames) clearInterval(interval)
    }, 40)

    return () => clearInterval(interval)
  }, [inView, value])

  return <span>{display}</span>
}

export function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="problem" className="relative py-32 px-6 md:px-8">
      <div className="mx-auto max-w-7xl" ref={sectionRef}>
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-sm font-medium uppercase tracking-widest text-[#6A0DAD] mb-4">
            The Problem
          </span>
          <h2 className="text-balance text-4xl font-semibold tracking-tighter text-white sm:text-5xl md:text-6xl">
            Security tools are{" "}
            <span className="bg-gradient-to-r from-[#6A0DAD] to-[#c9a0ff] bg-clip-text text-transparent">
              broken
            </span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-[#a0a0a0] leading-relaxed">
            Every existing tool stops at detection. They find the problem, show it
            to you, and walk away. Your team is left drowning in security alerts
            with no time to fix them.
          </p>
        </div>

        {/* Problem Cards -- Staggered Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((problem, i) => (
            <div
              key={problem.number}
              className={`scroll-animate group relative rounded-2xl border border-[#ffffff08] bg-[#141414] overflow-hidden
                transition-all duration-700 hover:border-[#6A0DAD]/30
                ${i === 1 ? "lg:translate-y-8" : ""}
                ${i === 2 ? "lg:translate-y-4" : ""}
                ${i === 3 ? "lg:translate-y-12" : ""}
              `}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Top accent line */}
              <div
                className="h-[2px] w-full transition-all duration-700 group-hover:h-[3px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${problem.accentColor}, transparent)`,
                  opacity: 0.6,
                }}
              />

              <div className="p-8 pb-10 flex flex-col min-h-[340px]">
                {/* Number badge */}
                <span
                  className="text-[11px] font-mono tracking-wider px-2.5 py-1 rounded-full w-fit mb-8
                    border transition-colors duration-500"
                  style={{
                    color: problem.accentColor,
                    borderColor: `${problem.accentColor}25`,
                    backgroundColor: `${problem.accentColor}08`,
                  }}
                >
                  {problem.number}
                </span>

                <h3 className="text-xl font-semibold tracking-tight text-white mb-3 leading-snug">
                  {problem.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#707070] flex-1">
                  {problem.description}
                </p>

                {/* Stat at bottom */}
                <div className="mt-8 pt-6 border-t border-[#ffffff06]">
                  <div
                    className="text-3xl font-bold font-mono tracking-tighter transition-colors duration-500"
                    style={{ color: problem.accentColor }}
                  >
                    <AnimatedCounter value={problem.stat} inView={inView} />
                  </div>
                  <span className="text-xs text-[#505050] uppercase tracking-wider mt-1 block">
                    {problem.statLabel}
                  </span>
                </div>
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${problem.accentColor}08 0%, transparent 70%)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
