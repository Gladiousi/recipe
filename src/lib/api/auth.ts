import api from './axios';
import { User, LoginCredentials, RegisterData, AuthTokens } from '@/types';

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthTokens>('/auth/login/', credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<{ user: User } & AuthTokens>('/auth/register/', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<User>('/auth/me/');
    return response.data;
  },

  searchUsers: async (query: string) => {
    const response = await api.get<User[]>('/auth/search/', {
      params: { q: query },
    });
    return response.data;
  },
};
