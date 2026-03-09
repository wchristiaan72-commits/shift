
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || '';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = { ...options.headers as any };
  const method = options.method?.toUpperCase() || 'GET';
  
  if (method !== 'GET' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    return data;
  } else {
    // If not JSON, it might be an error page (HTML)
    if (!response.ok) {
      const text = await response.text();
      console.error('Non-JSON error response:', text);
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }
}
