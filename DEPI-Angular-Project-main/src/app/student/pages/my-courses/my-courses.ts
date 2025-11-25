import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-my-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css',
})
export class StudentMyCoursesPage implements OnInit {
  enrolledCourses: any[] = [];
  loading = true;
  error: string | null = null;
  navigatingCourseId: string | null = null;

  constructor(private studentService: StudentService, private router: Router) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.error = null;
    this.studentService.getEnrolledCourses().subscribe({
      next: (courses) => {
        // Map courses to include required fields
        this.enrolledCourses = (courses || []).map((course: any) => ({
          id: course._id || course.id,
          title: course.title || 'Untitled Course',
          progress: course.progress || 0,
          thumbnail: course.thumbnail || '',
          description: course.description || '',
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.error = 'Failed to load your courses. Please try again.';
        this.loading = false;
      },
    });
  }

  continueCourse(courseId: string) {
    this.navigatingCourseId = courseId;
    this.router.navigate(['/student/course', courseId]);
  }
}
