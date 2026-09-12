const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('liferpg_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'The realm encountered an unforeseen trial.');
  }
  return data;
};

export const api = {
  auth: {
    register: async (payload: any) => {
      const res = await fetch(`/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    login: async (payload: any) => {
      const res = await fetch(`/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`/auth/me`, {
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

      const res = await fetch(`/quests?`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (data: any) => {
      const res = await fetch(`/quests`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    update: async (id: string, data: any) => {
      const res = await fetch(`/quests/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    delete: async (id: string) => {
      const res = await fetch(`/quests/`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    complete: async (id: string) => {
      const res = await fetch(`/quests//complete`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
  shop: {
    getItems: async () => {
      const res = await fetch(`/shop/items`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    buy: async (itemId: string) => {
      const res = await fetch(`/shop/buy`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ itemId }),
      });
      return handleResponse(res);
    },
    equip: async (itemId: string) => {
      const res = await fetch(`/shop/equip`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ itemId }),
      });
      return handleResponse(res);
    },
  },
  boss: {
    getActive: async () => {
      const res = await fetch(`/boss`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    resurrect: async () => {
      const res = await fetch(`/boss/resurrect`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
  character: {
    get: async () => {
      const res = await fetch(`/character`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    update: async (data: any) => {
      const res = await fetch(`/character`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },
};