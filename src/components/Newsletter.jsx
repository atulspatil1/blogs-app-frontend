import { useState } from 'react'

export function NewsletterSection() {
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    // In production: call your newsletter API endpoint here
    setSubmitted(true)
  }

  return (
    <section style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
      <p
        style={{
          fontFamily:   'var(--font-heading)',
          fontSize:     '1.05rem',
          fontStyle:    'italic',
          fontWeight:   '400',
          marginBottom: '0.75rem',
          lineHeight:   '1.5',
        }}
      >
        If these essays resonate, you may subscribe for occasional letters.
      </p>

      {submitted ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
          Thank you. You'll hear from me occasionally.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', maxWidth: '26rem' }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              flex: 1, padding: '0.5rem 0.75rem',
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--foreground)', fontFamily: 'var(--font-body)',
              fontSize: '0.875rem', fontWeight: '300', outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
          />
          <button
            type="submit"
            style={{
              background: 'none', border: '1px solid var(--border)',
              color: 'var(--muted-foreground)', padding: '0.5rem 1rem',
              fontFamily: 'var(--font-body)', fontSize: '0.8rem',
              cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary)' }}
            onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted-foreground)' }}
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  )
}