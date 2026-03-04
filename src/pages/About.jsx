import { Shell } from '../components/Layout'

export default function About() {
  return (
    <Shell>
      <div className="container">
        <header style={{ marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize:   'clamp(1.75rem, 4vw, 2.25rem)',
              fontWeight: '500',
              lineHeight: '1.2',
            }}
          >
            About
          </h1>
        </header>

        <hr style={{ margin: '2rem 0' }} />

        <div style={{ fontSize: '1.05rem', lineHeight: '1.85', color: 'var(--foreground)' }}>
          <p>
            <em>The Quiet Journal</em> is a slow archive of engineering thought.
            It is not a content feed. It is not a tutorial hub. It is a place
            for reflection — where systems thinking meets software craftsmanship.
          </p>

          <p>
            Essays here are written with deliberate care. They may take months
            to finish. They sit at the intersection of the technical and the
            philosophical, exploring not just <em>how</em> things work, but
            why certain approaches endure while others dissolve.
          </p>

          <p>
            The visual restraint is intentional. White space is not emptiness —
            it is the silence between sentences. Typography is not decoration —
            it is the architecture of thought on a page.
          </p>

          <blockquote>
            A warm archive of engineering thought. Quiet on the surface.
            Structured beneath. Built with discipline.
          </blockquote>

          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', marginTop: '3rem' }}>
            Guest contributions are occasionally accepted. If you have an essay
            that belongs here, you know how to find me.
          </p>
        </div>
      </div>
    </Shell>
  )
}