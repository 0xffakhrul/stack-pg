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
