import { Routes } from '@angular/router';
import { InstructorLayout } from './layout/instructor-layout/instructor-layout';
import { DashboardHome } from './pages/dashboard-home/dashboard-home';
import { MyCourses } from './pages/my-courses/my-courses';
import { AddCourse } from './pages/add-course/add-course';
import { EditCourse } from './pages/edit-course/edit-course';
import { Students } from './pages/students/students';
import { InstructorProfilePage } from './pages/profile/profile';

export const instructorDashboardRoutes: Routes = [
  {
    path: '',
    component: InstructorLayout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHome },
      { path: 'my-courses', component: MyCourses },
      { path: 'add-course', component: AddCourse },
      { path: 'edit-course/:id', component: EditCourse },
      { path: 'students', component: Students },
      { path: 'profile', component: InstructorProfilePage }
    ]
  }
];

