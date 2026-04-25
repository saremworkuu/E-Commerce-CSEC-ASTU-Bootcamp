const envApiBase = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/$/, '') : '';
// Use proxy /api by default for better compatibility, fallback to direct localhost if needed
const rawApiBase = envApiBase || '/api';

export const apiBase = rawApiBase.endsWith('/api') ? rawApiBase : `${rawApiBase}/api`;

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBase}${normalizedPath}`;
};

export const resolveImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  // For uploaded images, use the same base as API calls
  // This works in both development and production
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  
  // If the URL starts with /uploads, we need to use the backend base
  if (normalizedUrl.startsWith('/uploads')) {
    // Remove the /api part for static files
    const apiBaseWithoutApi = apiBase.replace('/api', '');
    return `${apiBaseWithoutApi}${normalizedUrl}`;
  }
  
  return normalizedUrl;
};
