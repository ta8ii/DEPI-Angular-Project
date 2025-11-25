import { Routes } from '@angular/router';
import { StudentHomePage } from './pages/home/home';
import { StudentMyCoursesPage } from './pages/my-courses/my-courses';
import { StudentProfilePage } from './pages/profile/profile';
import { CoursePlayerPage } from '../pages/course-player/course-player';
import { courseAccessGuard } from '../guards/course-access.guard';

export const studentRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: StudentHomePage },
  { path: 'my-courses', component: StudentMyCoursesPage },
  { path: 'profile', component: StudentProfilePage },
  { 
    path: 'course/:id', 
    component: CoursePlayerPage,
    canActivate: [courseAccessGuard]
  }
];

