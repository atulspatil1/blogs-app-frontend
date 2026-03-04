import { useState, useCallback } from 'react'
import { Shell } from '../components/Layout'
import { ArchiveList, ErrorMessage, Pagination } from '../components/PostCard'
import { posts } from '../api/client'

export default function Search() {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [page, setPage]       = useState(0)

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
  const goToPage     = (p) => doSearch(query, p)

  const focusBorder = (e) => (e.target.style.borderBottomColor = 'var(--primary)')
  const blurBorder  = (e) => (e.target.style.borderBottomColor = 'var(--border)')

  return (
    <Shell>
      <div className="container">
        <h1
          style={{
            fontFamily:   'var(--font-heading)',
            fontSize:     'clamp(1.5rem, 3.5vw, 2rem)',
            fontWeight:   '500',
            marginBottom: '2rem',
          }}
        >
          Search
        </h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="search"
              placeholder="Search essays…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              style={{
                flex: 1, padding: '0.7rem 0', border: 'none',
                borderBottom: '1px solid var(--border)', background: 'transparent',
                color: 'var(--foreground)', fontFamily: 'var(--font-body)',
                fontSize: '1.1rem', fontWeight: '300', outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'none', border: 'none', padding: '0 0.25rem',
                color: 'var(--primary)', fontFamily: 'var(--font-body)',
                fontSize: '0.85rem', cursor: 'pointer',
                opacity: loading ? 0.6 : 1, letterSpacing: '0.04em',
              }}
            >
              {loading ? '…' : 'Search →'}
            </button>
          </div>
        </form>

        {error && <ErrorMessage message={error} />}

        {results && !loading && (
          <>
            {results.totalElements > 0 ? (
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {results.totalElements} result{results.totalElements !== 1 ? 's' : ''} for "{query}"
              </p>
            ) : (
              <p style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>
                No essays matched "{query}".
              </p>
            )}
            <ArchiveList posts={results.content} />
            <Pagination
              currentPage={page}
              totalPages={results.totalPages}
              hasNext={!results.last}
              hasPrev={!results.first}
              goToPage={goToPage}
            />
          </>
        )}
      </div>
    </Shell>
  )
}