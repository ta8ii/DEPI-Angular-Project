import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InstructorService } from '../../services/instructor.service';
import { InstructorProfile as InstructorProfileModel } from '../../models/instructor-profile';

@Component({
  selector: 'app-instructor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class InstructorProfilePage implements OnInit {
  profile: InstructorProfileModel | null = null;
  profileForm: FormGroup;
  loading = true;
  editing = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private instructorService: InstructorService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.required, Validators.minLength(20)]],
      skills: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.instructorService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
          skills: profile.skills.join(', ')
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
        skills: this.profile.skills.join(', ')
      });
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.submitting = true;
      const formValue = this.profileForm.value;
      const updatedProfile = {
        ...formValue,
        skills: formValue.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s)
      };

      this.instructorService.updateProfile(updatedProfile).subscribe({
        next: (profile) => {
          this.profile = profile;
          this.editing = false;
          this.submitting = false;
        },
        error: () => {
          this.submitting = false;
          alert('Error updating profile. Please try again.');
        }
      });
    }
  }
}

