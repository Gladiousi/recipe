import api from './axios';
import { ShoppingList, ShoppingItem } from '@/types';

export const shoppingAPI = {
  // Списки
  getLists: async (groupId?: number) => {
    const response = await api.get<ShoppingList[]>('/shopping/lists/', {
      params: groupId ? { group: groupId } : {},
    });
    return response.data;
  },

  getList: async (id: number) => {
    const response = await api.get<ShoppingList>(`/shopping/lists/${id}/`);
    return response.data;
  },

  createList: async (data: { group: number; name: string }) => {
    const response = await api.post<ShoppingList>('/shopping/lists/', data);
    return response.data;
  },

  updateList: async (id: number, data: Partial<ShoppingList>) => {
    const response = await api.patch<ShoppingList>(`/shopping/lists/${id}/`, data);
    return response.data;
  },

  deleteList: async (id: number) => {
    await api.delete(`/shopping/lists/${id}/`);
  },

  togglePin: async (id: number) => {
    const response = await api.post<ShoppingList>(`/shopping/lists/${id}/toggle_pin/`);
    return response.data;
  },

  // Элементы
  getItems: async (shoppingListId: number) => {
    const response = await api.get<ShoppingItem[]>('/shopping/items/', {
      params: { shopping_list: shoppingListId },
    });
    return response.data;
  },

  createItem: async (data: {
    shopping_list: number;
    name: string;
    quantity?: number;
    unit?: string;
  }) => {
    const response = await api.post<ShoppingItem>('/shopping/items/', data);
    return response.data;
  },

  updateItem: async (id: number, data: Partial<ShoppingItem>) => {
    const response = await api.patch<ShoppingItem>(`/shopping/items/${id}/`, data);
    return response.data;
  },

  deleteItem: async (id: number) => {
    await api.delete(`/shopping/items/${id}/`);
  },

  toggleCheck: async (id: number) => {
    const response = await api.post<ShoppingItem>(`/shopping/items/${id}/toggle_check/`);
    return response.data;
  },

  toggleItemPin: async (id: number) => {
    const response = await api.post<ShoppingItem>(`/shopping/items/${id}/toggle_pin/`);
    return response.data;
  },

  reorderItems: async (items: { id: number; order: number }[]) => {
    const response = await api.post('/shopping/items/reorder/', { items });
    return response.data;
  },
};
