import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-my-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css'
})
export class StudentMyCoursesPage implements OnInit {
  enrolledCourses: any[] = [];
  loading = true;

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.studentService.getEnrolledCourses().subscribe({
      next: (courses) => {
        this.enrolledCourses = courses;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}

