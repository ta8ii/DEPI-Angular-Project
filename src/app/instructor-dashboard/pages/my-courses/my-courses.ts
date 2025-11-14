import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { InstructorCourse } from '../../models/instructor-course';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css'
})
export class MyCourses implements OnInit {
  courses: InstructorCourse[] = [];
  loading = true;

  constructor(private coursesService: CoursesService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.coursesService.getAll().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteCourse(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.coursesService.delete(id).subscribe({
        next: () => {
          this.loadCourses();
        }
      });
    }
  }

  getGradientClass(index: number): string {
    const gradients = ['gradient-1', 'gradient-2', 'gradient-3', 'gradient-4', 'gradient-5'];
    return gradients[index % gradients.length];
  }
}

