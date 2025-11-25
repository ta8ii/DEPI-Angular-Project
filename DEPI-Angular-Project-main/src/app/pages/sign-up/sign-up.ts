import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  showPassword = false;
  private apiUrl = 'http://localhost:3000'; // Backend API URL

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  userInfo = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  };

  selectedRole: string = '';

  selectRole(role: string) {
    this.selectedRole = role;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submit(form: any) {
    if (!form.valid) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill all fields correctly.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (!this.selectedRole) {
      Swal.fire({
        title: 'Role Required',
        text: 'Please select a role (Student or Instructor).',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    const userData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      role: this.selectedRole,
    };

    // Map frontend form data to backend CreateUserDto format
    // Backend expects: username, email, password, role
    const registerData = {
      username: `${userData.firstName} ${userData.lastName}`.trim() || userData.email,
      email: userData.email,
      password: userData.password,
      role: userData.role === 'student' ? 'user' : userData.role, // Map student to user for backend
    };

    // Send request to backend auth register endpoint using HttpClient
    this.http
      .post<{
        message: string;
        user: { username: string; email: string; role: string };
        token: string;
      }>(`${this.apiUrl}/auth/register`, registerData)
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);

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
            title: 'Registration Successful!',
            text: `Welcome ${authUser.name}! Your account has been created.`,
            icon: 'success',
            confirmButtonText: 'OK',
          });
          form.reset();
          this.selectedRole = '';
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          const errorMessage = error?.error?.message || 'Registration failed. Please try again.';
          Swal.fire({
            title: 'Registration Failed',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
  }
}
