import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '../components/Layout';
import { PostCard, LoadingSkeleton, ErrorMessage, Pagination } from '../components/PostCard';
import { useAsync } from '../hooks/useApi';
import { posts, categories as catsApi } from '../api/client';
import { formatDate } from '../utils';

/* ═══════════════════════════════════════════════
   Immersive Editorial Hero
   ═══════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '75vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginTop: '-2rem',
        marginBottom: '3rem',
      }}
    >
      {/* ── Animated gradient background ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #5b8c5a 0%, #7da07d 20%, #a8c5a0 35%, #e8dcc8 50%, #e07a5f 65%, #d4845a 80%, #5b8c5a 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientDrift 20s ease infinite',
          zIndex: 0,
        }}
      />

      {/* ── Floating organic orbs ── */}
      {[
        { top: '12%', left: '10%', size: '18rem', opacity: 0.1, delay: '0s', dur: '15s' },
        { top: '55%', right: '8%', size: '22rem', opacity: 0.08, delay: '3s', dur: '18s' },
        { bottom: '10%', left: '25%', size: '14rem', opacity: 0.12, delay: '6s', dur: '12s' },
        { top: '20%', right: '30%', size: '10rem', opacity: 0.09, delay: '9s', dur: '20s' },
      ].map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
            opacity: orb.opacity,
            animation: `floatOrb ${orb.dur} ease-in-out infinite`,
            animationDelay: orb.delay,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── Subtle noise / texture overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* ── Content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          textAlign: 'center',
          padding: '2rem var(--px)',
          maxWidth: '52rem',
        }}
      >
        {/* Journal name */}
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontWeight: '700',
            fontStyle: 'italic',
            color: '#fff',
            lineHeight: '1.1',
            marginBottom: '1.25rem',
            textShadow: '0 2px 30px rgba(0,0,0,0.15)',
            animation: 'fadeInUp 0.8s ease forwards',
            opacity: 0,
          }}
        >
          The Quiet Journal
        </h1>

        {/* Poetic tagline */}
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
            fontWeight: '400',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: '1.6',
            maxWidth: '36rem',
            margin: '0 auto',
            textShadow: '0 1px 15px rgba(0,0,0,0.1)',
            animation: 'fadeInUp 0.8s ease 0.2s forwards',
            opacity: 0,
          }}
        >
          Where reflection finds its tempo — essays on life,
          <br />
          craft, and the art of slowing down.
        </p>


      </div>

      {/* ── Scroll indicator ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          textAlign: 'center',
          animation: 'fadeIn 1s ease 1s forwards',
          opacity: 0,
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: '0.7rem',
            fontWeight: '600',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '0.5rem',
          }}
        >
          Scroll to explore
        </span>
        <span
          className="material-symbols-rounded"
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '1.3rem',
            animation: 'scrollBounce 2s ease infinite',
          }}
        >
          expand_more
        </span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   Category Filter Pills
   ═══════════════════════════════════════════════ */
function CategoryFilter({ categories, active, onSelect }) {
  if (!categories?.length) return null;

  const pillStyle = (isActive) => ({
    padding: '0.4rem 1rem',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.82rem',
    fontWeight: '600',
    fontFamily: 'var(--font-body)',
    border: '1.5px solid',
    borderColor: isActive ? 'var(--accent)' : 'var(--border)',
    background: isActive ? 'var(--accent)' : 'transparent',
    color: isActive ? '#fff' : 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all var(--transition-base)',
    whiteSpace: 'nowrap',
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '2rem',
      }}
      className="animate-fade-in-up delay-1"
    >
      <button
        onClick={() => onSelect(null)}
        style={pillStyle(!active)}
        onMouseEnter={(e) => {
          if (active) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }
        }}
        onMouseLeave={(e) => {
          if (active) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }
        }}
      >
        All
      </button>

      {categories.map((cat) => {
        const isActive = active === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(isActive ? null : cat.slug)}
            style={pillStyle(isActive)}
            onMouseEnter={(e) => {
              if (!isActive) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }
            }}
            onMouseLeave={(e) => {
              if (!isActive) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }
            }}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Home Page
   ═══════════════════════════════════════════════ */
export default function Home() {
  const [activeCategory, setActiveCategory] = useState(null);
  const { data: categoryList } = useAsync(() => catsApi.list());

  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categorySlug = activeCategory;

  const loadPosts = useCallback(async (p) => {
    setLoading(true);
    setError(null);
    try {
      const result = categorySlug
        ? await posts.byCategory(categorySlug, p, 10)
        : await posts.list(p, 10);
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => { setPage(0); }, [categorySlug]);
  useEffect(() => { loadPosts(page); }, [page, loadPosts]);

  const content = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const hasNext = data ? !data.last : false;
  const hasPrev = data ? !data.first : false;

  const latestPost = content?.[0];

  const categoriesForFilter = (categoryList || []).map((c) => ({
    ...c,
    slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
  }));

  return (
    <Shell>
      {/* ── Immersive Hero ── */}
      {page === 0 && !activeCategory && (
        <HeroSection />
      )}

      <div className="container">
        {/* Section header + category filter */}
        <div
          style={{ textAlign: 'center', marginBottom: '1rem' }}
          className="animate-fade-in-up"
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              fontWeight: '700',
              fontStyle: 'italic',
              marginBottom: '0.4rem',
            }}
          >
            {activeCategory
              ? `${activeCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`
              : 'All Essays'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            {activeCategory ? 'Filtered by category' : 'Browse the full archive'}
          </p>
        </div>

        <CategoryFilter
          categories={categoriesForFilter}
          active={activeCategory}
          onSelect={(slug) => setActiveCategory(slug)}
        />

        {/* Loading */}
        {loading && <LoadingSkeleton count={4} />}

        {/* Error */}
        {error && <ErrorMessage message={error} />}

        {/* Post Grid */}
        {!loading && !error && content.length > 0 && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {content.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              hasNext={hasNext}
              hasPrev={hasPrev}
              goToPage={setPage}
            />
          </>
        )}

        {/* Empty state */}
        {!loading && !error && content.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', opacity: 0.5 }}>
              article
            </span>
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>
              {activeCategory ? 'No essays in this category yet.' : 'No essays yet. Check back soon.'}
            </p>
            {activeCategory && (
              <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => setActiveCategory(null)}>
                View all essays
              </button>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}