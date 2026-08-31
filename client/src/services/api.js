const TOKEN_KEY = 'crochet_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function apiBase() {
  return import.meta.env.VITE_API_URL || '/api';
}

export async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${apiBase()}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    const error = new Error('Unable to reach the studio. Check your connection and try again.');
    error.status = 0;
    throw error;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Request failed.');
    error.status = response.status;
    error.details = data.details;
    error.needsVerification = Boolean(data.needsVerification);
    error.email = data.email;
    throw error;
  }
  return data;
}

export async function uploadImage(file) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const body = new FormData();
  body.append('image', file);
  let response;
  try {
    response = await fetch(`${apiBase()}/uploads`, { method: 'POST', headers, body });
  } catch {
    const error = new Error('Unable to reach the studio. Check your connection and try again.');
    error.status = 0;
    throw error;
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Image upload failed.');
  }
  return data;
}
