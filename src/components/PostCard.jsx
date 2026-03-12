import { Link } from 'react-router-dom';
import { formatDate, readingTime } from '../utils';

/* ── Gradient placeholders for posts without images ── */
const GRADIENTS = [
  'linear-gradient(135deg, #5b8c5a 0%, #7da07d 50%, #a8c6a8 100%)',
  'linear-gradient(135deg, #e07a5f 0%, #f4a261 50%, #f8c87a 100%)',
  'linear-gradient(135deg, #7da07d 0%, #5b8c5a 50%, #3d6b3d 100%)',
  'linear-gradient(135deg, #d4845a 0%, #e07a5f 50%, #c96842 100%)',
  'linear-gradient(135deg, #8fbc8f 0%, #5b8c5a 50%, #4a7a4a 100%)',
  'linear-gradient(135deg, #f4a261 0%, #e07a5f 50%, #d4845a 100%)',
];

function getGradient(id) {
  return GRADIENTS[(id || 0) % GRADIENTS.length];
}

/* ── Cover Image / Gradient ──────────────────── */
function PostCover({ post, height = '200px', radius = 'var(--radius-lg)' }) {
  const bg = post.coverImageUrl
    ? `url(${post.coverImageUrl})`
    : getGradient(post.id);

  return (
    <div
      role="img"
      aria-label={post.title ? `Cover image for ${post.title}` : 'Post cover'}
      style={{
        width: '100%',
        height,
        borderRadius: radius,
        background: bg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle overlay for text readability */}
      {!post.coverImageUrl && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)',
          }}
        />
      )}
    </div>
  );
}

/* ── Category Badge ──────────────────────────── */
function CategoryBadge({ categories, style: extraStyle = {} }) {
  if (!categories?.length) return null;
  const isWarm = categories.length > 0 && categories[0].length % 2 === 0;
  return (
    <span
      className={`category-label ${isWarm ? 'warm' : ''}`}
      style={extraStyle}
    >
      {categories[0]}
    </span>
  );
}

/* ── Post Meta (date + reading time) ─────────── */
export function PostMeta({ post, style: extraStyle = {} }) {
  return (
    <div className="meta" style={extraStyle}>
      {post.categories?.length > 0 && (
        <>
          <span style={{ color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.06em' }}>
            {post.categories.join(', ')}
          </span>
          <span className="meta-dot">·</span>
        </>
      )}
      {formatDate(post.publishedAt || post.createdAt)}
      <span className="meta-dot">·</span>
      {readingTime(post.content)} min read
    </div>
  );
}

/* ── Featured Card (Hero) ────────────────────── */
export function FeaturedCard({ post }) {
  if (!post) return null;
  const bg = post.coverImageUrl
    ? `url(${post.coverImageUrl})`
    : getGradient(post.id);

  return (
    <Link
      to={`/essays/${post.slug}`}
      className="card"
      style={{
        display: 'block',
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        minHeight: '380px',
        background: bg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textDecoration: 'none',
        color: '#fff',
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        }}
      >
        <CategoryBadge categories={post.categories} style={{ marginBottom: '0.75rem' }} />
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
            fontWeight: '700',
            lineHeight: '1.2',
            color: '#fff',
            marginBottom: '0.6rem',
          }}
        >
          {post.title}
        </h2>
        {post.summary && (
          <p
            style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 0 1rem',
            }}
          >
            {post.summary}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            className="btn btn-warm"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
          >
            Read the essay
            <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>arrow_forward</span>
          </span>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>
            {formatDate(post.publishedAt || post.createdAt)}
            <span style={{ margin: '0 0.4em', opacity: 0.5 }}>·</span>
            {readingTime(post.content)} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Post Card (Grid Item) ───────────────────── */
export function PostCard({ post, index = 0 }) {
  return (
    <Link
      to={`/essays/${post.slug}`}
      className="card animate-fade-in-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        animationDelay: `${0.1 + index * 0.08}s`,
      }}
    >
      {/* Cover image */}
      <PostCover post={post} height="200px" radius="0" />

      {/* Content */}
      <div style={{ padding: '1.25rem 1.5rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <CategoryBadge categories={post.categories} />
          <span className="meta" style={{ fontSize: '0.78rem' }}>
            {readingTime(post.content)} min read
          </span>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.15rem',
            fontWeight: '600',
            lineHeight: '1.3',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
          }}
        >
          {post.title}
        </h3>

        {post.summary && (
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
              margin: '0 0 auto',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.summary}
          </p>
        )}

        <div className="meta" style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
          {formatDate(post.publishedAt || post.createdAt)}
        </div>
      </div>
    </Link>
  );
}

/* ── Archive Entry (Simple list item) ────────── */
export function ArchiveEntry({ post }) {
  return (
    <Link
      to={`/essays/${post.slug}`}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-fast)',
        textDecoration: 'none',
        color: 'inherit',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--accent-glow)';
        e.currentTarget.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '500', fontSize: '1.05rem' }}>
        {post.title}
      </span>
      <span className="meta" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
        {formatDate(post.publishedAt || post.createdAt)}
      </span>
    </Link>
  );
}

/* ── Year Group ──────────────────────────────── */
export function YearGroup({ year, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontStyle: 'italic',
          fontWeight: '500',
          fontSize: '1.1rem',
          color: 'var(--accent)',
          marginBottom: '0.5rem',
          paddingLeft: '0.25rem',
        }}
      >
        {year}
      </h3>
      {children}
    </div>
  );
}

/* ── Archive List ────────────────────────────── */
export function ArchiveList({ posts }) {
  const groups = {};
  posts.forEach((p) => {
    const y = new Date(p.publishedAt || p.createdAt).getFullYear();
    (groups[y] = groups[y] || []).push(p);
  });
  const sorted = Object.keys(groups).sort((a, b) => b - a);

  return (
    <div>
      {sorted.map((year) => (
        <YearGroup key={year} year={year}>
          {groups[year].map((post) => (
            <ArchiveEntry key={post.id} post={post} />
          ))}
        </YearGroup>
      ))}
    </div>
  );
}

/* ── Loading Skeleton ────────────────────────── */
export function LoadingSkeleton({ count = 4 }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card"
          style={{
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              height: '200px',
              background: `linear-gradient(90deg, var(--bg-secondary) 25%, var(--border-light) 50%, var(--bg-secondary) 75%)`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s ease infinite',
            }}
          />
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div
              style={{
                height: '0.7rem',
                width: '30%',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-full)',
                marginBottom: '0.75rem',
              }}
            />
            <div
              style={{
                height: '1.1rem',
                width: '80%',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-full)',
                marginBottom: '0.5rem',
              }}
            />
            <div
              style={{
                height: '0.85rem',
                width: '60%',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-full)',
                marginBottom: '1rem',
              }}
            />
            <div
              style={{
                height: '0.7rem',
                width: '40%',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-full)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Error Message ───────────────────────────── */
export function ErrorMessage({ message, onRetry }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
      }}
    >
      <span
        className="material-symbols-rounded"
        style={{
          fontSize: '2.5rem',
          color: 'var(--error)',
          marginBottom: '1rem',
          display: 'block',
        }}
      >
        error_outline
      </span>
      <p style={{ color: 'var(--error)', fontSize: '0.95rem', marginBottom: '1rem' }}>
        {message || 'Something went wrong'}
      </p>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>
          <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>refresh</span>
          Try again
        </button>
      )}
    </div>
  );
}

/* ── Pagination ──────────────────────────────── */
export function Pagination({ currentPage, totalPages, hasNext, hasPrev, goToPage }) {
  if (totalPages <= 1) return null;

  const btnStyle = (disabled) => ({
    padding: '0.5rem 1.25rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    fontFamily: 'var(--font-body)',
    borderRadius: 'var(--radius-full)',
    border: '1.5px solid var(--border)',
    background: 'var(--bg-card)',
    color: disabled ? 'var(--text-secondary)' : 'var(--text-primary)',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'all var(--transition-fast)',
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '3rem',
      }}
    >
      <button
        onClick={() => hasPrev && goToPage(currentPage - 1)}
        disabled={!hasPrev}
        style={btnStyle(!hasPrev)}
        onMouseEnter={(e) => { if (hasPrev) { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; } }}
        onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = hasPrev ? 'var(--text-primary)' : 'var(--text-secondary)'; }}
      >
        ← Newer
      </button>

      <span className="meta" style={{ fontSize: '0.85rem' }}>
        {currentPage + 1} of {totalPages}
      </span>

      <button
        onClick={() => hasNext && goToPage(currentPage + 1)}
        disabled={!hasNext}
        style={btnStyle(!hasNext)}
        onMouseEnter={(e) => { if (hasNext) { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; } }}
        onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = hasNext ? 'var(--text-primary)' : 'var(--text-secondary)'; }}
      >
        Older →
      </button>
    </div>
  );
}