import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsService } from '../../services/students.service';
import { InstructorStudent } from '../../models/instructor-student';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.html',
  styleUrl: './students.css'
})
export class Students implements OnInit {
  students: InstructorStudent[] = [];
  filteredStudents: InstructorStudent[] = [];
  loading = true;
  searchTerm = '';
  selectedCourse = 'all';

  constructor(private studentsService: StudentsService) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.loading = true;
    this.studentsService.getAll().subscribe({
      next: (students) => {
        this.students = students;
        this.filteredStudents = students;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onCourseFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredStudents = this.students.filter(student => {
      const matchesSearch = !this.searchTerm || 
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.enrolledCourseName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCourse = this.selectedCourse === 'all' || 
        student.enrolledCourseId === this.selectedCourse;
      
      return matchesSearch && matchesCourse;
    });
  }

  getUniqueCourses(): string[] {
    const courses = this.students.map(s => s.enrolledCourseId);
    return Array.from(new Set(courses));
  }

  getCourseName(courseId: string): string {
    const student = this.students.find(s => s.enrolledCourseId === courseId);
    return student?.enrolledCourseName || courseId;
  }
}

