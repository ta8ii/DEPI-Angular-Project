import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
// import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // protected readonly title = signal('E-learning');

  hideLayout = false;

  constructor(private router: Router) {
    // Subscribe to router events to determine when to hide layout components
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Define routes where layout should be hidden
        const hiddenRoutes = ['/login', '/sign-up'];
        this.hideLayout = hiddenRoutes.includes(event.url);
      });
  }
}
