import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { InstructorCourse } from '../../models/instructor-course';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit-course.html',
  styleUrl: './edit-course.css'
})
export class EditCourse implements OnInit {
  courseForm: FormGroup;
  submitting = false;
  loading = true;
  courseId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      level: ['beginner', Validators.required],
      imageUrl: [''],
      videoUrl: ['', Validators.required],
      status: ['draft', Validators.required]
    });
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.loadCourse();
    }
  }

  loadCourse() {
    if (!this.courseId) return;
    
    this.loading = true;
    this.coursesService.getById(this.courseId).subscribe({
      next: (course) => {
        if (course) {
          this.courseForm.patchValue(course);
          this.loading = false;
        } else {
          this.router.navigate(['/dashboard/my-courses']);
        }
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/my-courses']);
      }
    });
  }

  onSubmit() {
    if (this.courseForm.valid && this.courseId) {
      this.submitting = true;
      this.coursesService.update(this.courseId, this.courseForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/my-courses']);
        },
        error: () => {
          this.submitting = false;
          alert('Error updating course. Please try again.');
        }
      });
    } else {
      Object.keys(this.courseForm.controls).forEach(key => {
        this.courseForm.get(key)?.markAsTouched();
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.courseForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} is too short`;
    }
    if (field?.hasError('min')) {
      return `${fieldName} must be positive`;
    }
    return '';
  }
}

