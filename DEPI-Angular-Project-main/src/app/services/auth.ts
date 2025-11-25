import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AuthUser } from '../models/auth-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersKey = 'users';
  private authUserKey = 'auth_user';
  private apiUrl = 'http://localhost:3000'; // Backend API URL

  constructor(private router: Router, private http: HttpClient) {}

  // register - local storage (kept for backward compatibility)
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
      email: userData.email || userData.Email,
    };

    users.push(normalizedUserData);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return true;
  }

  // registerApi - sends request to backend auth register endpoint
  registerApi(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  }): Observable<AuthUser> {
    // Map frontend form data to backend CreateUserDto format
    // Backend expects: username, email, password
    // Frontend role 'student' maps to backend role 'user'
    const registerData = {
      username: `${userData.firstName} ${userData.lastName}`.trim() || userData.email,
      email: userData.email,
      password: userData.password,
      role: userData.role === 'student' ? 'user' : userData.role, // Map student to user for backend
    };

    return this.http
      .post<{
        message: string;
        user: { username: string; email: string; role: string };
        token: string;
      }>(`${this.apiUrl}/auth/register`, registerData)
      .pipe(
        map((response) => {
          // Map backend response to AuthUser format
          // Map backend role 'user' back to 'student' for frontend
          const frontendRole =
            response.user.role === 'user'
              ? 'student'
              : response.user.role === 'instructor'
                ? 'instructor'
                : 'student';

          const authUser: AuthUser = {
            id: response.user.email, // Using email as ID (backend doesn't return _id in response)
            name: response.user.username || 'User',
            email: response.user.email,
            role: (frontendRole === 'student' || frontendRole === 'instructor')
              ? (frontendRole as 'student' | 'instructor')
              : 'student',
            avatar: '',
            token: response.token,
          };

          // Save user to localStorage
          this.saveUser(authUser);
          return authUser;
        }),
        catchError((error) => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  // login - returns AuthUser object (local storage - kept for backward compatibility)
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
        name:
          `${matchedUser.firstName || ''} ${matchedUser.lastName || ''}`.trim() ||
          matchedUser.name ||
          'User',
        email: matchedUser.Email || matchedUser.email || email,
        role: matchedUser.role || 'student', // Default to student if role is missing
        avatar: matchedUser.avatar || '',
        token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

  // loginApi - sends request to backend auth login endpoint
  loginApi(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post<{
        message: string;
        user: { username: string; email: string; role: string };
        token: string;
      }>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        map((response) => {
          // Map backend response to AuthUser format
          // Map backend role 'user' back to 'student' for frontend
          const frontendRole =
            response.user.role === 'user'
              ? 'student'
              : response.user.role === 'instructor'
                ? 'instructor'
                : 'student';

          const authUser: AuthUser = {
            id: response.user.email, // Using email as ID (backend doesn't return _id in response)
            name: response.user.username || 'User',
            email: response.user.email,
            role: (frontendRole === 'student' || frontendRole === 'instructor')
              ? (frontendRole as 'student' | 'instructor')
              : 'student',
            avatar: '',
            token: response.token,
          };

          // Save user to localStorage
          this.saveUser(authUser);
          return authUser;
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
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
