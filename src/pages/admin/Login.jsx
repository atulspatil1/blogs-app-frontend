import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Shell }   from '../../components/Layout'

export default function Login() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const session = await login(email, password)
      navigate(session.role === 'ADMIN' ? '/admin' : '/')
    } catch {
      // error shown via context
    }
  }

  const inputStyle = {
    display: 'block', width: '100%', marginBottom: '1.25rem',
    padding: '0.65rem 0', border: 'none', borderBottom: '1px solid var(--border)',
    background: 'transparent', color: 'var(--foreground)',
    fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: '300',
    outline: 'none', transition: 'border-color 0.2s ease',
  }
  const focus = (e) => (e.target.style.borderBottomColor = 'var(--primary)')
  const blur  = (e) => (e.target.style.borderBottomColor = 'var(--border)')

  return (
    <Shell>
      <div className="container">
        <div style={{ maxWidth: '22rem', margin: '2rem auto 0' }}>
          <h1
            style={{
              fontFamily:   'var(--font-heading)',
              fontSize:     '1.75rem',
              fontWeight:   '500',
              marginBottom: '0.5rem',
            }}
          >
            Sign in
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '2.5rem' }}>
            Admin access only.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              style={inputStyle}
              onFocus={focus}
              onBlur={blur}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              onFocus={focus}
              onBlur={blur}
            />

            {error && (
              <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.65rem',
                background: 'none', border: '1px solid var(--border)',
                color: 'var(--foreground)', fontFamily: 'var(--font-body)',
                fontSize: '0.9rem', cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.6 : 1, transition: 'all 0.2s ease',
                letterSpacing: '0.03em',
              }}
              onMouseEnter={(e) => { if (!loading) { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary)' }}}
              onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--foreground)' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </Shell>
  )
}