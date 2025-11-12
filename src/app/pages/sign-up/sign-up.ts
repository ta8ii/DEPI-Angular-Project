import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  constructor(private authService: AuthService, private router: Router) {}

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

  submit(form: any) {
    if (!form.valid) {
      alert('Please fill all fields correctly.');
      return;
    }

    const success = this.authService.register(form.value);

    if (success) {
      alert('Registration successful ✅');
      form.reset();
      this.router.navigate(['/login']);
    } else {
      alert('This email is already registered ❌');
    }
  }
}
