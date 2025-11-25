import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-log-in',
  imports: [RouterLink, FormsModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css',
})
export class LogIn {
  showPassword = false;
  private apiUrl = 'http://localhost:3000'; // Backend API URL

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  userInfo = {
    Email: '',
    password: '',
  };

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      form.control.markAllAsDirty();
      return;
    }

    // Get email from form - check both Email and email fields
    const email = form.value.Email || form.value.email || this.userInfo.Email;
    const password = form.value.password || this.userInfo.password;

    console.log('Login attempt:', { email, password, formValue: form.value });

    if (!email || !password) {
      alert('❌ Please enter both email and password.');
      return;
    }

    // Send request to backend auth login endpoint using HttpClient
    this.http
      .post<{
        message: string;
        user: { username: string; email: string; role: string };
        token: string;
      }>(`${this.apiUrl}/auth/login`, { email, password })
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);

          // Map backend response to frontend format
          const frontendRole =
            response.user.role === 'user'
              ? 'student'
              : response.user.role === 'instructor'
              ? 'instructor'
              : 'student';

          const authUser = {
            id: response.user.email,
            name: response.user.username || 'User',
            email: response.user.email,
            role:
              frontendRole === 'student' || frontendRole === 'instructor'
                ? (frontendRole as 'student' | 'instructor')
                : 'student',
            avatar: '',
            token: response.token,
          };

          // Save user to localStorage using AuthService
          this.authService.saveUser(authUser);

          Swal.fire({
            title: `Welcome back ${authUser.name}`,
            icon: 'success',
            draggable: true,
          });
          form.reset();

          // Role-based redirect
          // Navbar will auto-update via Router events listener
          if (authUser.role === 'student') {
            this.router.navigate(['/student/home']);
          } else if (authUser.role === 'instructor') {
            this.router.navigate(['/instructor/home']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          const errorMessage = error?.error?.message || 'Email or password is incorrect.';
          Swal.fire({
            title: 'Login Failed',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
  }
}
