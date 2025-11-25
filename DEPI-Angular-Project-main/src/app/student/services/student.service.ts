import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StudentProfile } from '../models/student-profile';
import { AuthService } from '../../services/auth';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProfile(): Observable<StudentProfile> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<StudentProfile>(`${this.apiUrl}/users/profile/me`, { headers });
  }

  updateProfile(profile: Partial<StudentProfile>): Observable<StudentProfile> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Map frontend fields to backend fields
    const updateData = {
      username: profile.name,
      email: profile.email,
      imgUrl: profile.avatar,
      bio: profile.bio,
    };

    return this.http.patch<StudentProfile>(`${this.apiUrl}/users/profile/me`, updateData, {
      headers,
    });
  }

  getEnrolledCourses(): Observable<NonNullable<StudentProfile['enrolledCourses']>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<{ enrolledCourses: any[] }>(`${this.apiUrl}/enrollments`, { headers })
      .pipe(map((response) => response.enrolledCourses || []));
  }
}
