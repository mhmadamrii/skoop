import { Lesson, Creator } from './types';

export const MOCK_CREATORS: Creator[] = [
  {
    id: 'c1',
    name: 'Dr. Science',
    verified: true,
    bio: 'Making physics feel like magic.'
  },
  {
    id: 'c2',
    name: 'Polyglot Paul',
    verified: false,
    bio: 'Learn 5 languages in 90-second chunks.'
  }
];

export const MOCK_LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Why is the sky blue?',
    description: 'Rayleigh scattering explained in under a minute.',
    category: 'Science',
    creator: MOCK_CREATORS[0],
    video: {
      id: 'v1',
      url: 'https://example.com/video1.mp4',
      thumbnailUrl: 'https://example.com/thumb1.jpg',
      duration: 55
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'l2',
    title: 'Japanese for Coffee Shops',
    description: 'Order your first latte in Tokyo.',
    category: 'Languages',
    creator: MOCK_CREATORS[1],
    video: {
      id: 'v2',
      url: 'https://example.com/video2.mp4',
      thumbnailUrl: 'https://example.com/thumb2.jpg',
      duration: 82
    },
    createdAt: new Date().toISOString()
  }
];
