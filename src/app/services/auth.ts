import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersKey = 'users';
  private currentUserKey = 'currentUser';

  constructor() {}

  // register
  register(userData: any): boolean {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');

    // check if email already exists
    const exists = users.some((u: any) => u.email === userData.email);
    if (exists) return false;

    users.push(userData);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return true;
  }

  // login
  login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const matchedUser = users.find((u: any) => u.Email === email && u.password === password);

    if (matchedUser) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(matchedUser));
      return true;
    }

    return false;
  }

  // logout
  logout() {
    localStorage.removeItem(this.currentUserKey);
  }

  // get current user
  getUser() {
    return JSON.parse(localStorage.getItem(this.currentUserKey) || 'null');
  }

  // is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.currentUserKey);
  }
}
