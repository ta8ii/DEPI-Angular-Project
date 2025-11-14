import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { InstructorProfile } from '../models/instructor-profile';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private mockProfile: InstructorProfile = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Experienced software engineer and educator with over 10 years of experience in web development. Passionate about teaching and helping students achieve their goals.',
    avatar: '',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Angular', 'Python'],
    totalCourses: 5,
    totalStudents: 4850,
    totalRevenue: 48500.50
  };

  getProfile(): Observable<InstructorProfile> {
    return of(this.mockProfile).pipe(delay(200));
  }

  updateProfile(profile: Partial<InstructorProfile>): Observable<InstructorProfile> {
    this.mockProfile = {
      ...this.mockProfile,
      ...profile
    };
    return of(this.mockProfile).pipe(delay(300));
  }

  getStatistics(): Observable<{
    totalStudents: number;
    totalCourses: number;
    revenue: number;
    newEnrollments: number;
  }> {
    return of({
      totalStudents: 4850,
      totalCourses: 5,
      revenue: 48500.50,
      newEnrollments: 127
    }).pipe(delay(200));
  }
}

