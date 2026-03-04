import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shell } from '../../components/Layout'
import { LoadingSkeleton, ErrorMessage, Pagination } from '../../components/PostCard'
import { usePaginated, useAsync } from '../../hooks/useApi'
import { posts as postsApi, comments as commentsApi } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils'

// ── Admin Post Row ─────────────────────────────────────
function AdminPostRow({ post, onDelete }) {
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()
  const isDraft  = post.status === 'DRAFT'

  const handleDelete = async () => {
    if (!confirm(`Delete "${post.title}"?`)) return
    setDeleting(true)
    try {
      await postsApi.delete(post.id)
      onDelete(post.id)
    } catch (err) {
      alert(err.message)
      setDeleting(false)
    }
  }

  const actionBtn = (label, onClick, danger = false) => (
    <button
      onClick={onClick}
      disabled={deleting && danger}
      style={{
        background: 'none', border: 'none', padding: '0',
        fontFamily: 'var(--font-body)', fontSize: '0.8rem',
        color: 'var(--muted-foreground)', cursor: 'pointer',
        opacity: deleting && danger ? 0.4 : 1, transition: 'color 0.2s ease',
      }}
      onMouseEnter={(e) => (e.target.style.color = danger ? '#c0392b' : 'var(--primary)')}
      onMouseLeave={(e) => (e.target.style.color = 'var(--muted-foreground)')}
    >
      {label}
    </button>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          {isDraft && (
            <span style={{ fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted-foreground)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
              Draft
            </span>
          )}
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {post.title}
          </span>
        </div>
        <div className="meta">
          {post.categories?.join(', ')}
          {post.categories?.length > 0 && <span className="meta-dot">·</span>}
          {formatDate(post.publishedAt || post.createdAt)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
        {actionBtn('Edit', () => navigate(`/admin/edit/${post.id}`))}
        {!isDraft && (
          <Link
            to={`/essays/${post.slug}`}
            target="_blank"
            style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--primary)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--muted-foreground)')}
          >
            View
          </Link>
        )}
        {actionBtn(deleting ? '…' : 'Delete', handleDelete, true)}
      </div>
    </div>
  )
}

// ── Pending Comments ───────────────────────────────────
function PendingComments() {
  const { data, loading, error, refetch } = useAsync(() => commentsApi.pending())
  const [processing, setProcessing] = useState({})

  const action = (id, type, fn) => async () => {
    setProcessing((p) => ({ ...p, [id]: type }))
    try { await fn(); refetch() }
    catch (err) { alert(err.message) }
    finally { setProcessing((p) => ({ ...p, [id]: null })) }
  }

  if (loading) return <p className="meta">Loading…</p>
  if (error)   return <p className="meta">{error}</p>
  if (!data?.length) return <p className="meta" style={{ fontStyle: 'italic' }}>No pending comments.</p>

  return (
    <div>
      {data.map((c) => (
        <div key={c.id} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{c.authorName}</span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={action(c.id, 'approving', () => commentsApi.approve(c.id))}
                disabled={!!processing[c.id]}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: processing[c.id] ? 0.5 : 1 }}
              >
                {processing[c.id] === 'approving' ? '…' : 'Approve'}
              </button>
              <button
                onClick={action(c.id, 'deleting', () => commentsApi.delete(c.id))}
                disabled={!!processing[c.id]}
                style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: processing[c.id] ? 0.5 : 1 }}
              >
                {processing[c.id] === 'deleting' ? '…' : 'Delete'}
              </button>
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', margin: '0 0 0.25rem' }}>{c.body}</p>
          <span className="meta">{formatDate(c.createdAt)}</span>
        </div>
      ))}
    </div>
  )
}

// ── Admin Dashboard ────────────────────────────────────
export default function AdminDashboard() {
  const { isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()

  const { content, loading, error, currentPage, totalPages, hasNext, hasPrev, goToPage } =
    usePaginated((p, s) => postsApi.adminAll(p, s))

  const [removed, setRemoved] = useState([])
  const displayContent = content.filter((p) => !removed.includes(p.id))
  const handleDelete   = (id) => setRemoved((r) => [...r, id])

  const sectionHeading = {
    fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '500',
    marginBottom: '1rem', color: 'var(--muted-foreground)', fontStyle: 'italic',
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <Shell>
        <div className="container">
          <p style={{ color: 'var(--muted-foreground)' }}>
            Access restricted. <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
          </p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', fontWeight: '500' }}>
            Admin
          </h1>
          <button
            onClick={() => navigate('/admin/new')}
            style={{
              background: 'none', border: '1px solid var(--border)',
              color: 'var(--foreground)', padding: '0.45rem 1rem',
              fontFamily: 'var(--font-body)', fontSize: '0.82rem',
              cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: '0.03em',
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary)' }}
            onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--foreground)' }}
          >
            New essay
          </button>
        </div>

        <hr style={{ margin: '1.5rem 0 2rem' }} />

        {/* Posts */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={sectionHeading}>All essays</h2>
          {loading && <LoadingSkeleton />}
          {error   && <ErrorMessage message={error} />}
          {!loading && !error && (
            <>
              {displayContent.length === 0 && (
                <p className="meta" style={{ fontStyle: 'italic' }}>No essays yet.</p>
              )}
              {displayContent.map((post) => (
                <AdminPostRow key={post.id} post={post} onDelete={handleDelete} />
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNext={hasNext}
                hasPrev={hasPrev}
                goToPage={goToPage}
              />
            </>
          )}
        </section>

        {/* Comments */}
        <section>
          <h2 style={sectionHeading}>Pending comments</h2>
          <PendingComments />
        </section>
      </div>
    </Shell>
  )
}