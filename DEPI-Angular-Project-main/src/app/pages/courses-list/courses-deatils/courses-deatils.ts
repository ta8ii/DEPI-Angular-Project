import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CourseAccessService } from '../../../services/course-access.service';
import { AuthService } from '../../../services/auth';
import { filter, Subscription } from 'rxjs';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: any;
  category: string[];
  rating: any[];
  enrolledStudents: any[];
  thumbnail?: string;
  price: number;
  discount?: number;
  lessons: any[];
}

interface Lesson {
  _id: string;
  title: string;
  duration: number;
  lessonOrder: number;
  isPreviewFree: boolean;
  courseId: any;
}

@Component({
  selector: 'app-courses-deatils',
  imports: [RouterLink, CommonModule],
  templateUrl: './courses-deatils.html',
  styleUrl: './courses-deatils.css',
})
export class CoursesDeatils implements OnInit, OnDestroy {
  courseId: string | null = null;
  course: Course | null = null;
  lessons: Lesson[] = [];
  loading = true;
  processingPayment = false;
  isLoggedIn = false;
  hasPurchased = false;
  private routerSubscription?: Subscription;
  private apiUrl = 'http://localhost:3000';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private courseAccessService: CourseAccessService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.fetchCourse();
    }
    this.checkAccess();

    // Listen to route changes
    this.route.params.subscribe(() => {
      this.courseId = this.route.snapshot.paramMap.get('id');
      if (this.courseId) {
        this.fetchCourse();
      }
      this.checkAccess();
    });

    // Listen to navigation events
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAccess();
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  fetchCourse() {
    if (!this.courseId) return;

    this.loading = true;
    this.http.get<Course>(`${this.apiUrl}/courses/${this.courseId}`).subscribe({
      next: (data) => {
        this.course = data;
        this.fetchLessons();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  fetchLessons() {
    this.http.get<Lesson[]>(`${this.apiUrl}/lessons`).subscribe({
      next: (allLessons) => {
        if (this.courseId) {
          this.lessons = allLessons
            .filter((lesson) => {
              const lessonCourseId = (lesson as any).courseId?._id || (lesson as any).courseId;
              return String(lessonCourseId) === String(this.courseId);
            })
            .sort((a, b) => a.lessonOrder - b.lessonOrder);
        }
      },
      error: () => {
        this.lessons = [];
      },
    });
  }

  checkAccess() {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn && this.courseId) {
      this.hasPurchased = this.courseAccessService.hasPurchasedCourse(this.courseId);
    } else {
      this.hasPurchased = false;
    }
  }

  getInstructorName(): string {
    return (
      this.course?.instructor?.username || this.course?.instructor?.email || 'Unknown Instructor'
    );
  }

  getCategory(): string {
    return this.course?.category?.[0] || 'General';
  }

  getRating(): number {
    if (!this.course?.rating || this.course.rating.length === 0) return 0;
    const sum = this.course.rating.reduce((acc: number, r: any) => acc + (r.score || 0), 0);
    return Math.round((sum / this.course.rating.length) * 10) / 10;
  }

  getStudents(): number {
    return this.course?.enrolledStudents?.length || 0;
  }

  getPrice(): number {
    return this.course?.price || 0;
  }

  getDiscountedPrice(): number {
    if (!this.course) return 0;
    const discount = this.course.discount || 0;
    return this.course.price * (1 - discount / 100);
  }

  getTotalDuration(): number {
    return this.lessons.reduce((total, lesson) => total + lesson.duration, 0);
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }

  onBuyNow() {
    if (!this.courseId || !this.course || this.processingPayment) return;

    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/courses/${this.courseId}` },
      });
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/courses/${this.courseId}` },
      });
      return;
    }

    this.processingPayment = true;

    // Create enrollment and get Stripe checkout URL
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post<{ sessionId: string; url: string }>(
        `${this.apiUrl}/enrollments`,
        { courseId: this.courseId },
        { headers }
      )
      .subscribe({
        next: (response) => {
          // Redirect to Stripe checkout
          if (response.url) {
            window.location.href = response.url;
          } else {
            this.processingPayment = false;
            alert('Failed to get payment URL. Please try again.');
          }
        },
        error: (error) => {
          this.processingPayment = false;
          console.error('Error creating checkout session:', error);
          const errorMessage =
            error?.error?.message || 'Failed to initiate payment. Please try again.';
          alert(errorMessage);
        },
      });
  }
}
