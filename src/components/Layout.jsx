import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

// Theme toggle
function ThemeToggle() {
    const { theme, toggle } = useTheme();

    return (
        <button
            onClick={toggle}
            aria-label='Toggle theme'
            style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted-foreground)',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-body)',
                fontWeight: '400',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                padding: '0',
                transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--primary)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--muted-foreground)')}
        >
            {theme === 'light' ? 'Dark' : 'Light'}
        </button>
    );
}

// Header
export function Header() {
    const { isAdmin, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const navStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    };

    const linkStyle = {
        fontSize: '0.8rem',
        fontWeight: '400',
        letterSpacing: '0.04em',
        color: 'var(--muted-foreground)',
        transition: 'color 0.2s ease',
    }

    const activeLinkStyle = {
        color: 'var(--foreground)',
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header
            style={{
                borderBottom: '1px solid var(--border)',
                padding: '1.25rem 0',
            }}
        >
            <div
                className='container'
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                {/* Site Name */}
                <Link
                    to='/'
                    style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.05rem',
                        fontWeight: '500',
                        color: 'var(--foreground)',
                        letterSpacing: '0.01em',
                    }}
                >
                    Blogs Application
                </Link>

                {/* Navigation */}
                <nav style={navStyle}>
                    <NavLink
                        to='/posts'
                        style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeLinkStyle : {}) })}
                    >
                        About
                    </NavLink>

                    {isAdmin && (
                        <NavLink
                            to='/admin'
                            style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeLinkStyle : {}) })}
                        >
                            Admin
                        </NavLink>
                    )}

                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            style={{ ...linkStyle, background: 'none', border: 'none', padding: 0 }}
                        >
                            Sign out
                        </button>
                    ) : (
                        <NavLink
                            to='/admin'
                            style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeLinkStyle : {}) })}
                        >
                            Sign in
                        </NavLink>
                    )}

                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}

// Footer
export function Footer() {
    return (
        <footer
            style={{
                borderTop: '1px solid var(--border)',
                marginTop: '5rem',
                padding: '2.5rem 0 3rem',
            }}
        >
            <div
                className='container'
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '2rem',
                    flexWrap: 'wrap',
                }}
            >
                <div>
                    <p
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '0.95rem',
                            marginBottom: '0.4rem',
                        }}
                    >
                        Blogs Application
                    </p>
                    <p
                        style={{
                            fontSize: '0.8rem',
                            color: 'var(--muted-foreground)',
                            margin: 0,
                        }}
                    >
                        An archive of blogs
                    </p>
                </div>

                <nav
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        alignItems: 'flex-end',
                    }}
                >
                    {[
                        { to: '/posts', label: 'Posts' },
                        { to: '/search', label: 'Search' },
                        { to: '/about', label: 'About' },
                    ].map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            style={{
                                fontSize: '0.8rem',
                                color: 'var(--muted-foreground)',
                                transition: 'color 0.2s ease',
                            }}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </footer>
    );
}

// Page shell
export function Shell({ children }) {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Header />
            <main
                style={{
                    flex: 1,
                    padding: '3rem 0',
                }}
            >
                {children}
            </main>
            <Footer />
        </div>
    );
}