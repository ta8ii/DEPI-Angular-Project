import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseAccessService } from '../../../services/course-access.service';
import { AuthService } from '../../../services/auth';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-courses-deatils',
  imports: [RouterLink, CommonModule],
  templateUrl: './courses-deatils.html',
  styleUrl: './courses-deatils.css'
})
export class CoursesDeatils implements OnInit, OnDestroy {
  courseId: string | null = null;
  isLoggedIn = false;
  hasPurchased = false;
  private routerSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseAccessService: CourseAccessService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.checkAccess();
    
    // Listen to route changes to update access status
    this.route.params.subscribe(() => {
      this.courseId = this.route.snapshot.paramMap.get('id');
      this.checkAccess();
    });

    // Listen to navigation events to refresh access status when returning from payment
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAccess();
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  checkAccess() {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    if (this.isLoggedIn && this.courseId) {
      this.hasPurchased = this.courseAccessService.hasPurchasedCourse(this.courseId);
    } else {
      this.hasPurchased = false;
    }
  }

  onStartLearning() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/course/${this.courseId}/player` }
      });
    } else if (!this.hasPurchased) {
      this.router.navigate(['/payment', this.courseId]);
    } else {
      this.router.navigate(['/course', this.courseId, 'player']);
    }
  }
}
