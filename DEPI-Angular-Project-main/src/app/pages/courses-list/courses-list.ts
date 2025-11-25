import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: any;
  category: string[];
  price?: number;
  rating: any[];
  enrolledStudents: any[];
  thumbnail?: string;
}

type SortOption = 'popular' | 'newest' | 'rating' | 'price-low' | 'price-high';

@Component({
  selector: 'app-courses-list',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './courses-list.html',
  styleUrl: './courses-list.css',
})
export class CoursesList implements OnInit {
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  loading = true;
  showFilters = false;
  private apiUrl = 'http://localhost:3000';

  // Search and Filter Properties
  searchQuery = '';
  selectedCategories: Set<string> = new Set();
  selectedRatingFilter: string = 'all';
  sortBy: SortOption = 'popular';

  // Available filters
  categories: string[] = [];
  ratingOptions = [
    { label: 'All Ratings', value: 'all' },
    { label: '4.5+ Stars', value: '4.5' },
    { label: '4+ Stars', value: '4' },
    { label: '3+ Stars', value: '3' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCourses();
  }

  fetchCourses() {
    this.http.get<Course[]>(`${this.apiUrl}/courses`).subscribe({
      next: (data) => {
        this.allCourses = data;
        this.extractCategories();
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  extractCategories() {
    const categorySet = new Set<string>();
    this.allCourses.forEach((course) => {
      if (course.category && Array.isArray(course.category)) {
        course.category.forEach((cat) => categorySet.add(cat));
      }
    });
    this.categories = Array.from(categorySet).sort();
  }

  applyFilters() {
    let filtered = [...this.allCourses];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          this.getInstructorName(course).toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (this.selectedCategories.size > 0) {
      filtered = filtered.filter((course) =>
        course.category?.some((cat) => this.selectedCategories.has(cat))
      );
    }

    // Apply rating filter
    if (this.selectedRatingFilter !== 'all') {
      const minRating = parseFloat(this.selectedRatingFilter);
      filtered = filtered.filter((course) => this.getRating(course) >= minRating);
    }

    // Apply sorting
    filtered = this.sortCourses(filtered);

    this.filteredCourses = filtered;
  }

  sortCourses(courses: Course[]): Course[] {
    const sorted = [...courses];
    switch (this.sortBy) {
      case 'newest':
        return sorted.reverse();
      case 'rating':
        return sorted.sort((a, b) => this.getRating(b) - this.getRating(a));
      case 'price-low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'popular':
      default:
        return sorted.sort((a, b) => this.getStudents(b) - this.getStudents(a));
    }
  }

  onSearchChange() {
    this.applyFilters();
  }

  onSortChange(sort: SortOption) {
    this.sortBy = sort;
    this.applyFilters();
  }

  toggleCategory(category: string) {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }
    this.applyFilters();
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.has(category);
  }

  onRatingFilterChange(rating: string) {
    this.selectedRatingFilter = rating;
    this.applyFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategories.clear();
    this.selectedRatingFilter = 'all';
    this.sortBy = 'popular';
    this.applyFilters();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  getCourseId(course: Course): string {
    return course._id || '';
  }

  getInstructorName(course: Course): string {
    return course.instructor?.username || course.instructor?.email || 'Unknown Instructor';
  }

  getCategory(course: Course): string {
    return course.category?.[0] || 'General';
  }

  getRating(course: Course): number {
    if (!course.rating || course.rating.length === 0) return 0;
    const sum = course.rating.reduce((acc: number, r: any) => acc + (r.score || 0), 0);
    return Math.round((sum / course.rating.length) * 10) / 10;
  }

  getStudents(course: Course): number {
    return course.enrolledStudents?.length || 0;
  }
}
