import { useState, useEffect, useCallback } from 'react';

// Generic async hook
export function useAsync(asyncFn, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const execute = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await asyncFn();
            setData(result);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => { execute() }, [execute]);

    return { data, loading, error, refetch: execute };
}

// Paginated list hook
export function usePaginated(asyncFn, deps = []) {
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async (page) => {
        setLoading(true);
        setError(null);
        try {
            const result = await asyncFn(page, size);
            setData(result);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, size]);

    useEffect(() => { load(page) }, [load, page]);

    return {
        content: data?.content ?? [],
        totalPages: data?.totalPages ?? 0,
        totalElements: data?.totalElements ?? 0,
        currentPage: page, loading, error,
        goToPage: setPage,
        hasNext: data ? !data.last : false,
        hasPrev: data ? !data.first : false
    }
}

// Reading progress hook
export function useReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const update = () => {
            const el = document.documentElement;
            const top = el.scrollTop;
            const max = el.scrollHeight - el.clientHeight;
            setProgress(max > 0 ? (top / max) * 100 : 0);
        }
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, []);

    return progress;
}