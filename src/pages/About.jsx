import { Shell } from '../components/Layout'

export default function About() {
  return (
    <Shell>
      <div className="container" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }} className="animate-fade-in-up">
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '700',
              fontStyle: 'italic',
              lineHeight: '1.2',
              marginBottom: '0.5rem',
            }}
          >
            About
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            The story behind the journal.
          </p>
        </div>

        <hr />

        {/* Content card */}
        <div
          className="animate-fade-in-up delay-1"
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            padding: 'clamp(1.5rem, 4vw, 3rem)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '1.05rem', lineHeight: '1.85', color: 'var(--text-primary)' }}>
            <p>
              <em style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>The Quiet Journal</em> is a slow archive of thoughtful writing.
              It is not a content feed. It is not a tutorial hub. It is a place
              for reflection — where systems thinking meets creative craft.
            </p>

            <p>
              Essays here are written with deliberate care. They may take months
              to finish. They sit at the intersection of the technical and the
              philosophical, exploring not just <em>how</em> things work, but
              why certain approaches endure while others dissolve.
            </p>

            <p>
              The visual warmth is intentional. White space is not emptiness —
              it is the silence between sentences. Typography is not decoration —
              it is the architecture of thought on a page.
            </p>

            <blockquote>
              A warm archive of thoughtful writing. Quiet on the surface.
              Structured beneath. Built with care.
            </blockquote>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '2rem' }}>
              Guest contributions are occasionally accepted. If you have an essay
              that belongs here, you know how to find me.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  )
}