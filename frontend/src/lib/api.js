const envApiBase = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/$/, '') : '';
const rawApiBase = envApiBase || '/api';

export const apiBase = rawApiBase.endsWith('/api') ? rawApiBase : `${rawApiBase}/api`;

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBase}${normalizedPath}`;
};
