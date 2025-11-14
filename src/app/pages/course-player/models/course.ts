import { VideoItem } from './video-item';

export interface Course {
  id: string;
  title: string;
  description: string;
  videos: VideoItem[];
  instructor?: string;
  thumbnail?: string;
  category?: string;
}

