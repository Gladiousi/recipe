import { create } from 'zustand';
import { Group } from '@/types';
import { groupsAPI } from '@/lib/api/groups';

interface GroupState {
  groups: Group[];
  currentGroup: Group | null;
  isLoading: boolean;
  fetchGroups: () => Promise<void>;
  setCurrentGroup: (group: Group | null) => void;
  createGroup: (data: { name: string; description?: string }) => Promise<Group>;
  deleteGroup: (id: number) => Promise<void>;
}

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  currentGroup: null,
  isLoading: false,

  fetchGroups: async () => {
    set({ isLoading: true });
    try {
      const groups = await groupsAPI.getAll();
      set({ groups, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setCurrentGroup: (group) => {
    set({ currentGroup: group });
  },

  createGroup: async (data) => {
    const group = await groupsAPI.create(data);
    set((state) => ({ groups: [...state.groups, group] }));
    return group;
  },

  deleteGroup: async (id) => {
    await groupsAPI.delete(id);
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== id),
      currentGroup: state.currentGroup?.id === id ? null : state.currentGroup,
    }));
  },
}));
