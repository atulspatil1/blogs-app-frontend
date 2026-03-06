import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Shell } from '../../components/Layout'
import { posts as postsApi, categories as catsApi, tags as tagsApi } from '../../api/client'
import { useAsync } from '../../hooks/useApi'
import { useAuth } from '../../context/AuthContext'
import { toSlug } from '../../utils'

const EMPTY = {
  title: '', slug: '', summary: '', content: '',
  coverImageUrl: '', status: 'DRAFT', categoryIds: [], tagIds: [],
}

export default function PostEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const isEdit = !!id

  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [slugDirty, setSlugDirty] = useState(false)

  const { data: allCategories } = useAsync(() => catsApi.list())
  const { data: allTags } = useAsync(() => tagsApi.list())

  // Load post for editing
  useEffect(() => {
    if (!isEdit) return
    postsApi.adminAll(0, 100)
      .then((page) => {
        const p = page.content.find((x) => String(x.id) === String(id))
        if (p) {
          setForm({
            title: p.title || '',
            slug: p.slug || '',
            summary: p.summary || '',
            content: p.content || '',
            coverImageUrl: p.coverImageUrl || '',
            status: p.status || 'DRAFT',
            categoryIds: [],
            tagIds: [],
          })
          setSlugDirty(true)
        }
      })
      .catch(() => { })
  }, [id, isEdit])

  const set = (k) => (e) =>
    setForm((f) => {
      const next = { ...f, [k]: e.target.value }
      if (k === 'title' && !slugDirty) next.slug = toSlug(e.target.value)
      return next
    })

  const setSlugField = (e) => {
    setSlugDirty(true)
    setForm((f) => ({ ...f, slug: e.target.value }))
  }

  const toggleId = (key, val) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val],
    }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      isEdit ? await postsApi.update(id, form) : await postsApi.create(form)
      navigate('/admin')
    } catch (err) {
      setError(err.errors ? Object.values(err.errors).join(', ') : err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isAdmin) {
    return <Shell><div className="container"><p className="meta">Access restricted.</p></div></Shell>
  }

  const sectionLabel = {
    display: 'block', fontSize: '0.75rem', fontWeight: '700',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'var(--text-secondary)', marginBottom: '0.75rem',
  }

  return (
    <Shell>
      <div className="container" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <h1
          className="animate-fade-in-up"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.4rem, 3vw, 1.85rem)',
            fontWeight: '700',
            fontStyle: 'italic',
            marginBottom: '0.5rem',
          }}
        >
          {isEdit ? 'Edit essay' : 'New essay'}
        </h1>

        <hr style={{ margin: '1.5rem 0 2rem' }} />

        <form
          onSubmit={handleSubmit}
          className="animate-fade-in-up delay-1"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(1.25rem, 3vw, 2rem)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Title */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ ...sectionLabel }}>Title</label>
            <input
              type="text"
              placeholder="Your essay title"
              value={form.title}
              onChange={set('title')}
              required
              style={{ fontSize: '1.1rem', fontWeight: '600' }}
            />
          </div>

          {/* Slug */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ ...sectionLabel }}>Slug</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: '500', whiteSpace: 'nowrap' }}>
                /essays/
              </span>
              <input type="text" placeholder="slug" value={form.slug} onChange={setSlugField} required />
            </div>
          </div>

          {/* Summary */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ ...sectionLabel }}>Summary</label>
            <textarea
              placeholder="2–3 sentence intro"
              value={form.summary}
              onChange={set('summary')}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Content */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ ...sectionLabel }}>Content</label>
            <textarea
              placeholder="Essay content (Markdown supported)"
              value={form.content}
              onChange={set('content')}
              rows={18}
              style={{
                resize: 'vertical',
                minHeight: '20rem',
                fontFamily: "'Fira Code', monospace",
                fontSize: '0.88rem',
                lineHeight: '1.6',
              }}
            />
          </div>

          {/* Cover image */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ ...sectionLabel }}>Cover image</label>
            <input
              type="text"
              placeholder="Cover image URL (optional)"
              value={form.coverImageUrl}
              onChange={set('coverImageUrl')}
            />
          </div>

          {/* Status */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={sectionLabel}>Status</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['DRAFT', 'PUBLISHED'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    fontFamily: 'var(--font-body)',
                    border: '1.5px solid',
                    borderColor: form.status === s ? 'var(--accent)' : 'var(--border)',
                    background: form.status === s ? 'var(--accent-glow)' : 'transparent',
                    color: form.status === s ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          {allCategories?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={sectionLabel}>Categories</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {allCategories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleId('categoryIds', c.id)}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      fontFamily: 'var(--font-body)',
                      border: '1.5px solid',
                      borderColor: form.categoryIds.includes(c.id) ? 'var(--accent)' : 'var(--border)',
                      background: form.categoryIds.includes(c.id) ? 'var(--accent-glow)' : 'transparent',
                      color: form.categoryIds.includes(c.id) ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {allTags?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={sectionLabel}>Tags</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {allTags.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleId('tagIds', t.id)}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      fontFamily: 'var(--font-body)',
                      border: '1.5px solid',
                      borderColor: form.tagIds.includes(t.id) ? 'var(--accent-warm)' : 'var(--border)',
                      background: form.tagIds.includes(t.id) ? 'var(--accent-warm-glow)' : 'transparent',
                      color: form.tagIds.includes(t.id) ? 'var(--accent-warm)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(217, 79, 79, 0.08)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span className="material-symbols-rounded" style={{ color: 'var(--error)', fontSize: '1.1rem' }}>error</span>
              <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: 0 }}>{error}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish essay'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="btn btn-ghost"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Shell>
  )
}