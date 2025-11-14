import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from '../models/auth-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersKey = 'users';
  private authUserKey = 'auth_user';

  constructor(private router: Router) {}

  // register
  register(userData: any): boolean {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');

    // Normalize email for comparison (check both email and Email)
    const userEmail = userData.email || userData.Email || '';
    const exists = users.some((u: any) => {
      const existingEmail = (u.email || u.Email || '').toLowerCase();
      return existingEmail === userEmail.toLowerCase();
    });
    
    if (exists) return false;

    // Normalize userData - ensure Email field exists for login compatibility
    const normalizedUserData = {
      ...userData,
      Email: userData.email || userData.Email, // Keep both for compatibility
      email: userData.email || userData.Email
    };

    users.push(normalizedUserData);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return true;
  }

  // login - returns AuthUser object
  login(email: string, password: string): AuthUser | null {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    
    // Normalize email for comparison
    const normalizedEmail = email.toLowerCase();
    
    // Find user by email (check both Email and email fields) and password
    const matchedUser = users.find((u: any) => {
      const userEmail = (u.Email || u.email || '').toLowerCase();
      return userEmail === normalizedEmail && u.password === password;
    });

    if (matchedUser) {
      // Create AuthUser object
      const authUser: AuthUser = {
        id: matchedUser.id || Date.now().toString(),
        name: `${matchedUser.firstName || ''} ${matchedUser.lastName || ''}`.trim() || matchedUser.name || 'User',
        email: matchedUser.Email || matchedUser.email || email,
        role: matchedUser.role || 'student', // Default to student if role is missing
        avatar: matchedUser.avatar || '',
        token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // Validate role
      if (authUser.role !== 'student' && authUser.role !== 'instructor') {
        authUser.role = 'student'; // Default to student if invalid role
      }

      this.saveUser(authUser);
      return authUser;
    }

    return null;
  }

  // logout
  logout() {
    localStorage.removeItem(this.authUserKey);
    this.router.navigate(['/login']);
  }

  // save user to localStorage
  saveUser(user: AuthUser) {
    localStorage.setItem(this.authUserKey, JSON.stringify(user));
  }

  // get current user
  getUser(): AuthUser | null {
    const userStr = localStorage.getItem(this.authUserKey);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // get token
  getToken(): string | null {
    const user = this.getUser();
    return user?.token || null;
  }

  // is logged in
  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  // check if user is instructor
  isInstructor(): boolean {
    const user = this.getUser();
    return user?.role === 'instructor';
  }

  // check if user is student
  isStudent(): boolean {
    const user = this.getUser();
    return user?.role === 'student';
  }
}
