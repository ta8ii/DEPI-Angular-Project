import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './add-course.html',
  styleUrl: './add-course.css'
})
export class AddCourse {
  courseForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private router: Router
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

  onSubmit() {
    if (this.courseForm.valid) {
      this.submitting = true;
      this.coursesService.create(this.courseForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/my-courses']);
        },
        error: () => {
          this.submitting = false;
          alert('Error creating course. Please try again.');
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

