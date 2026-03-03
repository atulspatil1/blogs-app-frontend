// Date formatting
export function formatDate(isoStr) {
    if(!isoStr) return '';
    
    const date = new Date(isoStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function formatYear(isoStr) {
    if(!isoStr) return '';
    
    return new Date(isoStr).getFullYear();
}

// Reading time
export function readingTime(content = '') {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 220);
    
    return `${minutes} min read`;
}

// Slug
export function toSlug(str = '') {
    return str.toLocaleLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')// Replace spaces with hyphens
}

// Class name helper
export function cx(...classes) {
    return classes.filter(Boolean).join(' ');
}