export interface CurrentUser {
  id: string;

  first_name: string;
  last_name: string;
  email: string;

  role: string;

  is_active: boolean;
  is_verified: boolean;

  created_at: string;
  updated_at: string;
}

