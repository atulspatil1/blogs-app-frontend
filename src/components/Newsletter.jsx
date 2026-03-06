import { useState } from 'react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section
      style={{
        marginTop: '3rem',
        padding: '2rem',
        background: 'var(--accent-glow)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
        <span className="material-symbols-rounded" style={{ color: 'var(--accent)', fontSize: '1.5rem', marginTop: '0.1rem' }}>
          mail_outline
        </span>
        <div>
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              fontStyle: 'italic',
              fontWeight: '500',
              marginBottom: '0.25rem',
              lineHeight: '1.4',
            }}
          >
            Stay in the loop
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
            If these essays resonate, subscribe for occasional letters.
          </p>
        </div>
      </div>

      {submitted ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
        }}>
          <span className="material-symbols-rounded" style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>check_circle</span>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
            Thank you. You'll hear from me occasionally.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', maxWidth: '28rem' }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ flex: 1, borderRadius: 'var(--radius-full)', padding: '0.6rem 1rem' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
            Subscribe
          </button>
        </form>
      )}
    </section>
  )
}