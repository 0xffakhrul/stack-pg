export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  created_at: Date;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
}

export interface Bookmark {
  id: number;
  created_at: Date;
  title: string;
  description: string;
  url: string;
  tags: string[];
  user_id: number;
  favicon: string;
}
