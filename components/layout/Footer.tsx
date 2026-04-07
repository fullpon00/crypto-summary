export function Footer() {
  return (
    <footer
      className="border-t py-8 mt-16"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-bold" style={{ color: 'var(--accent-gold)' }}>
          Crypto Summary
        </span>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          © {new Date().getFullYear()} Crypto Summary. For informational purposes only.
        </p>
      </div>
    </footer>
  )
}
