// iuser.ts
export interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'instructor';
}
