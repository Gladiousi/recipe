import api from './axios';
import { Group } from '@/types';

interface GroupInvitationResponse {
  id: number;
  group: number;
  group_name: string;
  inviter: {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
  };
  invitee: {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
  };
  status: string;
  created_at: string;
}

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
    await api.post(`/groups/${groupId}/remove_member/`, { user_id: userId });
  },

sendInvitation: async (groupId: number, username: string) => {
    const response = await api.post(`/groups/${groupId}/send-invitation/`, {
        invitee_username: username,
    });
    return response.data;
},

getInvitations: async () => {
    const response = await api.get<GroupInvitationResponse[]>('/invitations/');
    return response.data;
},

acceptInvitation: async (invitationId: number) => {
    const response = await api.post(`/invitations/${invitationId}/accept/`);
    return response.data;
},

declineInvitation: async (invitationId: number) => {
    const response = await api.post(`/invitations/${invitationId}/decline/`);
    return response.data;
},
};
