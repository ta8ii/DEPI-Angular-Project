import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { StudentProfile } from '../models/student-profile';
import { AuthService } from '../../services/auth';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private mockProfile: StudentProfile = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '',
    bio: 'Passionate learner interested in web development and programming.',
    enrolledCourses: [
      {
        id: '1',
        title: 'Complete Web Development Bootcamp',
        thumbnail: '',
        progress: 75
      },
      {
        id: '2',
        title: 'Data Science & Machine Learning',
        thumbnail: '',
        progress: 45
      },
      {
        id: '3',
        title: 'UI/UX Design Masterclass',
        thumbnail: '',
        progress: 90
      }
    ]
  };

  constructor(private authService: AuthService) {}

  getProfile(): Observable<StudentProfile> {
    const user = this.authService.getUser();
    
    // Try to load from localStorage first
    const savedProfile = localStorage.getItem(`student_profile_${user?.id || 'default'}`);
    let profileData: StudentProfile;
    
    if (savedProfile) {
      try {
        profileData = JSON.parse(savedProfile);
      } catch {
        profileData = { ...this.mockProfile };
      }
    } else {
      profileData = { ...this.mockProfile };
    }
    
    if (user) {
      // Merge auth user data with profile
      profileData = {
        ...profileData,
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || profileData.avatar || ''
      };
    }
    
    return of(profileData).pipe(delay(300));
  }

  updateProfile(profile: Partial<StudentProfile>): Observable<StudentProfile> {
    const user = this.authService.getUser();
    
    // Get current profile
    const currentProfile = this.mockProfile;
    const updatedProfile: StudentProfile = {
      ...currentProfile,
      ...profile,
      id: user?.id || currentProfile.id,
      name: profile.name || currentProfile.name,
      email: profile.email || currentProfile.email
    };
    
    // Save to localStorage
    if (user?.id) {
      localStorage.setItem(`student_profile_${user.id}`, JSON.stringify(updatedProfile));
    }
    
    // Update auth user if name or email changed
    if (user && (profile.name || profile.email || profile.avatar)) {
      const updatedUser = {
        ...user,
        name: profile.name || user.name,
        email: profile.email || user.email,
        avatar: profile.avatar || user.avatar
      };
      this.authService.saveUser(updatedUser);
    }
    
    this.mockProfile = updatedProfile;
    return of(updatedProfile).pipe(delay(300));
  }

  getEnrolledCourses(): Observable<StudentProfile['enrolledCourses']> {
    return of(this.mockProfile.enrolledCourses).pipe(delay(200));
  }
}

