import { useParams } from 'react-router-dom'
import { Shell } from '../components/Layout'
import { PostCard, LoadingSkeleton, ErrorMessage, Pagination } from '../components/PostCard'
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
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }} className="animate-fade-in-up">
          <span className="category-label" style={{ marginBottom: '0.75rem' }}>{displayName}</span>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              fontWeight: '700',
              fontStyle: 'italic',
              marginTop: '0.75rem',
            }}
          >
            Essays on {displayName}
          </h1>
        </div>

        <hr />

        {loading && <LoadingSkeleton />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {content.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
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