"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="relative py-32 px-6 md:px-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#5A0B9115_0%,transparent_70%)] pointer-events-none" />

      <div className="scroll-animate relative mx-auto max-w-4xl text-center">
        {/* Decorative grid behind */}
        <div className="absolute inset-0 -z-10 opacity-30 bg-[linear-gradient(to_right,#5A0B9122_1px,transparent_1px),linear-gradient(to_bottom,#5A0B9122_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)]" />

        <h2 className="text-balance text-4xl font-semibold tracking-tighter text-white sm:text-5xl md:text-6xl">
          Stop shipping{" "}
          <span className="bg-gradient-to-r from-[#5A0B91] to-[#b388e0] bg-clip-text text-transparent">
            vulnerabilities
          </span>
        </h2>
        <p className="mt-6 max-w-xl mx-auto text-lg text-[#a0a0a0] leading-relaxed">
          Join the teams who have switched from detection-only tools to full
          automated remediation. Set up in under 5 minutes.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            className="rounded-lg bg-[#5A0B91] text-white hover:bg-[#7b1fc4] hover:shadow-[0_0_30px_rgba(106,13,173,0.4)] text-base font-medium h-12 px-8 transition-all"
          >
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-lg border-[#5A0B91]/30 bg-transparent text-white hover:bg-[#5A0B91]/10 hover:border-[#5A0B91]/50 text-base font-medium h-12 px-8"
          >
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Button>
        </div>

        {/* Stats Row */}
        <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { value: "50K+", label: "Vulnerabilities Fixed" },
            { value: "10K+", label: "PRs Raised" },
            { value: "2,500+", label: "Repos Protected" },
            { value: "99.2%", label: "Fix Accuracy" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-[#808080]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
