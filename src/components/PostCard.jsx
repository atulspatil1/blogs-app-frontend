import { Link } from 'react-router-dom'
import { formatDate, readingTime } from '../utils'

// ── Post Meta ──────────────────────────────────────────
export function PostMeta({ categories = [], publishedAt, content = '' }) {
  const category = categories[0]
  return (
    <div className="meta" style={{ lineHeight: 1.4 }}>
      {category && (
        <>
          <span className="category-label">{category}</span>
          <span className="meta-dot">·</span>
        </>
      )}
      <span>{formatDate(publishedAt)}</span>
      {content && (
        <>
          <span className="meta-dot">·</span>
          <span>{readingTime(content)}</span>
        </>
      )}
    </div>
  )
}

// ── Archive Entry ──────────────────────────────────────
export function ArchiveEntry({ post }) {
  return (
    <Link to={`/essays/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article
        style={{ padding: '2rem 0', borderBottom: '1px solid var(--border)', transition: 'opacity 0.2s ease' }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        <h2
          style={{
            fontFamily:   'var(--font-heading)',
            fontSize:     'clamp(1.2rem, 2.5vw, 1.45rem)',
            fontWeight:   '500',
            marginBottom: '0.5rem',
            color:        'var(--foreground)',
            lineHeight:   '1.25',
          }}
        >
          {post.title}
        </h2>

        {post.summary && (
          <p
            style={{
              fontSize:        '0.95rem',
              color:           'var(--muted-foreground)',
              marginBottom:    '0.65rem',
              lineHeight:      '1.55',
              display:         '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow:        'hidden',
            }}
          >
            {post.summary}
          </p>
        )}

        <PostMeta categories={post.categories} publishedAt={post.publishedAt} />
      </article>
    </Link>
  )
}

// ── Year Group ─────────────────────────────────────────
export function YearGroup({ year, posts }) {
  return (
    <section style={{ marginBottom: '1rem' }}>
      <h3
        style={{
          fontFamily:   'var(--font-heading)',
          fontSize:     '1.35rem',
          fontWeight:   '400',
          color:        'var(--muted-foreground)',
          marginTop:    '2.5rem',
          marginBottom: '0',
          fontStyle:    'italic',
        }}
      >
        {year}
      </h3>
      {posts.map((post) => (
        <ArchiveEntry key={post.id} post={post} />
      ))}
    </section>
  )
}

// ── Archive List ───────────────────────────────────────
export function ArchiveList({ posts = [] }) {
  const byYear = posts.reduce((acc, post) => {
    const year = post.publishedAt
      ? new Date(post.publishedAt).getFullYear()
      : 'Drafts'
    if (!acc[year]) acc[year] = []
    acc[year].push(post)
    return acc
  }, {})

  const years = Object.keys(byYear).sort((a, b) => b - a)

  if (posts.length === 0) {
    return (
      <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem', marginTop: '3rem' }}>
        No essays found.
      </p>
    )
  }

  return (
    <div>
      {years.map((year) => (
        <YearGroup key={year} year={year} posts={byYear[year]} />
      ))}
    </div>
  )
}

// ── Pagination ─────────────────────────────────────────
export function Pagination({ currentPage, totalPages, hasNext, hasPrev, goToPage }) {
  if (totalPages <= 1) return null

  const btnStyle = (active) => ({
    background: 'none',
    border:     'none',
    fontSize:   '0.85rem',
    color:      active ? 'var(--primary)' : 'var(--muted-foreground)',
    cursor:     active ? 'pointer' : 'default',
    fontFamily: 'var(--font-body)',
    padding:    '0',
  })

  return (
    <div
      style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        marginTop:      '3rem',
        paddingTop:     '2rem',
        borderTop:      '1px solid var(--border)',
      }}
    >
      <button onClick={() => goToPage(currentPage - 1)} disabled={!hasPrev} style={btnStyle(hasPrev)}>
        ← Older
      </button>
      <span className="meta">Page {currentPage + 1} of {totalPages}</span>
      <button onClick={() => goToPage(currentPage + 1)} disabled={!hasNext} style={btnStyle(hasNext)}>
        Newer →
      </button>
    </div>
  )
}

// ── Loading Skeleton ───────────────────────────────────
export function LoadingSkeleton() {
  return (
    <div>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ padding: '2rem 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ height: '1.4rem', width: `${60 + i * 12}%`, background: 'var(--secondary)', borderRadius: '2px', marginBottom: '0.75rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: '0.9rem', width: '85%', background: 'var(--muted)', borderRadius: '2px', marginBottom: '0.5rem' }} />
          <div style={{ height: '0.9rem', width: '65%', background: 'var(--muted)', borderRadius: '2px', marginBottom: '0.75rem' }} />
          <div style={{ height: '0.75rem', width: '30%', background: 'var(--border)', borderRadius: '2px' }} />
        </div>
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}

// ── Error Message ──────────────────────────────────────
export function ErrorMessage({ message }) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted-foreground)', fontStyle: 'italic', fontSize: '0.95rem' }}>
      {message || 'Something went wrong. Please try again.'}
    </div>
  )
}