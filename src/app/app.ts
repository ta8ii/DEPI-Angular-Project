import { Component, signal, OnInit } from '@angular/core';
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
export class App implements OnInit {
  // protected readonly title = signal('E-learning');

  hideLayout = false;

  constructor(private router: Router) {
    // Subscribe to router events to determine when to hide layout components
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Define routes where layout should be hidden
        const hiddenRoutes = ['/login', '/sign-up', '/dash'];
        // Also hide for all dashboard routes
        this.hideLayout = hiddenRoutes.includes(event.url) || event.url.startsWith('/dashboard');
      });
  }

  ngOnInit() {
    // Create test user with all courses on app initialization
    this.createTestUserWithAllCourses();
  }

  private createTestUserWithAllCourses() {
    // Test User Credentials
    const testUser = {
      id: 'test-user-001',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@student.com',
      Email: 'test@student.com', // For compatibility
      password: '12345678',
      phone: '01234567890',
      role: 'student',
      avatar: ''
    };

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    const existingUserIndex = users.findIndex((u: any) => 
      (u.email || u.Email || '').toLowerCase() === testUser.email.toLowerCase()
    );

    if (existingUserIndex >= 0) {
      // Update existing user
      users[existingUserIndex] = { ...users[existingUserIndex], ...testUser };
    } else {
      // Add new user
      users.push(testUser);
    }

    // Save users
    localStorage.setItem('users', JSON.stringify(users));

    // Purchase ALL courses (IDs: 1, 2, 3, 4, 5, 6) - Full Access
    const purchasedCourseIds = ['1', '2', '3', '4', '5', '6'];
    localStorage.setItem(
      `purchased_courses_${testUser.id}`,
      JSON.stringify(purchasedCourseIds)
    );

    console.log('✅ Test User Created/Updated Successfully!');
    console.log('📧 Email:', testUser.email);
    console.log('🔑 Password:', testUser.password);
    console.log('📚 Purchased Courses:', purchasedCourseIds, '(ALL COURSES - Full Access)');
    console.log('👤 User ID:', testUser.id);
    console.log('🎯 Role:', testUser.role);
    console.log('🚀 Full Access: Can access all courses (1-6)');
  }
}
