'use client'

export default function Footer() {
  return (
    <footer
      className="relative py-14 overflow-hidden"
      style={{
        background: 'rgba(5,5,5,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,82,255,0.2), transparent)' }}
      />

      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo & Tagline */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0052FF, #1A66FF)' }}
              >
                <span className="text-white font-bold text-sm font-[family-name:var(--font-space)]">C</span>
              </div>
              <span className="text-off-white font-semibold text-lg font-[family-name:var(--font-space)] tracking-tight">
                Circle
              </span>
            </div>
            <p className="text-muted text-sm max-w-sm leading-relaxed">
              We engineer scale for global enterprises. Elite technical execution, 
              fractional CTO operations, and ultra-performance web infrastructure — 
              for organisations where engineering is a strategic advantage.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              <span className="text-muted text-xs">Accepting mandates — Q3 2025</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-silver font-semibold text-xs mb-5 uppercase tracking-[0.12em] font-[family-name:var(--font-space)]"
            >
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Services', href: '#services' },
                { label: 'Tech Arsenal', href: '#stack' },
                { label: 'Case Studies', href: '#cases' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted text-sm hover:text-off-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4
              className="text-silver font-semibold text-xs mb-5 uppercase tracking-[0.12em] font-[family-name:var(--font-space)]"
            >
              Contact
            </h4>
            <a
              href="mailto:hello@circle.io"
              className="flex items-center gap-2 text-muted hover:text-off-white text-sm transition-colors mb-6 group"
            >
              <svg
                className="w-4 h-4 transition-colors duration-300 group-hover:text-blue"
                style={{ color: '#0052FF' }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              hello@circle.io
            </a>
            <div className="flex gap-3">
              {[
                {
                  label: 'X (Twitter)',
                  path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                },
                {
                  label: 'LinkedIn',
                  path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
                  fillRule: 'evenodd',
                },
                {
                  label: 'GitHub',
                  path: 'M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z',
                  fillRule: 'evenodd',
                },
              ].map(({ label, path, fillRule }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-off-white transition-all duration-300"
                  style={{
                    background: 'rgba(17,17,19,0.8)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = 'rgba(0,82,255,0.3)'
                    el.style.background = 'rgba(0,82,255,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = 'rgba(255,255,255,0.05)'
                    el.style.background = 'rgba(17,17,19,0.8)'
                  }}
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path fillRule={fillRule as 'evenodd' | undefined} clipRule={fillRule ? 'evenodd' : undefined} d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p className="text-muted text-xs">
            © {new Date().getFullYear()} Circle Technology Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted hover:text-off-white text-xs transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-muted hover:text-off-white text-xs transition-colors duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
