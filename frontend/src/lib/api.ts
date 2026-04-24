const rawApiBase = (import.meta.env.VITE_API_URL || 'https://e-commerce-csec-astu-bootcamp.onrender.com/api').replace(/\/$/, '');

export const apiBase = rawApiBase.endsWith('/api') ? rawApiBase : `${rawApiBase}/api`;

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBase}${normalizedPath}`;
};
