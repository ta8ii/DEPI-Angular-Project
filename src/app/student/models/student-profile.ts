export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  enrolledCourses: {
    id: string;
    title: string;
    thumbnail: string;
    progress: number;
  }[];
}

