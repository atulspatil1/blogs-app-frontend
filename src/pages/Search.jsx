import { useState, useCallback } from 'react'
import { Shell } from '../components/Layout'
import { PostCard, ErrorMessage, Pagination } from '../components/PostCard'
import { posts } from '../api/client'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)

  const doSearch = useCallback(async (q, p = 0) => {
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await posts.search(q, p)
      setResults(data)
      setPage(p)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = (e) => { e.preventDefault(); doSearch(query, 0) }
  const goToPage = (p) => doSearch(query, p)

  return (
    <Shell>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }} className="animate-fade-in-up">
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: '700',
              fontStyle: 'italic',
              marginBottom: '0.5rem',
            }}
          >
            Search
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            Find essays by title, topic, or keyword.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} style={{ maxWidth: '36rem', margin: '0 auto 3rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.25rem 0.25rem 0.25rem 1.25rem',
              transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
            }}
          >
            <span className="material-symbols-rounded" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
              search
            </span>
            <input
              type="search"
              placeholder="Search essays…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                padding: '0.6rem 0',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: '400',
                outline: 'none',
                borderRadius: 0,
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                padding: '0.5rem 1.25rem',
                fontSize: '0.85rem',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '...' : 'Search'}
            </button>
          </div>
        </form>

        {error && <ErrorMessage message={error} />}

        {results && !loading && (
          <>
            {results.totalElements > 0 ? (
              <>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  marginBottom: '1.5rem',
                  fontWeight: '500',
                }}>
                  <span style={{ color: 'var(--accent)', fontWeight: '700' }}>{results.totalElements}</span>
                  {' '}result{results.totalElements !== 1 ? 's' : ''} for "{query}"
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  {results.content.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                  ))}
                </div>
                <Pagination
                  currentPage={page}
                  totalPages={results.totalPages}
                  hasNext={!results.last}
                  hasPrev={!results.first}
                  goToPage={goToPage}
                />
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <span className="material-symbols-rounded" style={{ fontSize: '3rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '1rem', opacity: 0.5 }}>
                  search_off
                </span>
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '1.05rem' }}>
                  No essays matched "{query}".
                </p>
              </div>
            )}
          </>
        )}

        {/* Initial state */}
        {!results && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: '3rem', display: 'block', marginBottom: '0.75rem', opacity: 0.3 }}>
              manage_search
            </span>
            <p style={{ fontSize: '0.95rem', fontStyle: 'italic', margin: 0 }}>
              Start typing to discover essays.
            </p>
          </div>
        )}
      </div>
    </Shell>
  )
}