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
  const { id }      = useParams()
  const navigate    = useNavigate()
  const { isAdmin } = useAuth()
  const isEdit      = !!id

  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState(null)
  const [slugDirty, setSlugDirty] = useState(false)

  const { data: allCategories } = useAsync(() => catsApi.list())
  const { data: allTags }       = useAsync(() => tagsApi.list())

  // Load post for editing
  useEffect(() => {
    if (!isEdit) return
    postsApi.adminAll(0, 100)
      .then((page) => {
        const p = page.content.find((x) => String(x.id) === String(id))
        if (p) {
          setForm({
            title:         p.title         || '',
            slug:          p.slug          || '',
            summary:       p.summary       || '',
            content:       p.content       || '',
            coverImageUrl: p.coverImageUrl || '',
            status:        p.status        || 'DRAFT',
            categoryIds:   [],
            tagIds:        [],
          })
          setSlugDirty(true)
        }
      })
      .catch(() => {})
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

  const inputStyle = {
    display: 'block', width: '100%', marginBottom: '1.5rem',
    padding: '0.6rem 0', border: 'none', borderBottom: '1px solid var(--border)',
    background: 'transparent', color: 'var(--foreground)',
    fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: '300',
    outline: 'none', transition: 'border-color 0.2s ease',
  }
  const focus = (e) => (e.target.style.borderBottomColor = 'var(--primary)')
  const blur  = (e) => (e.target.style.borderBottomColor = 'var(--border)')

  const sectionLabel = {
    display: 'block', fontSize: '0.75rem', fontWeight: '600',
    letterSpacing: '0.07em', textTransform: 'uppercase',
    color: 'var(--muted-foreground)', marginBottom: '0.75rem',
  }

  return (
    <Shell>
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', fontWeight: '500', marginBottom: '0.5rem' }}>
          {isEdit ? 'Edit essay' : 'New essay'}
        </h1>

        <hr style={{ margin: '1.5rem 0 2.5rem' }} />

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <input type="text" placeholder="Title" value={form.title} onChange={set('title')} required style={{ ...inputStyle, fontSize: '1.15rem' }} onFocus={focus} onBlur={blur} />

          {/* Slug */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, top: '0.6rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
              /essays/
            </span>
            <input type="text" placeholder="slug" value={form.slug} onChange={setSlugField} required style={{ ...inputStyle, paddingLeft: '4rem' }} onFocus={focus} onBlur={blur} />
          </div>

          {/* Summary */}
          <textarea placeholder="Summary (2–3 sentence intro)" value={form.summary} onChange={set('summary')} rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={focus} onBlur={blur} />

          {/* Content */}
          <textarea placeholder="Essay content (Markdown supported)" value={form.content} onChange={set('content')} rows={18} style={{ ...inputStyle, resize: 'vertical', minHeight: '24rem', fontFamily: 'monospace', fontSize: '0.875rem' }} onFocus={focus} onBlur={blur} />

          {/* Cover image */}
          <input type="text" placeholder="Cover image URL (optional)" value={form.coverImageUrl} onChange={set('coverImageUrl')} style={inputStyle} onFocus={focus} onBlur={blur} />

          {/* Status */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={sectionLabel}>Status</span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['DRAFT', 'PUBLISHED'].map((s) => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="status" value={s} checked={form.status === s} onChange={set('status')} style={{ accentColor: 'var(--primary)' }} />
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          {allCategories?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={sectionLabel}>Categories</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {allCategories.map((c) => (
                  <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input type="checkbox" checked={form.categoryIds.includes(c.id)} onChange={() => toggleId('categoryIds', c.id)} style={{ accentColor: 'var(--primary)' }} />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {allTags?.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <span style={sectionLabel}>Tags</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {allTags.map((t) => (
                  <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input type="checkbox" checked={form.tagIds.includes(t.id)} onChange={() => toggleId('tagIds', t.id)} style={{ accentColor: 'var(--primary)' }} />
                    {t.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p style={{ color: 'var(--primary)', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: 'none', border: '1px solid var(--border)',
                color: 'var(--foreground)', padding: '0.55rem 1.5rem',
                fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                cursor: saving ? 'default' : 'pointer',
                opacity: saving ? 0.6 : 1, transition: 'all 0.2s ease', letterSpacing: '0.03em',
              }}
              onMouseEnter={(e) => { if (!saving) { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary)' }}}
              onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--foreground)' }}
            >
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', cursor: 'pointer', padding: '0' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Shell>
  )
}