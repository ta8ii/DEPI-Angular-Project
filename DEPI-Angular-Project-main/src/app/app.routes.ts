import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { PageNotFound } from './pages/page-not-found/page-not-found';
import { LogIn } from './pages/log-in/log-in';
import { CoursesList } from './pages/courses-list/courses-list';
import { SignUp } from './pages/sign-up/sign-up';
import { CoursesDeatils } from './pages/courses-list/courses-deatils/courses-deatils';
import { Payment } from './pages/payment/payment';
import { CoursePlayerPage } from './pages/course-player/course-player';
import { EnrollmentSuccess } from './pages/enrollments/success';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { courseAccessGuard } from './guards/course-access.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home, title: 'Home' },
  { path: 'login', component: LogIn, title: 'Login' },
  { path: 'courses', component: CoursesList, title: 'Courses' },
  { path: 'courses/:id', component: CoursesDeatils, title: 'Courses' },
  {
    path: 'course/:id/player',
    component: CoursePlayerPage,
    canActivate: [courseAccessGuard],
    title: 'Course Player',
  },
  {
    path: 'payment/:id',
    component: Payment,
    canActivate: [authGuard],
    title: 'Payment',
  },
  {
    path: 'enrollments/success',
    component: EnrollmentSuccess,
    title: 'Enrollment Success',
  },
  { path: 'sign-up', component: SignUp, title: 'Sign-Up' },

  // Student Routes
  {
    path: 'student',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['student'] },
    loadChildren: () => import('./student/student.routes').then((m) => m.studentRoutes),
    title: 'Student Dashboard',
  },

  // Instructor Routes (using existing dashboard)
  {
    path: 'instructor',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['instructor'] },
    loadChildren: () =>
      import('./instructor-dashboard/instructor-dashboard.routes').then(
        (m) => m.instructorDashboardRoutes
      ),
    title: 'Instructor Dashboard',
  },

  // Legacy dashboard route (redirects to instructor)
  {
    path: 'dashboard',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['instructor'] },
    loadChildren: () =>
      import('./instructor-dashboard/instructor-dashboard.routes').then(
        (m) => m.instructorDashboardRoutes
      ),
    title: 'Instructor Dashboard',
  },

  { path: '**', component: PageNotFound },
];
