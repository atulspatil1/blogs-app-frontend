const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_V1 = `${BASE_URL}/api/v1`;

// Token helpers
export const getToken = () => localStorage.getItem('jqj_token');
export const setToken = (token) => localStorage.setItem('jqj_token', token);
export const clearToken = () => localStorage.removeItem('jqj_token');

export const getSession = () => {
    try {
        return JSON.parse(localStorage.getItem('jqj_session') || null);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const setSession = (session) => {
    localStorage.setItem('jqj_session', JSON.stringify(session));
}

export const clearSession = () => {
    clearToken();
    localStorage.removeItem('jqj_session');
}

// Core fetch wrapper
async function apiFetch(path, options = {}) {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_V1}${path}`, {
        ...options,
        headers,
    });

    // Handle 204 No Content (DELETE responses)
    if (response.status === 204) {
        return null;
    }

    // Handle auth errors
    if (response.status === 401) {
        clearSession();
        window.dispatchEvent(new CustomEvent('auth:expired'));
        throw new ApiError(401, 'Session expired. Please log in again.');
    }

    const body = await response.json();

    if (!body.success) {
        throw new ApiError(body.status, body.message, body.errors);
    }

    return body.data;
}

export class ApiError extends Error {
    constructor(status, message, errors = null) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}

// Auth
export const auth = {
    login: (email, password) => apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    })
}

// Posts
export const posts = {
    list: (page = 0, size = 10) =>
        apiFetch(`/posts?page=${page}&size=${size}`),

    bySlug: (slug) =>
        apiFetch(`/posts/${slug}`),

    byCategory: (categorySlug, page = 0, size = 10) =>
        apiFetch(`/posts/category/${categorySlug}?page=${page}&size=${size}`),

    byTag: (tagSlug, page = 0, size = 10) =>
        apiFetch(`/posts/tag/${tagSlug}?page=${page}&size=${size}`),

    search: (query, page = 0, size = 10) =>
        apiFetch(`/posts/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`),

    // Admin
    adminAll: (page = 0, size = 10) =>
        apiFetch(`/posts/admin/all?page=${page}&size=${size}`),

    create: payload =>
        apiFetch('/posts', { method: 'POST', body: JSON.stringify(payload) }),

    update: (id, payload) =>
        apiFetch(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

    delete: (id) =>
        apiFetch(`/posts/${id}`, { method: 'DELETE' }),
}

// Categories
export const categories = {
    list: () => apiFetch('/categories'),
}

// Tags
export const tags = {
    list: () => apiFetch('/tags'),
}

// Comments
export const comments = {
    byPost: (postId) =>
        apiFetch(`/comments/${postId}`),

    submit: (payload) =>
        apiFetch('/comments', { method: 'POST', body: JSON.stringify(payload) }),

    // Admin
    pending: () =>
        apiFetch('/comments/admin/pending'),

    approve: (id) =>
        apiFetch(`/comments/admin/${id}/approve`, { method: 'PUT' }),

    delete: (id) =>
        apiFetch(`/comments/admin/${id}`, { method: 'DELETE' }),
}