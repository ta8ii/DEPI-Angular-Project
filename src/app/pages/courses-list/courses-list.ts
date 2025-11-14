import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  selector: 'app-courses-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './courses-list.html',
  styleUrl: './courses-list.css'
})
export class CoursesList {
  courses: Course[] = [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and build amazing web applications from scratch.',
      instructor: 'John Smith',
      category: 'Programming',
      level: 'beginner',
      rating: 4.9,
      students: 2847,
      hours: 40
    },
    {
      id: '2',
      title: 'Data Science & Machine Learning',
      description: 'Master Python, statistics, machine learning algorithms and data visualization techniques.',
      instructor: 'Sarah Johnson',
      category: 'Data Science',
      level: 'intermediate',
      rating: 4.7,
      students: 1523,
      hours: 35
    },
    {
      id: '3',
      title: 'UI/UX Design Masterclass',
      description: 'Create beautiful and functional user interfaces with modern design principles and tools.',
      instructor: 'Mike Chen',
      category: 'Design',
      level: 'beginner',
      rating: 4.8,
      students: 3156,
      hours: 30
    },
    {
      id: '4',
      title: 'React Native Development',
      description: 'Build cross-platform mobile apps with React Native and modern development practices.',
      instructor: 'Alex Rodriguez',
      category: 'Mobile',
      level: 'intermediate',
      rating: 4.6,
      students: 1892,
      hours: 25
    },
    {
      id: '5',
      title: 'Digital Marketing Strategies',
      description: 'Learn SEO, social media marketing, content strategy and digital advertising techniques.',
      instructor: 'Emma Wilson',
      category: 'Marketing',
      level: 'beginner',
      rating: 4.9,
      students: 2341,
      hours: 20
    },
    {
      id: '6',
      title: 'Professional Photography',
      description: 'Master camera techniques, composition, lighting and post-processing for stunning photos.',
      instructor: 'David Kim',
      category: 'Photography',
      level: 'beginner',
      rating: 4.7,
      students: 1678,
      hours: 15
    }
  ];
}
