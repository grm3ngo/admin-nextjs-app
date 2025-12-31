// Helper để gọi API với token từ localStorage

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
};

export async function apiFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const { skipAuth, ...fetchOptions } = options;

  // Thêm Authorization header nếu có token
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (!skipAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      // Nếu 401, xóa token và redirect về login
      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return { success: false, error: data.error || 'Phiên đăng nhập hết hạn' };
      }

      return { success: false, error: data.error || 'Có lỗi xảy ra' };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Lỗi kết nối' };
  }
}

// Shorthand methods
export const api = {
  get: <T>(url: string) => apiFetch<T>(url, { method: 'GET' }),

  post: <T>(url: string, body: unknown) =>
    apiFetch<T>(url, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(url: string, body: unknown) =>
    apiFetch<T>(url, { method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(url: string) => apiFetch<T>(url, { method: 'DELETE' }),
};
