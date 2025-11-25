import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { InstructorCourse } from '../models/instructor-course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private mockCourses: InstructorCourse[] = [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn full-stack web development with modern technologies',
      category: 'Web Development',
      price: 99.99,
      level: 'beginner',
      imageUrl: '',
      videoUrl: 'https://example.com/video1',
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-10-05',
      enrolledStudents: 1250
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      description: 'Master advanced React patterns and best practices',
      category: 'Web Development',
      price: 79.99,
      level: 'advanced',
      imageUrl: '',
      videoUrl: 'https://example.com/video2',
      status: 'published',
      createdAt: '2024-02-20',
      updatedAt: '2024-09-28',
      enrolledStudents: 850
    },
    {
      id: '3',
      title: 'Python for Data Science',
      description: 'Comprehensive guide to data science with Python',
      category: 'Data Science',
      price: 149.99,
      level: 'intermediate',
      imageUrl: '',
      videoUrl: 'https://example.com/video3',
      status: 'draft',
      createdAt: '2024-10-01',
      updatedAt: '2024-10-12',
      enrolledStudents: 0
    },
    {
      id: '4',
      title: 'UI/UX Design Masterclass',
      description: 'Learn professional UI/UX design principles',
      category: 'Design',
      price: 129.99,
      level: 'intermediate',
      imageUrl: '',
      videoUrl: 'https://example.com/video4',
      status: 'published',
      createdAt: '2024-03-10',
      updatedAt: '2024-09-15',
      enrolledStudents: 2100
    },
    {
      id: '5',
      title: 'Mobile App Development with Flutter',
      description: 'Build cross-platform mobile apps with Flutter',
      category: 'Mobile Development',
      price: 89.99,
      level: 'beginner',
      imageUrl: '',
      videoUrl: 'https://example.com/video5',
      status: 'published',
      createdAt: '2024-04-05',
      updatedAt: '2024-08-20',
      enrolledStudents: 650
    }
  ];

  getAll(): Observable<InstructorCourse[]> {
    return of(this.mockCourses).pipe(delay(300));
  }

  getById(id: string): Observable<InstructorCourse | undefined> {
    const course = this.mockCourses.find(c => c.id === id);
    return of(course).pipe(delay(200));
  }

  create(course: Omit<InstructorCourse, 'id' | 'createdAt' | 'updatedAt' | 'enrolledStudents'>): Observable<InstructorCourse> {
    const newCourse: InstructorCourse = {
      ...course,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      enrolledStudents: 0
    };
    this.mockCourses.push(newCourse);
    return of(newCourse).pipe(delay(300));
  }

  update(id: string, course: Partial<InstructorCourse>): Observable<InstructorCourse> {
    const index = this.mockCourses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCourses[index] = {
        ...this.mockCourses[index],
        ...course,
        id,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return of(this.mockCourses[index]).pipe(delay(300));
    }
    return of(this.mockCourses[index]).pipe(delay(300));
  }

  delete(id: string): Observable<boolean> {
    const index = this.mockCourses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCourses.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}

