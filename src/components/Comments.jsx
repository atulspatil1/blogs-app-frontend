import { useState } from 'react'
import { comments as commentsApi } from '../api/client'
import { formatDate } from '../utils'

// ── Comment Form ───────────────────────────────────────
function CommentForm({ postId }) {
  const [form, setForm]       = useState({ authorName: '', email: '', body: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState(null)

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
      <p style={{ color: 'var(--muted-foreground)', fontStyle: 'italic', fontSize: '0.9rem' }}>
        Your comment is awaiting moderation. Thank you.
      </p>
    )
  }

  const inputStyle = {
    display: 'block', width: '100%', marginBottom: '1rem',
    padding: '0.6rem 0', border: 'none', borderBottom: '1px solid var(--border)',
    background: 'transparent', color: 'var(--foreground)',
    fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: '300',
    outline: 'none', transition: 'border-color 0.2s ease',
  }
  const focus = (e) => (e.target.style.borderBottomColor = 'var(--primary)')
  const blur  = (e) => (e.target.style.borderBottomColor = 'var(--border)')

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
        <input type="text"  placeholder="Name"                value={form.authorName} onChange={set('authorName')} required style={inputStyle} onFocus={focus} onBlur={blur} />
        <input type="email" placeholder="Email (not published)" value={form.email}    onChange={set('email')}      required style={inputStyle} onFocus={focus} onBlur={blur} />
      </div>
      <textarea
        placeholder="Leave a response…"
        value={form.body}
        onChange={set('body')}
        required
        rows={4}
        style={{ ...inputStyle, resize: 'vertical', minHeight: '6rem' }}
        onFocus={focus}
        onBlur={blur}
      />

      {error && (
        <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          background: 'none', border: '1px solid var(--border)',
          color: 'var(--foreground)', padding: '0.5rem 1.25rem',
          fontFamily: 'var(--font-body)', fontSize: '0.85rem',
          cursor: loading ? 'default' : 'pointer',
          opacity: loading ? 0.6 : 1, transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => { if (!loading) { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary)' }}}
        onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--foreground)' }}
      >
        {loading ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  )
}

// ── Comment Section ────────────────────────────────────
export function CommentSection({ postId, initialComments = [] }) {
  const [open, setOpen] = useState(false)
  const approved = (initialComments || []).filter((c) => c.approved)

  return (
    <section style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: 'none', border: 'none', padding: '0',
          fontFamily: 'var(--font-body)', fontSize: '0.85rem',
          color: 'var(--muted-foreground)', cursor: 'pointer',
          letterSpacing: '0.03em', transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => (e.target.style.color = 'var(--primary)')}
        onMouseLeave={(e) => (e.target.style.color = 'var(--muted-foreground)')}
      >
        {open ? 'Hide comments' : `Comments${approved.length ? ` (${approved.length})` : ''}`}
      </button>

      {open && (
        <div style={{ marginTop: '2rem' }}>
          {approved.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              {approved.map((c) => (
                <div key={c.id} style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{c.authorName}</span>
                    <span className="meta">{formatDate(c.createdAt)}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.65' }}>{c.body}</p>
                </div>
              ))}
            </div>
          )}
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
              Leave a response
            </p>
            <CommentForm postId={postId} />
          </div>
        </div>
      )}
    </section>
  )
}