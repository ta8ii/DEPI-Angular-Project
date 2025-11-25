import { Injectable } from '@angular/core';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CourseAccessService {
  private purchasedCoursesKey = 'purchased_courses';

  constructor(private authService: AuthService) {}

  // Check if user has purchased a course
  hasPurchasedCourse(courseId: string): boolean {
    const user = this.authService.getUser();
    if (!user) return false;

    const purchasedCourses = this.getPurchasedCourses(user.id);
    return purchasedCourses.includes(courseId);
  }

  // Get all purchased courses for a user
  getPurchasedCourses(userId: string): string[] {
    const key = `${this.purchasedCoursesKey}_${userId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  }

  // Mark a course as purchased
  markCourseAsPurchased(courseId: string): void {
    const user = this.authService.getUser();
    if (!user) return;

    const key = `${this.purchasedCoursesKey}_${user.id}`;
    const purchasedCourses = this.getPurchasedCourses(user.id);
    
    if (!purchasedCourses.includes(courseId)) {
      purchasedCourses.push(courseId);
      localStorage.setItem(key, JSON.stringify(purchasedCourses));
    }
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}

