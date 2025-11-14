import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { StudentProfile } from '../../models/student-profile';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class StudentProfilePage implements OnInit {
  profile: StudentProfile | null = null;
  profileForm: FormGroup;
  loading = true;
  editing = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.maxLength(500)]],
      avatar: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.studentService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
          avatar: profile.avatar
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleEdit() {
    this.editing = !this.editing;
    if (!this.editing && this.profile) {
      this.profileForm.patchValue({
        name: this.profile.name,
        email: this.profile.email,
        bio: this.profile.bio,
        avatar: this.profile.avatar
      });
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.submitting = true;
      this.studentService.updateProfile(this.profileForm.value).subscribe({
        next: (profile) => {
          this.profile = profile;
          this.editing = false;
          this.submitting = false;
          // Show success message
          alert('Profile updated successfully! ✅');
          // Reload profile to get latest data
          this.loadProfile();
        },
        error: () => {
          this.submitting = false;
          alert('Error updating profile. Please try again.');
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('email')) {
      return 'Invalid email address';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} is too short`;
    }
    if (field?.hasError('maxlength')) {
      return `${fieldName} is too long`;
    }
    return '';
  }

  getTotalProgress(): number {
    if (!this.profile || !this.profile.enrolledCourses || this.profile.enrolledCourses.length === 0) return 0;
    const total = this.profile.enrolledCourses.reduce((sum, course) => sum + course.progress, 0);
    return Math.round(total / this.profile.enrolledCourses.length);
  }

  getCompletedCoursesCount(): number {
    if (!this.profile || !this.profile.enrolledCourses) return 0;
    return this.profile.enrolledCourses.filter(c => c.progress === 100).length;
  }

  getAvatarStyle(): string {
    if (this.profile?.avatar) {
      return `url(${this.profile.avatar})`;
    }
    return 'none';
  }
}

