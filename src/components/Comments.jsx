import { useState } from 'react'
import { comments as commentsApi } from '../api/client'
import { formatDate } from '../utils'

// ── Comment Form ───────────────────────────────────────
function CommentForm({ postId }) {
  const [form, setForm] = useState({ authorName: '', email: '', body: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.body.trim()) return
    setLoading(true)
    setError(null)
    try {
      await commentsApi.submit({ postId, ...form })
      setSuccess(true)
      setForm({ authorName: '', email: '', body: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{
        padding: '1.25rem',
        background: 'var(--accent-glow)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <span className="material-symbols-rounded" style={{ color: 'var(--accent)', fontSize: '1.3rem' }}>check_circle</span>
        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem', margin: 0 }}>
          Your comment is awaiting moderation. Thank you.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Name"
          value={form.authorName}
          onChange={set('authorName')}
          required
        />
        <input
          type="email"
          placeholder="Email (not published)"
          value={form.email}
          onChange={set('email')}
          required
        />
      </div>
      <textarea
        placeholder="Leave a response…"
        value={form.body}
        onChange={set('body')}
        required
        rows={4}
        style={{ marginTop: '1rem', resize: 'vertical', minHeight: '6rem' }}
      />

      {error && (
        <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: '0' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
        style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Submitting…' : 'Submit comment'}
      </button>
    </form>
  )
}

// ── Comment Section ────────────────────────────────────
export function CommentSection({ postId, initialComments = [] }) {
  const [open, setOpen] = useState(false)
  const approved = (initialComments || []).filter((c) => c.approved)

  return (
    <section style={{
      marginTop: '3rem',
      paddingTop: '2rem',
      borderTop: '1px solid var(--border-light)',
    }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn btn-ghost"
        style={{ paddingLeft: '0', gap: '0.4rem' }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>
          {open ? 'expand_less' : 'chat_bubble_outline'}
        </span>
        {open ? 'Hide comments' : `Comments${approved.length ? ` (${approved.length})` : ''}`}
      </button>

      {open && (
        <div style={{ marginTop: '1.5rem', animation: 'fadeInUp 0.3s ease' }}>
          {approved.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              {approved.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: '1.25rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '0.75rem',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {c.authorName}
                    </span>
                    <span className="meta" style={{ fontSize: '0.78rem' }}>{formatDate(c.createdAt)}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.65', color: 'var(--text-primary)' }}>
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              padding: '1.5rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
            }}
          >
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
            }}>
              Leave a response
            </h4>
            <CommentForm postId={postId} />
          </div>
        </div>
      )}
    </section>
  )
}