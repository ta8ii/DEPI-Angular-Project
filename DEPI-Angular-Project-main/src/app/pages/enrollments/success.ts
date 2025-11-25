import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-enrollment-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="enrollment-container">
      <div class="loading-state">
        <div class="spinner"></div>
        <p>{{ message }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .enrollment-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .loading-state {
        text-align: center;
        background: white;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }

      .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      p {
        color: #6b7280;
        font-size: 16px;
        margin: 0;
      }
    `,
  ],
})
export class EnrollmentSuccess implements OnInit {
  private apiUrl = 'http://localhost:3000';
  message = 'Processing your enrollment...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.verifyEnrollment();
  }

  private verifyEnrollment() {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (!sessionId) {
      this.message = 'Invalid session. Redirecting...';
      setTimeout(() => this.router.navigate(['/courses']), 2000);
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/enrollments/success?session_id=${sessionId}` },
      });
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .post<{ status: string }>(
        `${this.apiUrl}/enrollments/verify?session_id=${sessionId}`,
        {},
        { headers }
      )
      .subscribe({
        next: () => {
          this.message = 'Enrollment successful! Redirecting...';
          setTimeout(() => this.router.navigate(['/student/my-courses']), 1500);
        },
        error: () => {
          this.message = 'Error processing enrollment. Redirecting...';
          setTimeout(() => this.router.navigate(['/courses']), 2000);
        },
      });
  }
}
