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
  constructor(private authService: AuthService, private router: Router) {}

  userInfo = {
    Email: '',
    password: '',
  };

  submit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      form.control.markAllAsDirty();
      return;
    }

    const { email, password } = form.value;
    const success = this.authService.login(email, password);
    const currentUser = this.authService.getUser();

    if (success) {
      Swal.fire({
        title: `Welcome back ${currentUser.firstName + ' ' + currentUser.lastName}`,
        icon: 'success',
        draggable: true,
      });
      // alert(`Welcome back, ${currentUser.firstName + ' ' + currentUser.lastName} ! 👋`);
      form.reset();
      this.router.navigate(['/']);
    } else {
      alert('❌ Email or password is incorrect.');
    }
  }
}
