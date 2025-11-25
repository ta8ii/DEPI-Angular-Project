import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { StudentProfile } from '../../models/student-profile';

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class StudentHomePage implements OnInit {
  enrolledCourses: NonNullable<StudentProfile['enrolledCourses']> = [];
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
      },
    });
  }
}
