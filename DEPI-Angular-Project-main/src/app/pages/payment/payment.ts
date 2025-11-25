import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CourseAccessService } from '../../services/course-access.service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payment implements OnInit {
  paymentForm: FormGroup;
  courseId: string | null = null;
  courseTitle = 'Complete Web Development Bootcamp';
  coursePrice = 89.99;
  originalPrice = 129.99;
  submitting = false;

  paymentMethods = [
    { id: 'credit', name: 'Credit Card', icon: 'fa-credit-card' },
    { id: 'paypal', name: 'PayPal', icon: 'fa-paypal' },
    { id: 'bank', name: 'Bank Transfer', icon: 'fa-university' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private courseAccessService: CourseAccessService,
    private authService: AuthService
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['credit', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardHolder: ['', [Validators.required, Validators.minLength(3)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      agreeToTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
    
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/payment/${this.courseId}` }
      });
      return;
    }
    
    // Pre-fill email from logged in user
    const user = this.authService.getUser();
    if (user) {
      this.paymentForm.patchValue({
        email: user.email
      });
    }
  }

  onPaymentMethodChange() {
    const method = this.paymentForm.get('paymentMethod')?.value;
    if (method === 'credit') {
      this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
      this.paymentForm.get('cardHolder')?.setValidators([Validators.required, Validators.minLength(3)]);
      this.paymentForm.get('expiryDate')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
    } else {
      this.paymentForm.get('cardNumber')?.clearValidators();
      this.paymentForm.get('cardHolder')?.clearValidators();
      this.paymentForm.get('expiryDate')?.clearValidators();
      this.paymentForm.get('cvv')?.clearValidators();
    }
    this.paymentForm.get('cardNumber')?.updateValueAndValidity();
    this.paymentForm.get('cardHolder')?.updateValueAndValidity();
    this.paymentForm.get('expiryDate')?.updateValueAndValidity();
    this.paymentForm.get('cvv')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.paymentForm.valid && this.courseId) {
      this.submitting = true;
      // Simulate payment processing
      setTimeout(() => {
        // Mark course as purchased
        this.courseAccessService.markCourseAsPurchased(this.courseId!);
        
        this.submitting = false;
        alert('Payment successful! You now have access to this course.');
        
        // Redirect to course player
        this.router.navigate(['/course', this.courseId, 'player']);
      }, 2000);
    } else {
      Object.keys(this.paymentForm.controls).forEach(key => {
        this.paymentForm.get(key)?.markAsTouched();
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.paymentForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('pattern')) {
      return `Invalid ${fieldName} format`;
    }
    if (field?.hasError('email')) {
      return 'Invalid email address';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} is too short`;
    }
    return '';
  }
}

