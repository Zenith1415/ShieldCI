import Link from "next/link"

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Installation Guide", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-[#5A0B91]/10 px-6 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-0">
              <span className="text-xl font-bold tracking-tight text-white">
                Shield
              </span>
              <span className="text-xl font-bold tracking-tight text-[#5A0B91]">
                CI
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#808080]">
              AI-powered security remediation that integrates directly into your
              CI/CD pipeline. Detect, fix, and ship securely.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold tracking-tight text-white">
                {title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#808080] transition-colors hover:text-[#b388e0]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#5A0B91]/10 pt-8 sm:flex-row">
          <p className="text-sm text-[#808080]">
            {"2026 ShieldCI. All rights reserved."}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-[#808080] hover:text-[#b388e0] transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-[#808080] hover:text-[#b388e0] transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-[#808080] hover:text-[#b388e0] transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
