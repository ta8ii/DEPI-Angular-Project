export interface InstructorCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  imageUrl?: string;
  videoUrl?: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  enrolledStudents: number;
}

