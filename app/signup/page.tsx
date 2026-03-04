"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, Shield, GitBranch, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const highlights = [
  {
    icon: Shield,
    text: "OWASP Top 10 scanning on every commit",
  },
  {
    icon: GitBranch,
    text: "AI-generated fix PRs in seconds",
  },
  {
    icon: Zap,
    text: "Set up in under 5 minutes",
  },
]

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="relative flex min-h-screen bg-[#0A0A0A]">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-[#5A0B91]/6 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#5A0B91]/4 rounded-full blur-[120px]" />
      </div>

      {/* Left Side - Branding (desktop only) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#5A0B9112_1px,transparent_1px),linear-gradient(to_bottom,#5A0B9112_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:linear-gradient(to_right,#000_50%,transparent_100%)]" />

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-0 mb-12">
            <span className="text-3xl font-bold tracking-tight text-white">
              Shield
            </span>
            <span className="text-3xl font-bold tracking-tight text-[#5A0B91]">
              CI
            </span>
          </Link>

          <h1 className="text-4xl font-semibold tracking-tighter text-white xl:text-5xl">
            Security on{" "}
            <span className="bg-gradient-to-r from-[#5A0B91] to-[#b388e0] bg-clip-text text-transparent">
              autopilot
            </span>
          </h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-[#808080]">
            Join thousands of developers who ship secure code without slowing
            down. No more security debt.
          </p>

          {/* Highlights */}
          <div className="mt-12 flex flex-col gap-5">
            {highlights.map((item) => (
              <div key={item.text} className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#5A0B91]/10 text-[#b388e0]">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-sm text-[#a0a0a0]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="relative flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-10 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-0">
              <span className="text-2xl font-bold tracking-tight text-white">
                Shield
              </span>
              <span className="text-2xl font-bold tracking-tight text-[#5A0B91]">
                CI
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-[#808080]">
              Start protecting your repos in minutes. Free to get started.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-[#5A0B91]/15 bg-[#0A0A0A]/80 backdrop-blur-xl p-8 shadow-[0_0_80px_rgba(106,13,173,0.08)]">
            {/* GitHub OAuth first */}
            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-[#5A0B91]/20 bg-transparent text-sm font-medium text-white transition-all hover:bg-[#5A0B91]/5 hover:border-[#5A0B91]/40"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Sign up with GitHub
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#5A0B91]/15" />
              <span className="text-xs text-[#555]">or</span>
              <div className="h-px flex-1 bg-[#5A0B91]/15" />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
              }}
              className="flex flex-col gap-5"
            >
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-[#a0a0a0]">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="h-11 w-full rounded-lg border border-[#5A0B91]/20 bg-[#0A0A0A] px-4 text-sm text-white placeholder:text-[#555] outline-none transition-all focus:border-[#5A0B91]/50 focus:shadow-[0_0_20px_rgba(106,13,173,0.1)]"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-[#a0a0a0]">
                  Work email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-11 w-full rounded-lg border border-[#5A0B91]/20 bg-[#0A0A0A] px-4 text-sm text-white placeholder:text-[#555] outline-none transition-all focus:border-[#5A0B91]/50 focus:shadow-[0_0_20px_rgba(106,13,173,0.1)]"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-[#a0a0a0]">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="h-11 w-full rounded-lg border border-[#5A0B91]/20 bg-[#0A0A0A] px-4 pr-11 text-sm text-white placeholder:text-[#555] outline-none transition-all focus:border-[#5A0B91]/50 focus:shadow-[0_0_20px_rgba(106,13,173,0.1)]"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#a0a0a0] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="mt-2 h-11 w-full rounded-lg bg-[#5A0B91] text-white font-medium hover:bg-[#7b1fc4] hover:shadow-[0_0_30px_rgba(106,13,173,0.3)] transition-all"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="mt-5 text-center text-xs text-[#555] leading-relaxed">
              {"By signing up, you agree to our "}
              <a href="#" className="text-[#5A0B91] hover:text-[#b388e0] transition-colors">
                Terms
              </a>
              {" and "}
              <a href="#" className="text-[#5A0B91] hover:text-[#b388e0] transition-colors">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          {/* Bottom link */}
          <p className="mt-8 text-center text-sm text-[#808080]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#5A0B91] font-medium hover:text-[#b388e0] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
