export interface InstructorProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar?: string;
  skills: string[];
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
}

