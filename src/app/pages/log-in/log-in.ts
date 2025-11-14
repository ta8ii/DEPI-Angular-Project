import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
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

  constructor(private authService: AuthService, private router: Router) {}

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

    const authUser = this.authService.login(email, password);

    if (authUser) {
      console.log('Login successful:', authUser);
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
    } else {
      console.log('Login failed - user not found');
      alert('❌ Email or password is incorrect.');
    }
  }
}
