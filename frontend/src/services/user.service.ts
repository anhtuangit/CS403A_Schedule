import api from './api';

export interface User {
  _id: string;
  email: string;
  name: string;
  picture?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginHistory {
  _id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  loginAt: string;
}

export const getProfile = async (): Promise<{ user: User }> => {
  const response = await api.get<{ user: User }>('/users/profile');
  return response.data;
};

export const updateProfile = async (data: { name?: string; picture?: string }): Promise<{ message: string; user: User }> => {
  const response = await api.put<{ message: string; user: User }>('/users/profile', data);
  return response.data;
};

export const getLoginHistory = async (page?: number, limit?: number): Promise<{
  history: LoginHistory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> => {
  const response = await api.get('/users/login-history', { params: { page, limit } });
  return response.data;
};

