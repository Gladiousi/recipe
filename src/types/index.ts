export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio?: string;
  avatar?: string;
  created_at: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  owner: User;
  members_detail: GroupMembership[];
  members_count: number;
  created_at: string;
  updated_at: string;
}

export interface GroupMembership {
  id: number;
  user: User;
  joined_at: string;
  is_admin: boolean;
}

export interface GroupInvitation {
  id: number;
  group: {
    id: number;
    name: string;
    description?: string;
  };
  invited_by: User;
  invitee: User;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}


export interface ShoppingList {
  id: number;
  group: number;
  name: string;
  is_pinned: boolean;
  items: ShoppingItem[];
  items_count: number;
  checked_count: number;
  created_by: User;
  created_at: string;
  updated_at: string;
}

export interface ShoppingItem {
  id: number;
  name: string;
  quantity?: number;
  unit?: string;
  is_checked: boolean;
  is_pinned: boolean;  // ДОБАВЛЕНО
  added_by: User;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: number;
  group: number;
  title: string;
  description: string;
  image?: string;
  cooking_time?: number;
  servings?: number;
  is_pinned: boolean;
  ingredients: RecipeIngredient[];
  created_by: User;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: number;
  name: string;
  quantity?: number;
  unit?: string;
  order: number;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

export interface GroupInvitationFromBackend {
  id: number;
  group: number;
  group_name: string;
  inviter: User;
  invitee: User;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}