import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Shell } from '../components/Layout'
import { ReadingProgress } from '../components/ReadingProgress'
import { CommentSection } from '../components/Comments'
import { NewsletterSection } from '../components/Newsletter'
import { PostMeta } from '../components/PostCard'
import { useAsync } from '../hooks/useApi'
import { posts } from '../api/client'

// ── Lightweight Markdown-lite renderer ────────────────
function ArticleBody({ content }) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean)

  return (
    <div style={{ lineHeight: '1.85', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
      {paragraphs.map((p, i) => {
        if (p.startsWith('> ')) return <blockquote key={i}>{p.replace(/^> /, '')}</blockquote>
        if (p.startsWith('## ')) return <h2 key={i} style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: '600', marginTop: '2.5rem', marginBottom: '1rem' }}>{p.replace(/^## /, '')}</h2>
        if (p.startsWith('### ')) return <h3 key={i} style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '600', marginTop: '2rem', marginBottom: '0.75rem' }}>{p.replace(/^### /, '')}</h3>
        if (p.startsWith('```')) return <pre key={i}><code>{p.replace(/^```[a-z]*\n?/, '').replace(/```$/, '')}</code></pre>
        return <p key={i}>{p}</p>
      })}
    </div>
  )
}

export default function PostDetail() {
  const { slug } = useParams()
  const { data: post, loading, error } = useAsync(() => posts.bySlug(slug), [slug])

  if (loading) {
    return (
      <Shell>
        <div className="container" style={{ maxWidth: '48rem', margin: '0 auto' }}>
          {/* Shimmer skeleton */}
          {[80, 50, 95, 70, 85].map((w, i) => (
            <div key={i} style={{
              height: i === 0 ? '2.5rem' : '1rem',
              width: `${w}%`,
              background: `linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-light) 50%, var(--bg-secondary) 75%)`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s ease infinite',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem',
            }} />
          ))}
        </div>
      </Shell>
    )
  }

  if (error || !post) {
    return (
      <Shell>
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '3rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '1rem' }}>
            article
          </span>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1rem' }}>
            {error === '404' ? 'Essay not found.' : 'Unable to load essay.'}
          </p>
          <Link to="/" className="btn btn-outline">
            <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>arrow_back</span>
            Back to essays
          </Link>
        </div>
      </Shell>
    )
  }

  return (
    <>
      <ReadingProgress />
      <Shell>
        {post && (
          <Helmet>
            <title>{post.title} — The Quiet Journal</title>
            <meta name="description" content={post.summary || `Read "${post.title}" on The Quiet Journal.`} />
          </Helmet>
        )}
        <div className="container" style={{ maxWidth: '48rem', margin: '0 auto' }}>

          {/* ── Article header ── */}
          <header style={{ marginBottom: '2.5rem' }} className="animate-fade-in-up">
            {post.categories?.[0] && (
              <Link to={`/category/${post.categories[0].toLowerCase().replace(/\s+/g, '-')}`} style={{ textDecoration: 'none' }}>
                <span className="category-label" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                  {post.categories[0]}
                </span>
              </Link>
            )}

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.85rem, 5vw, 2.75rem)',
                fontWeight: '700',
                lineHeight: '1.15',
                marginBottom: '1.25rem',
              }}
            >
              {post.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--gradient-sage)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                }}
              >
                {(post.authorUsername || 'A')[0].toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', margin: 0, lineHeight: '1.3' }}>
                  {post.authorUsername}
                </p>
                <PostMeta post={post} style={{ fontSize: '0.8rem' }} />
              </div>
            </div>
          </header>

          <hr />

          {/* ── Article body ── */}
          <article className="animate-fade-in-up delay-1">
            {post.summary && (
              <p style={{
                fontSize: '1.15rem',
                lineHeight: '1.75',
                fontWeight: '400',
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
                marginBottom: '2rem',
                borderLeft: '3px solid var(--accent)',
                paddingLeft: '1.25rem',
              }}>
                {post.summary}
              </p>
            )}
            {post.content && <ArticleBody content={post.content} />}
          </article>

          {/* ── Tags ── */}
          {post.tags?.length > 0 && (
            <div style={{
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                Filed under:
              </span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--accent-glow)',
                    color: 'var(--accent)',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-glow)'; e.currentTarget.style.color = 'var(--accent)'; }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <NewsletterSection />
          <CommentSection postId={post.id} initialComments={post.comments} />

          <div style={{ marginTop: '3rem' }}>
            <Link to="/" className="btn btn-ghost" style={{ paddingLeft: '0' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>arrow_back</span>
              All essays
            </Link>
          </div>
        </div>
      </Shell>
    </>
  )
}