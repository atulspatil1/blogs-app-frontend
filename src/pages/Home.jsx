import { Shell } from '../components/Layout'
import { ArchiveList, LoadingSkeleton, ErrorMessage, Pagination } from '../components/PostCard'
import { usePaginated } from '../hooks/useApi'
import { posts } from '../api/client'

export default function Home() {
  const {
    content, loading, error,
    currentPage, totalPages, hasNext, hasPrev, goToPage,
  } = usePaginated((p, s) => posts.list(p, s))

  return (
    <Shell>
      <div className="container">
        <div style={{ marginBottom: '0.5rem' }}>
          <h1
            style={{
              fontFamily:   'var(--font-heading)',
              fontSize:     'clamp(1.6rem, 4vw, 2.25rem)',
              fontWeight:   '500',
              lineHeight:   '1.2',
              marginBottom: '0.6rem',
            }}
          >
            Essays
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem', margin: 0 }}>
            A slow archive of engineering thought.
          </p>
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