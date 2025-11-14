import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  rating: number;
  students: number;
  hours: number;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  featuredCourses: Course[] = [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and build amazing web applications from scratch.',
      instructor: 'Sarah Johnson',
      category: 'Programming',
      level: 'beginner',
      rating: 4.8,
      students: 12450,
      hours: 40
    },
    {
      id: '2',
      title: 'Business Strategy Fundamentals',
      description: 'Master business strategy, market analysis, and competitive positioning.',
      instructor: 'Michael Chen',
      category: 'Business',
      level: 'intermediate',
      rating: 4.9,
      students: 8920,
      hours: 25
    },
    {
      id: '3',
      title: 'UI/UX Design Masterclass',
      description: 'Create beautiful and functional user interfaces with modern design principles.',
      instructor: 'Emily Rodriguez',
      category: 'Design',
      level: 'beginner',
      rating: 4.7,
      students: 15680,
      hours: 35
    }
  ];
}
