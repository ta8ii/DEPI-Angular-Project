import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { InstructorStudent } from '../models/instructor-student';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private mockStudents: InstructorStudent[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      enrolledCourseId: '1',
      enrolledCourseName: 'Complete Web Development Bootcamp',
      progress: 75,
      enrolledDate: '2024-09-01'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      enrolledCourseId: '1',
      enrolledCourseName: 'Complete Web Development Bootcamp',
      progress: 45,
      enrolledDate: '2024-09-15'
    },
    {
      id: '3',
      name: 'Carol Williams',
      email: 'carol.williams@example.com',
      enrolledCourseId: '2',
      enrolledCourseName: 'Advanced React Patterns',
      progress: 90,
      enrolledDate: '2024-08-20'
    },
    {
      id: '4',
      name: 'David Brown',
      email: 'david.brown@example.com',
      enrolledCourseId: '4',
      enrolledCourseName: 'UI/UX Design Masterclass',
      progress: 30,
      enrolledDate: '2024-10-01'
    },
    {
      id: '5',
      name: 'Emma Davis',
      email: 'emma.davis@example.com',
      enrolledCourseId: '4',
      enrolledCourseName: 'UI/UX Design Masterclass',
      progress: 100,
      enrolledDate: '2024-09-10'
    },
    {
      id: '6',
      name: 'Frank Miller',
      email: 'frank.miller@example.com',
      enrolledCourseId: '5',
      enrolledCourseName: 'Mobile App Development with Flutter',
      progress: 60,
      enrolledDate: '2024-09-25'
    },
    {
      id: '7',
      name: 'Grace Wilson',
      email: 'grace.wilson@example.com',
      enrolledCourseId: '2',
      enrolledCourseName: 'Advanced React Patterns',
      progress: 25,
      enrolledDate: '2024-10-05'
    },
    {
      id: '8',
      name: 'Henry Moore',
      email: 'henry.moore@example.com',
      enrolledCourseId: '1',
      enrolledCourseName: 'Complete Web Development Bootcamp',
      progress: 85,
      enrolledDate: '2024-08-15'
    }
  ];

  getAll(): Observable<InstructorStudent[]> {
    return of(this.mockStudents).pipe(delay(300));
  }

  getById(id: string): Observable<InstructorStudent | undefined> {
    const student = this.mockStudents.find(s => s.id === id);
    return of(student).pipe(delay(200));
  }

  getByCourseId(courseId: string): Observable<InstructorStudent[]> {
    const students = this.mockStudents.filter(s => s.enrolledCourseId === courseId);
    return of(students).pipe(delay(200));
  }

  create(student: Omit<InstructorStudent, 'id'>): Observable<InstructorStudent> {
    const newStudent: InstructorStudent = {
      ...student,
      id: Date.now().toString()
    };
    this.mockStudents.push(newStudent);
    return of(newStudent).pipe(delay(300));
  }

  update(id: string, student: Partial<InstructorStudent>): Observable<InstructorStudent> {
    const index = this.mockStudents.findIndex(s => s.id === id);
    if (index !== -1) {
      this.mockStudents[index] = {
        ...this.mockStudents[index],
        ...student,
        id
      };
      return of(this.mockStudents[index]).pipe(delay(300));
    }
    return of(this.mockStudents[index]).pipe(delay(300));
  }

  delete(id: string): Observable<boolean> {
    const index = this.mockStudents.findIndex(s => s.id === id);
    if (index !== -1) {
      this.mockStudents.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}

