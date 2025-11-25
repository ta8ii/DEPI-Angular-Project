import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { StudentProfile } from '../../models/student-profile';
import { AuthService } from '../../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class StudentProfilePage implements OnInit {
  profile: StudentProfile | null = null;
  profileForm: FormGroup;
  loading = true;
  editing = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.maxLength(500)]],
      avatar: [''],
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
        const name = profile.name || profile.username || '';
        const avatar = profile.avatar || profile.imgUrl || '';
        this.profileForm.patchValue({
          name: name,
          email: profile.email,
          bio: profile.bio || '',
          avatar: avatar,
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading = false;
      },
    });
  }

  toggleEdit() {
    this.editing = !this.editing;
    if (!this.editing && this.profile) {
      const name = this.profile.name || this.profile.username || '';
      const avatar = this.profile.avatar || this.profile.imgUrl || '';
      this.profileForm.patchValue({
        name: name,
        email: this.profile.email,
        bio: this.profile.bio || '',
        avatar: avatar,
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

          // Update auth service with new user data
          const user = this.authService.getUser();
          if (user) {
            const updatedUser = {
              ...user,
              name: this.profileForm.value.name || user.name,
              email: this.profileForm.value.email || user.email,
              avatar: this.profileForm.value.avatar || user.avatar,
            };
            this.authService.saveUser(updatedUser);
          }

          Swal.fire({
            title: 'Profile Updated',
            text: 'Your profile has been updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        error: (error) => {
          this.submitting = false;
          console.error('Error updating profile:', error);
          Swal.fire({
            title: 'Error',
            text: error?.error?.message || 'Failed to update profile. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.profileForm.controls).forEach((key) => {
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
    if (!this.profile || !this.profile.enrolledCourses || this.profile.enrolledCourses.length === 0)
      return 0;
    const total = this.profile.enrolledCourses.reduce(
      (sum, course) => sum + (course.progress || 0),
      0
    );
    return Math.round(total / this.profile.enrolledCourses.length);
  }

  getCompletedCoursesCount(): number {
    if (!this.profile || !this.profile.enrolledCourses) return 0;
    return this.profile.enrolledCourses.filter((c) => (c.progress || 0) === 100).length;
  }

  getAvatarStyle(): string {
    const avatar = this.profile?.avatar || this.profile?.imgUrl;
    if (avatar) {
      return `url(${avatar})`;
    }
    return 'none';
  }
}
