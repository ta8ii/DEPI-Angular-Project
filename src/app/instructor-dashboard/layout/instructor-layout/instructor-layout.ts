import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InstructorSidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructor-layout',
  standalone: true,
  imports: [RouterOutlet, InstructorSidebar, CommonModule],
  templateUrl: './instructor-layout.html',
  styleUrl: './instructor-layout.css'
})
export class InstructorLayout {
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}

