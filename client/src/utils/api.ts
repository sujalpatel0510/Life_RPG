const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('liferpg_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res: Response) => {
  const contentType = res.headers.get('content-type');
  let data: any = {};
  if (contentType && contentType.includes('application/json')) {
    data = await res.json().catch(() => ({}));
  } else {
    const text = await res.text().catch(() => '');
    data = { message: text || res.statusText };
  }

  if (!res.ok) {
    throw new Error(data.message || 'The realm encountered an unforeseen trial.');
  }
  return data;
};

const safeFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  try {
    return await fetch(input, init);
  } catch (err: any) {
    if (!navigator.onLine || err.message?.includes('Failed to fetch') || err.name === 'TypeError') {
      throw new Error('Connection to the realm database was interrupted. Check your internet connection.');
    }
    throw err;
  }
};

export const api = {
  auth: {
    register: async (payload: any) => {
      const res = await safeFetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    login: async (payload: any) => {
      const res = await safeFetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await safeFetch(`${API_BASE}/auth/me`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
  quests: {
    getAll: async (params?: { category?: string; questType?: string; isCompleted?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.questType) query.append('questType', params.questType);
      if (params?.isCompleted !== undefined) query.append('isCompleted', String(params.isCompleted));

      const res = await safeFetch(`${API_BASE}/quests?${query.toString()}`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (data: any) => {
      const res = await safeFetch(`${API_BASE}/quests`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    update: async (id: string, data: any) => {
      const res = await safeFetch(`${API_BASE}/quests/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    delete: async (id: string) => {
      const res = await safeFetch(`${API_BASE}/quests/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    complete: async (id: string) => {
      const res = await safeFetch(`${API_BASE}/quests/${id}/complete`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
  shop: {
    getItems: async () => {
      const res = await safeFetch(`${API_BASE}/shop/items`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    buy: async (itemId: string) => {
      const res = await safeFetch(`${API_BASE}/shop/buy`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ itemId }),
      });
      return handleResponse(res);
    },
    equip: async (itemId: string) => {
      const res = await safeFetch(`${API_BASE}/shop/equip`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ itemId }),
      });
      return handleResponse(res);
    },
  },
  boss: {
    getActive: async () => {
      const res = await safeFetch(`${API_BASE}/boss`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    resurrect: async () => {
      const res = await safeFetch(`${API_BASE}/boss/resurrect`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
  character: {
    get: async () => {
      const res = await safeFetch(`${API_BASE}/character`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    update: async (data: any) => {
      const res = await safeFetch(`${API_BASE}/character`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },
};