import api from './axios';
import { Recipe, RecipeIngredient } from '@/types';

export const recipesAPI = {
  // Рецепты
  getAll: async (groupId?: number) => {
    const response = await api.get<Recipe[]>('/recipes/recipes/', {
      params: groupId ? { group: groupId } : {},
    });
    return response.data;
  },

  getOne: async (id: number) => {
    const response = await api.get<Recipe>(`/recipes/recipes/${id}/`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await api.post<Recipe>('/recipes/recipes/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: number, data: FormData) => {
    const response = await api.patch<Recipe>(`/recipes/recipes/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/recipes/recipes/${id}/`);
  },

  togglePin: async (id: number) => {
    const response = await api.post<Recipe>(`/recipes/recipes/${id}/toggle_pin/`);
    return response.data;
  },

  // Ингредиенты
  getIngredients: async (recipeId: number) => {
    const response = await api.get<RecipeIngredient[]>('/recipes/ingredients/', {
      params: { recipe: recipeId },
    });
    return response.data;
  },

  createIngredient: async (data: {
    recipe: number;
    name: string;
    quantity?: number;
    unit?: string;
  }) => {
    const response = await api.post<RecipeIngredient>('/recipes/ingredients/', data);
    return response.data;
  },

  updateIngredient: async (id: number, data: Partial<RecipeIngredient>) => {
    const response = await api.patch<RecipeIngredient>(`/recipes/ingredients/${id}/`, data);
    return response.data;
  },

  deleteIngredient: async (id: number) => {
    await api.delete(`/recipes/ingredients/${id}/`);
  },

  reorderIngredients: async (ingredients: { id: number; order: number }[]) => {
    const response = await api.post('/recipes/ingredients/reorder/', { ingredients });
    return response.data;
  },
};
