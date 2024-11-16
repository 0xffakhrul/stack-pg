export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Bookmark {
  id: string;
  title: string;
  description: string;
  url: string;
  favicon?: string;
  tags: string[];
  created_at: string;
  user_id: string;
}
