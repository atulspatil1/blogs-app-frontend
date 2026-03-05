import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth as authApi, setToken, setSession, clearSession, getSession, getToken } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSessionState] = useState(() => getSession());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sync with auth:expired event (from API client)
    useEffect(() => {
        const handle = () => {
            setSessionState(null);
            setError('Your session has expired. Please log in again.');
        }
        window.addEventListener('auth:expired', handle);
        return () => window.removeEventListener('auth:expired', handle);
    }, []);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.login(email, password);
            setToken(data.token);
            setSession(data);
            setSessionState(data);

            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        clearSession();
        setSessionState(null);
    }, []);

    const isAdmin = session?.role === 'ADMIN';
    const isAuthenticated = !!session && !!getToken();

    return (
        <AuthContext.Provider value={{ session, login, logout, loading, error, isAdmin, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);