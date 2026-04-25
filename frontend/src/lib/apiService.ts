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
  
  // If it's a local upload, we need the backend host (5000)
  // because the frontend (3000) doesn't have an /uploads folder.
  const backendHost = 'http://localhost:5000';
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  return `${backendHost}${normalizedUrl}`;
};
