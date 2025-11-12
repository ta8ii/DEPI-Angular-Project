import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { PageNotFound } from './pages/page-not-found/page-not-found';
import { LogIn } from './pages/log-in/log-in';
import { CoursesList } from './pages/courses-list/courses-list';
import { SignUp } from './pages/sign-up/sign-up';
import { CoursesDeatils } from './pages/courses-list/courses-deatils/courses-deatils';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home, title:"Home" },
  { path: 'login', component: LogIn, title:"Login" },
  { path: 'courses', component: CoursesList, title:"Courses"},
  { path: 'courses/:id', component: CoursesDeatils,title:"Courses" },
  { path: 'sign-up', component: SignUp, title:"Sign-Up" },

  { path: '**', component: PageNotFound },
];

