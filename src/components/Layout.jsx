import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

/* ── Theme Toggle (Sun / Moon icon) ──────────── */
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        padding: '0.4rem',
        borderRadius: 'var(--radius-full)',
        transition: 'all var(--transition-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--accent-warm)';
        e.currentTarget.style.background = 'var(--accent-warm-glow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.background = 'none';
      }}
    >
      <span
        className="material-symbols-rounded"
        style={{
          fontSize: '1.3rem',
          transition: 'transform 0.4s ease',
          transform: theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  );
}

/* ── Mobile Menu Button ──────────────────────── */
function MenuButton({ open, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      style={{
        display: 'none',
        background: 'none',
        border: 'none',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        padding: '0.4rem',
        borderRadius: 'var(--radius-sm)',
        transition: 'color var(--transition-fast)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="mobile-menu-btn"
    >
      <span className="material-symbols-rounded" style={{ fontSize: '1.5rem' }}>
        {open ? 'close' : 'menu'}
      </span>
    </button>
  );
}

/* ── Nav Link with animated underline ────────── */
function AnimatedNavLink({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      style={({ isActive }) => ({
        fontSize: '0.9rem',
        fontWeight: isActive ? '700' : '500',
        color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
        transition: 'color var(--transition-fast)',
        position: 'relative',
        paddingBottom: '2px',
      })}
    >
      {({ isActive }) => (
        <>
          {children}
          <span
            style={{
              position: 'absolute',
              bottom: '-2px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: isActive ? '100%' : '0%',
              height: '2px',
              background: 'var(--accent)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease',
            }}
          />
        </>
      )}
    </NavLink>
  );
}

/* ── Header ──────────────────────────────────── */
export function Header() {
  const { isAdmin, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
        }
      `}</style>

      <header
        className="glass"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0.85rem 0',
          borderBottom: 'none',
          borderRadius: 0,
          transition: 'box-shadow var(--transition-base)',
          boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.3rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              fontStyle: 'italic',
              letterSpacing: '-0.01em',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          >
            The Quiet Journal
          </Link>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Desktop Nav */}
            <nav
              className="desktop-nav"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.75rem',
              }}
            >
              <AnimatedNavLink to="/">Home</AnimatedNavLink>
              <AnimatedNavLink to="/essays">Essays</AnimatedNavLink>
              <AnimatedNavLink to="/search">Search</AnimatedNavLink>
              <AnimatedNavLink to="/about">About</AnimatedNavLink>

              {isAdmin && <AnimatedNavLink to="/admin">Admin</AnimatedNavLink>}

              {isAuthenticated && !isLoginPage ? (
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.9rem', fontWeight: '500' }}
                >
                  Sign out
                </button>
              ) : !isAuthenticated ? (
                <AnimatedNavLink to="/login">Sign in</AnimatedNavLink>
              ) : null}

              <ThemeToggle />
            </nav>

            {/* Mobile: theme toggle + hamburger */}
            <div className="mobile-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="mobile-menu-btn" style={{ display: 'none' }}>
                <ThemeToggle />
              </div>
              <MenuButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 199,
              animation: 'fadeIn 0.2s ease',
            }}
          />
          <nav
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '280px',
              maxWidth: '85vw',
              background: 'var(--bg-primary)',
              borderLeft: '1px solid var(--border)',
              zIndex: 200,
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              animation: 'slideInRight 0.3s ease',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  fontStyle: 'italic',
                }}
              >
                Menu
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '1.3rem' }}>close</span>
              </button>
            </div>

            {[
              { to: '/', label: 'Home' },
              { to: '/essays', label: 'Essays' },
              { to: '/search', label: 'Search' },
              { to: '/about', label: 'About' },
              ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                  background: isActive ? 'var(--accent-glow)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                })}
              >
                {label}
              </NavLink>
            ))}

            <hr style={{ margin: '0.75rem 0' }} />

            {isAuthenticated && !isLoginPage ? (
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Sign out
              </button>
            ) : !isAuthenticated ? (
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                }}
              >
                Sign in
              </NavLink>
            ) : null}
          </nav>
        </>
      )}
    </>
  );
}

/* ── Footer ──────────────────────────────────── */
export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        marginTop: '4rem',
        padding: '3rem 0 2rem',
        borderTop: '1px solid var(--border-light)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        {/* Brand */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              fontWeight: '600',
              fontStyle: 'italic',
              marginBottom: '0.5rem',
            }}
          >
            The Quiet Journal
          </p>
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              maxWidth: '320px',
              margin: 0,
            }}
          >
            A warm archive of thoughtful essays — where reflection meets craft.
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-secondary)',
              marginBottom: '0.25rem',
            }}
          >
            Navigate
          </span>
          {[
            { to: '/essays', label: 'Essays' },
            { to: '/search', label: 'Search' },
            { to: '/about', label: 'About' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                transition: 'color var(--transition-fast)',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Connect */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-secondary)',
              marginBottom: '0.25rem',
            }}
          >
            Connect
          </span>
          {[
            { to: '/login', label: 'Admin' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                transition: 'color var(--transition-fast)',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom bar */}
      <div
        className="container"
        style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            margin: 0,
          }}
        >
          © {new Date().getFullYear()} The Quiet Journal. All rights reserved.
        </p>
      </div>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 640px) {
          footer .container:first-child {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  );
}

/* ── Page Shell ──────────────────────────────── */
export function Shell({ children }) {
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <main
        key={location.pathname}
        style={{
          flex: 1,
          padding: '2.5rem 0',
          animation: 'fadeInUp 0.4s ease',
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}