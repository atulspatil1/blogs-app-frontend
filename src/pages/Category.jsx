import { useParams } from 'react-router-dom'
import { Shell } from '../components/Layout'
import { ArchiveList, LoadingSkeleton, ErrorMessage, Pagination } from '../components/PostCard'
import { usePaginated } from '../hooks/useApi'
import { posts } from '../api/client'

export default function Category() {
  const { slug } = useParams()

  const {
    content, loading, error,
    currentPage, totalPages, hasNext, hasPrev, goToPage,
  } = usePaginated((p, s) => posts.byCategory(slug, p, s), [slug])

  const displayName = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <Shell>
      <div className="container">
        <div style={{ marginBottom: '0.5rem' }}>
          <span className="category-label">{displayName}</span>
          <h1
            style={{
              fontFamily:   'var(--font-heading)',
              fontSize:     'clamp(1.5rem, 3.5vw, 2rem)',
              fontWeight:   '500',
              marginTop:    '0.5rem',
              marginBottom: '0.4rem',
            }}
          >
            Essays on {displayName}
          </h1>
        </div>

        <hr style={{ margin: '2rem 0' }} />

        {loading && <LoadingSkeleton />}
        {error   && <ErrorMessage message={error} />}
        {!loading && !error && (
          <>
            <ArchiveList posts={content} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNext={hasNext}
              hasPrev={hasPrev}
              goToPage={goToPage}
            />
          </>
        )}
      </div>
    </Shell>
  )
}