export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  avatar?: string;
  token: string;
}

