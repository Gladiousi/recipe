import api from './axios';
import { Group, GroupInvitation } from '@/types';

export const groupsAPI = {
  getAll: async () => {
    const response = await api.get<Group[]>('/groups/');
    return response.data;
  },

  getOne: async (id: number) => {
    const response = await api.get<Group>(`/groups/${id}/`);
    return response.data;
  },

  create: async (data: { name: string; description?: string }) => {
    const response = await api.post<Group>('/groups/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Group>) => {
    const response = await api.patch<Group>(`/groups/${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/groups/${id}/`);
  },

  leave: async (id: number) => {
    await api.post(`/groups/${id}/leave/`);
  },

  removeMember: async (groupId: number, userId: number) => {
    await api.delete(`/groups/${groupId}/remove_member/`, {
      data: { user_id: userId },
    });
  },

  // Приглашения
  getInvitations: async () => {
    const response = await api.get<GroupInvitation[]>('/invitations/');
    return response.data;
  },

  sendInvitation: async (groupId: number, username: string) => {
    const response = await api.post<GroupInvitation>('/invitations/', {
      group: groupId,
      invitee_username: username,
    });
    return response.data;
  },

  acceptInvitation: async (id: number) => {
    const response = await api.post(`/invitations/${id}/accept/`);
    return response.data;
  },

  declineInvitation: async (id: number) => {
    const response = await api.post(`/invitations/${id}/decline/`);
    return response.data;
  },
};
