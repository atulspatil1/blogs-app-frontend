import { useParams, Link } from 'react-router-dom'
import { Shell }            from '../components/Layout'
import { ReadingProgress }  from '../components/ReadingProgress'
import { CommentSection }   from '../components/Comments'
import { NewsletterSection } from '../components/Newsletter'
import { PostMeta }          from '../components/PostCard'
import { useAsync }          from '../hooks/useApi'
import { posts }             from '../api/client'

// ── Lightweight Markdown-lite renderer ────────────────
function ArticleBody({ content }) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean)

  return (
    <div style={{ lineHeight: '1.85', fontSize: '1.05rem', color: 'var(--foreground)' }}>
      {paragraphs.map((p, i) => {
        if (p.startsWith('> '))   return <blockquote key={i}>{p.replace(/^> /, '')}</blockquote>
        if (p.startsWith('## '))  return <h2 key={i} style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: '500', marginTop: '2.5rem', marginBottom: '1rem' }}>{p.replace(/^## /, '')}</h2>
        if (p.startsWith('### ')) return <h3 key={i} style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem',  fontWeight: '500', marginTop: '2rem',   marginBottom: '0.75rem' }}>{p.replace(/^### /, '')}</h3>
        if (p.startsWith('```'))  return <pre key={i}><code>{p.replace(/^```[a-z]*\n?/, '').replace(/```$/, '')}</code></pre>
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
        <div className="container">
          {[80, 50, 95, 70, 85].map((w, i) => (
            <div key={i} style={{ height: i === 0 ? '2rem' : '0.9rem', width: `${w}%`, background: 'var(--secondary)', borderRadius: '2px', marginBottom: '1rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
        </div>
      </Shell>
    )
  }

  if (error || !post) {
    return (
      <Shell>
        <div className="container" style={{ paddingTop: '2rem' }}>
          <p style={{ color: 'var(--muted-foreground)' }}>
            {error === '404' ? 'Essay not found.' : 'Unable to load essay.'}
          </p>
          <Link to="/" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>← Back to essays</Link>
        </div>
      </Shell>
    )
  }

  return (
    <>
      <ReadingProgress />
      <Shell>
        <div className="container">

          {/* ── Article header ── */}
          <header style={{ marginBottom: '2.5rem' }}>
            {post.categories?.[0] && (
              <Link to={`/category/${post.categories[0].toLowerCase().replace(/\s+/g, '-')}`} style={{ textDecoration: 'none' }}>
                <span className="category-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
                  {post.categories[0]}
                </span>
              </Link>
            )}

            <h1
              style={{
                fontFamily:   'var(--font-heading)',
                fontSize:     'clamp(1.75rem, 5vw, 2.5rem)',
                fontWeight:   '500',
                lineHeight:   '1.15',
                marginBottom: '1.25rem',
              }}
            >
              {post.title}
            </h1>

            <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', margin: '0 0 0.4rem' }}>
              By {post.authorUsername}
            </p>
            <PostMeta categories={[]} publishedAt={post.publishedAt} content={post.content} />
          </header>

          <hr style={{ margin: '2.5rem 0' }} />

          {/* ── Article body ── */}
          <article>
            {post.summary && (
              <p style={{ fontSize: '1.15rem', lineHeight: '1.75', fontWeight: '300', marginBottom: '2rem' }}>
                {post.summary}
              </p>
            )}
            {post.content && <ArticleBody content={post.content} />}
          </article>

          {/* ── Tags ── */}
          {post.tags?.length > 0 && (
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                Filed under:{' '}
                {post.tags.map((tag, i) => (
                  <span key={tag}>
                    <Link
                      to={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                      style={{ color: 'var(--muted-foreground)', transition: 'color 0.2s ease' }}
                      onMouseEnter={(e) => (e.target.style.color = 'var(--primary)')}
                      onMouseLeave={(e) => (e.target.style.color = 'var(--muted-foreground)')}
                    >
                      {tag}
                    </Link>
                    {i < post.tags.length - 1 && ' · '}
                  </span>
                ))}
              </span>
            </div>
          )}

          <NewsletterSection />
          <CommentSection postId={post.id} initialComments={post.comments} />

          <div style={{ marginTop: '4rem' }}>
            <Link
              to="/"
              style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--primary)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--muted-foreground)')}
            >
              ← All essays
            </Link>
          </div>
        </div>
      </Shell>
    </>
  )
}