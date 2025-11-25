export interface StudentProfile {
  id: string;
  username?: string;
  email: string;
  name?: string;
  imgUrl?: string;
  avatar?: string;
  bio?: string;
  role?: string;
  enrolledCourses?: {
    id?: string;
    _id?: string;
    title: string;
    thumbnail?: string;
    progress?: number;
  }[];
}
