import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css'
})
export class DashboardHome implements OnInit {
  statistics = {
    totalStudents: 0,
    totalCourses: 0,
    revenue: 0,
    newEnrollments: 0
  };

  constructor(private instructorService: InstructorService) {}

  ngOnInit() {
    this.instructorService.getStatistics().subscribe(stats => {
      this.statistics = stats;
    });
  }
}

