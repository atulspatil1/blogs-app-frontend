import { Link } from 'react-router-dom'
import { Shell } from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { useAsync } from '../../hooks/useApi'
import { posts, comments as commentsApi } from '../../api/client'
import { formatDate } from '../../utils'

export default function AdminDashboard() {
  const { isAdmin } = useAuth()
  const { data: allPosts, loading: lp } = useAsync(() => posts.list(0, 50))
  const { data: pendingComments, loading: lc } = useAsync(() => commentsApi.pending())

  if (!isAdmin) return null

  const postList = allPosts?.content ?? []
  const commentsList = pendingComments ?? []

  return (
    <Shell>
      <div className="container">
        {/* Header */}
        <div
          className="animate-fade-in-up"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
              fontWeight: '700',
              fontStyle: 'italic',
            }}
          >
            Admin
          </h1>
          <Link to="/admin/new" className="btn btn-primary">
            <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>add</span>
            New essay
          </Link>
        </div>

        <hr />

        {/* ── All essays ── */}
        <section
          className="animate-fade-in-up delay-1"
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              fontStyle: 'italic',
              fontWeight: '600',
              marginBottom: '1rem',
            }}
          >
            All essays
          </h2>

          {lp ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading…</div>
          ) : postList.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', padding: '1rem 0' }}>
              No essays yet.
            </p>
          ) : (
            <div>
              {postList.map((post) => (
                <div
                  key={post.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    transition: 'background var(--transition-fast)',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      {post.status === 'DRAFT' && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#d97706',
                          }}
                        >
                          Draft
                        </span>
                      )}
                      <span style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                      }}>
                        {post.title}
                      </span>
                    </div>
                    <span className="meta" style={{ fontSize: '0.78rem' }}>
                      {post.categories?.join(', ')}
                      {post.categories?.length > 0 && ' · '}
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/admin/edit/${post.id}`} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}>
                      Edit
                    </Link>
                    {post.status !== 'DRAFT' && (
                      <Link to={`/essays/${post.slug}`} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}>
                        View
                      </Link>
                    )}
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem', color: 'var(--error)' }}
                      onClick={() => {
                        if (window.confirm('Delete this essay?')) {
                          posts.delete(post.id).then(() => window.location.reload())
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Pending comments ── */}
        <section
          className="animate-fade-in-up delay-2"
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              fontStyle: 'italic',
              fontWeight: '600',
              marginBottom: '1rem',
            }}
          >
            Pending comments
          </h2>

          {lc ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading…</div>
          ) : commentsList.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <span className="material-symbols-rounded" style={{ color: 'var(--text-secondary)', fontSize: '2rem', display: 'block', marginBottom: '0.5rem', opacity: 0.4 }}>
                chat_bubble_outline
              </span>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem', margin: 0 }}>
                No pending comments.
              </p>
            </div>
          ) : (
            <div>
              {commentsList.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{c.authorName}</span>
                    <span className="meta" style={{ fontSize: '0.78rem' }}>{formatDate(c.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '0.75rem' }}>{c.body}</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                      onClick={() => commentsApi.approve(c.id).then(() => window.location.reload())}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', color: 'var(--error)' }}
                      onClick={() => commentsApi.reject(c.id).then(() => window.location.reload())}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Shell>
  )
}