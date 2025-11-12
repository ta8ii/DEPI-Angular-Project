import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isLoggedIn = false;
  currentUser: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.refreshUser();
  }

  refreshUser() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getUser();
  }

  logout() {
    this.authService.logout();
    this.refreshUser();
    this.router.navigate(['/']);
  }
}
