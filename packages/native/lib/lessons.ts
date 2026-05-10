import type { CategoryId } from './categories';

export type Lesson = {
  id: string;
  categoryId: CategoryId;
  creator: string;
  title: string;
  description: string;
  likes: string;
  comments: string;
  saves: string;
  bgIndex: number;
};

export const VIDEO_BG = [
  require('../assets/images/s-1.jpg'),
  require('../assets/images/s-2.jpg'),
  require('../assets/images/s-3.jpg'),
];

const SEED: Omit<Lesson, 'id' | 'bgIndex'>[] = [
  {
    categoryId: 'sains',
    creator: '@maya.sains',
    title: 'Kenapa langit jadi merah saat senja?',
    description: 'Cahaya matahari yang dipantulkan partikel atmosfer.',
    likes: '12.4K',
    comments: '284',
    saves: '1.1K',
  },
  {
    categoryId: 'finansial',
    creator: '@budi.duit',
    title: 'Cara kerja inflasi, dalam 60 detik.',
    description: 'Bukan harga yang naik, tapi nilai uangmu yang turun.',
    likes: '8.9K',
    comments: '152',
    saves: '742',
  },
  {
    categoryId: 'sejarah',
    creator: '@rizki.history',
    title: 'Kenapa Borobudur dibangun setinggi itu?',
    description: 'Ada tujuan kosmologis di balik 9 tingkat candi.',
    likes: '21.2K',
    comments: '512',
    saves: '3.4K',
  },
  {
    categoryId: 'koding',
    creator: '@dev.indo',
    title: 'Apa itu hash table, tanpa jargon.',
    description: 'Bayangin lemari laci raksasa, tiap laci punya label.',
    likes: '5.6K',
    comments: '98',
    saves: '480',
  },
  {
    categoryId: 'bahasa',
    creator: '@bahasa.cepat',
    title: 'Kenapa "kau" dan "kamu" beda rasa?',
    description: 'Pronoun kedua dalam Bahasa menandai jarak sosial.',
    likes: '3.2K',
    comments: '76',
    saves: '210',
  },
];

export function makeFeedBatch(start: number, count: number): Lesson[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = start + i;
    const base = SEED[idx % SEED.length];
    return {
      ...base,
      id: `lesson-${idx}`,
      bgIndex: idx % VIDEO_BG.length,
    };
  });
}

export function makeTopicBatch(categoryId: string): Lesson[] {
  const filtered = SEED.filter((s) => s.categoryId === categoryId);
  return filtered.map((base, i) => ({
    ...base,
    id: `topic-${categoryId}-${i}`,
    bgIndex: i % VIDEO_BG.length,
  }));
}
