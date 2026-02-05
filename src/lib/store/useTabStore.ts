import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TabStore {
  groupTabs: Record<string, 'shopping' | 'recipes'>;
  setGroupTab: (groupId: string, tab: 'shopping' | 'recipes') => void;
  getGroupTab: (groupId: string) => 'shopping' | 'recipes';
}

export const useTabStore = create<TabStore>()(
  persist(
    (set, get) => ({
      groupTabs: {},
      
      setGroupTab: (groupId, tab) =>
        set((state) => ({
          groupTabs: { ...state.groupTabs, [groupId]: tab },
        })),
      
      getGroupTab: (groupId) => {
        const state = get();
        return state.groupTabs[groupId] || 'shopping';
      },
    }),
    {
      name: 'group-tabs-storage',
    }
  )
);
