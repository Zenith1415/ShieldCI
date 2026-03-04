"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section
      id="hero"
      className="relative mx-auto w-full pt-36 px-6 text-center md:px-8 
      min-h-[calc(100vh-40px)] overflow-hidden 
      bg-[linear-gradient(to_bottom,#0A0A0A,transparent_30%,#3a0668_78%,#5A0B91_100%)] 
      rounded-b-xl"
    >
      {/* Grid Background */}
      <div
        className="absolute -z-10 inset-0 opacity-60 h-[600px] w-full 
        bg-[linear-gradient(to_right,#5A0B9130_1px,transparent_1px),linear-gradient(to_bottom,#5A0B9130_1px,transparent_1px)]
        bg-[size:6rem_5rem] 
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#0A0A0A_70%,transparent_110%)]"
      />

      {/* Globe / Radial Accent -- properly anchored to bottom */}
      <div
        className="absolute left-1/2 bottom-[-320px] md:bottom-[-350px] lg:bottom-[-420px]
        h-[600px] w-[800px] md:h-[700px] md:w-[1200px] lg:h-[900px] lg:w-[160%] 
        -translate-x-1/2 rounded-[100%] border border-[#5A0B91]/60 bg-[#0A0A0A]
        bg-[radial-gradient(closest-side,#0A0A0A_78%,#5A0B91)] 
        animate-globe-pulse"
      />

      {/* Eyebrow Badge */}
      <a href="#features" className="group inline-block">
        <span
          className="text-sm text-[#b388e0] mx-auto px-5 py-2 
          bg-gradient-to-tr from-[#5A0B91]/15 via-[#5A0B91]/10 to-transparent  
          border-[2px] border-[#5A0B91]/30 
          rounded-3xl w-fit tracking-tight uppercase flex items-center justify-center
          transition-colors hover:border-[#5A0B91]/50"
        >
          AI-Powered Security for CI/CD
          <ChevronRight className="inline w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </a>

      {/* Title -- first line spans full width */}
      <h1
        className="animate-hero-fade-in 
        bg-gradient-to-br from-white from-30% to-[#b388e0]/50 
        bg-clip-text py-6 text-5xl font-semibold leading-[1.05] tracking-tighter 
        text-transparent sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]
        max-w-6xl mx-auto"
      >
        Your CI/CD pipeline has vulnerabilities.
        <br className="hidden sm:block" />
        <span className="text-white/90">We fix them before you ship.</span>
      </h1>

      {/* Subtitle */}
      <p
        className="animate-hero-fade-in mb-12 
        text-lg tracking-tight text-[#888] max-w-2xl mx-auto leading-relaxed
        md:text-xl [animation-delay:200ms]"
      >
        ShieldCI scans every commit, detects vulnerabilities, generates AI-powered
        fixes, and raises pull requests — all automatically. Security on autopilot.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-hero-fade-in [animation-delay:400ms]">
        <Button
          asChild
          className="w-fit md:w-52 z-20 tracking-tighter text-center rounded-lg
          bg-white text-[#0A0A0A] hover:bg-[#e0ccf5] text-base font-medium h-11 px-8"
        >
          <a href="/signup">Get Started Free</a>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-fit md:w-52 z-20 tracking-tighter text-center rounded-lg
          border-[#5A0B91]/40 bg-transparent text-white hover:bg-[#5A0B91]/10 hover:border-[#5A0B91]/60 text-base font-medium h-11 px-8"
        >
          <a href="#how-it-works">See How It Works</a>
        </Button>
      </div>

      {/* Bottom fade overlay */}
      <div
        className="animate-hero-fade-up relative mt-32 
        after:absolute after:inset-0 after:z-50 
        after:[background:linear-gradient(to_top,#0A0A0A_10%,transparent)]"
      />
    </section>
  )
}
