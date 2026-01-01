// helper de goi API tu frontend
// xy ly token va phan hoi loi

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
};

export async function apiFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const { skipAuth, ...fetchOptions } = options;

  const headers: HeadersInit = { // them headers mac dinh
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (!skipAuth) {
    const token = localStorage.getItem('token'); //lay token tu localStorage
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
      if (res.status === 401) { // neu chua dang nhap hoac token het han
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

export const api = { // cac phuong thuc api
  get: <T>(url: string) => apiFetch<T>(url, { method: 'GET' }),

  post: <T>(url: string, body: unknown) =>
    apiFetch<T>(url, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(url: string, body: unknown) =>
    apiFetch<T>(url, { method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(url: string) => apiFetch<T>(url, { method: 'DELETE' }),
};
