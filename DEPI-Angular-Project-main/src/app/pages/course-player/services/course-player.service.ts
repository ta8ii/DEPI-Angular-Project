import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, delay, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Course } from '../models/course';
import { VideoItem } from '../models/video-item';
import { CompletionState } from '../models/completion-state';
import { AuthService } from '../../../services/auth';

@Injectable({
  providedIn: 'root'
})
export class CoursePlayerService {
  private readonly BASE_URL = 'https://api.example.com'; // Replace with your actual API URL
  private readonly API_ENDPOINTS = {
    getCourse: (courseId: string) => `${this.BASE_URL}/courses/${courseId}`,
    getCourseVideos: (courseId: string) => `${this.BASE_URL}/courses/${courseId}/videos`,
    getCompletionStatus: (courseId: string, userId: string) => 
      `${this.BASE_URL}/courses/${courseId}/completion?userId=${userId}`,
    markVideoCompleted: (courseId: string) => `${this.BASE_URL}/courses/${courseId}/completion`
  };

  // Mock data for development
  private mockCourses: { [key: string]: Course } = {
    '1': {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and build amazing web applications from scratch.',
      instructor: 'John Smith',
      category: 'Programming',
      videos: [
        { id: '1', title: 'Introduction to Web Development', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '02:10' },
        { id: '2', title: 'HTML Fundamentals', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: '05:22' },
        { id: '3', title: 'CSS Styling Basics', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '07:11' },
        { id: '4', title: 'JavaScript Basics', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', duration: '10:30' },
        { id: '5', title: 'React Introduction', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', duration: '12:45' },
        { id: '6', title: 'Node.js Backend', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', duration: '15:20' }
      ]
    },
    '2': {
      id: '2',
      title: 'Data Science & Machine Learning',
      description: 'Master Python, statistics, machine learning algorithms and data visualization techniques.',
      instructor: 'Sarah Johnson',
      category: 'Data Science',
      videos: [
        { id: '1', title: 'Introduction to Data Science', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '03:15' },
        { id: '2', title: 'Python Basics', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: '06:30' }
      ]
    }
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get course details including videos
   */
  getCourse(courseId: string): Observable<Course> {
    // For now, use mock data. Replace with actual HTTP call when backend is ready
    const mockCourse = this.mockCourses[courseId];
    
    if (mockCourse) {
      console.log('📚 Returning mock course:', courseId, mockCourse);
      return of(mockCourse).pipe(delay(300));
    }

    // If course not found in mock data, return a default course with videos
    console.warn('⚠️ Course not found in mock data, returning default course:', courseId);
    const defaultCourse: Course = {
      id: courseId,
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and build amazing web applications from scratch.',
      instructor: 'John Smith',
      category: 'Programming',
      videos: [
        { id: '1', title: 'Introduction to Web Development', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '02:10' },
        { id: '2', title: 'HTML Fundamentals', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: '05:22' },
        { id: '3', title: 'CSS Styling Basics', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '07:11' },
        { id: '4', title: 'JavaScript Basics', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', duration: '10:30' },
        { id: '5', title: 'React Introduction', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', duration: '12:45' },
        { id: '6', title: 'Node.js Backend', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', duration: '15:20' }
      ]
    };
    
    return of(defaultCourse).pipe(delay(300));

    // Actual HTTP call (commented for now)
    /*
    return this.http.get<Course>(this.API_ENDPOINTS.getCourse(courseId)).pipe(
      catchError(this.handleError<Course>('getCourse'))
    );
    */
  }

  /**
   * Get course videos only
   */
  getCourseVideos(courseId: string): Observable<VideoItem[]> {
    const mockCourse = this.mockCourses[courseId];
    
    if (mockCourse) {
      return of(mockCourse.videos).pipe(delay(200));
    }

    // Actual HTTP call (commented for now)
    /*
    return this.http.get<VideoItem[]>(this.API_ENDPOINTS.getCourseVideos(courseId)).pipe(
      catchError(this.handleError<VideoItem[]>('getCourseVideos', []))
    );
    */

    return of([]);
  }

  /**
   * Get completion status for a user
   */
  getCompletionStatus(courseId: string, userId: string): Observable<string[]> {
    // Try localStorage first
    const localKey = `course_${courseId}_completed_${userId}`;
    const localData = localStorage.getItem(localKey);
    
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          return of(parsed).pipe(delay(100));
        }
      } catch (e) {
        console.warn('Failed to parse local completion data', e);
      }
    }

    // Actual HTTP call (commented for now)
    /*
    return this.http.get<{ completedVideoIds: string[] }>(
      this.API_ENDPOINTS.getCompletionStatus(courseId, userId)
    ).pipe(
      map(response => response.completedVideoIds || []),
      catchError(this.handleError<string[]>('getCompletionStatus', []))
    );
    */

    return of([]).pipe(delay(100));
  }

  /**
   * Mark a video as completed
   */
  markVideoCompleted(courseId: string, userId: string, videoId: string): Observable<void> {
    // Update localStorage immediately
    const localKey = `course_${courseId}_completed_${userId}`;
    const existing = localStorage.getItem(localKey);
    let completedIds: string[] = [];
    
    if (existing) {
      try {
        completedIds = JSON.parse(existing);
      } catch (e) {
        console.warn('Failed to parse existing completion data', e);
      }
    }

    if (!completedIds.includes(videoId)) {
      completedIds.push(videoId);
      localStorage.setItem(localKey, JSON.stringify(completedIds));
    }

    // Actual HTTP call (commented for now)
    /*
    const body = {
      userId,
      videoId,
      completed: true
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http.post<void>(this.API_ENDPOINTS.markVideoCompleted(courseId), body, { headers }).pipe(
      catchError(this.handleError<void>('markVideoCompleted'))
    );
    */

    return of(void 0).pipe(delay(200));
  }

  /**
   * Error handler
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // Return a safe default value
      return of(result as T);
    };
  }
}

