export interface Creator {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  verified: boolean;
}

export interface Video {
  id: string;
  url: string;
  thumbnailUrl: string;
  duration: number; // in seconds, < 90 as per app.md
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  creator: Creator;
  video: Video;
  createdAt: string;
}

export interface UserStats {
  userId: string;
  currentStreak: number;
  totalLessonsLearned: number;
  lastLessonDate?: string;
}
