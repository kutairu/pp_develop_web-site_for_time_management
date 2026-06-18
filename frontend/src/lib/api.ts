// Сразу указываем боевую ссылку на Render
const API_URL = 'https://kutairu.github.io/pp_develop_web-site_for_time_management';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };


  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка запроса');
  }

  return response.json();
};