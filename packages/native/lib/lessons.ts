import type { CategoryId } from './categories';

export type Lesson = {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string | null;
  thumbUrl: string | null;
  creator: {
    handle: string;
    displayName: string;
    avatarUrl: string | null;
  };
  category: {
    slug: string;
    name: string;
  };
  counts: {
    likes: number;
    comments: number;
    saves: number;
  };
  bgIndex: number;
};

export const VIDEO_BG = [
  require('../assets/images/s-1.jpg'),
  require('../assets/images/s-2.jpg'),
  require('../assets/images/s-3.jpg'),
];

type Seed = {
  categoryId: CategoryId;
  handle: string;
  displayName: string;
  title: string;
  description: string;
  likes: number;
  comments: number;
  saves: number;
};

const SEED: Seed[] = [
  {
    categoryId: 'sains',
    handle: '@maya.sains',
    displayName: 'Maya Sains',
    title: 'Kenapa langit jadi merah saat senja?',
    description: 'Cahaya matahari yang dipantulkan partikel atmosfer.',
    likes: 12400,
    comments: 284,
    saves: 1100,
  },
  {
    categoryId: 'finansial',
    handle: '@budi.duit',
    displayName: 'Budi Duit',
    title: 'Cara kerja inflasi, dalam 60 detik.',
    description: 'Bukan harga yang naik, tapi nilai uangmu yang turun.',
    likes: 8900,
    comments: 152,
    saves: 742,
  },
  {
    categoryId: 'sejarah',
    handle: '@rizki.history',
    displayName: 'Rizki Sejarah',
    title: 'Kenapa Borobudur dibangun setinggi itu?',
    description: 'Ada tujuan kosmologis di balik 9 tingkat candi.',
    likes: 21200,
    comments: 512,
    saves: 3400,
  },
  {
    categoryId: 'koding',
    handle: '@dev.indo',
    displayName: 'Dev Indo',
    title: 'Apa itu hash table, tanpa jargon.',
    description: 'Bayangin lemari laci raksasa, tiap laci punya label.',
    likes: 5600,
    comments: 98,
    saves: 480,
  },
  {
    categoryId: 'bahasa',
    handle: '@bahasa.cepat',
    displayName: 'Bahasa Cepat',
    title: 'Kenapa "kau" dan "kamu" beda rasa?',
    description: 'Pronoun kedua dalam Bahasa menandai jarak sosial.',
    likes: 3200,
    comments: 76,
    saves: 210,
  },
];

const CATEGORY_LABELS: Record<CategoryId, string> = {
  sains: 'Sains',
  sejarah: 'Sejarah',
  koding: 'Koding',
  finansial: 'Finansial',
  bahasa: 'Bahasa',
  seni: 'Seni',
  kesehatan: 'Kesehatan',
  bisnis: 'Bisnis',
};

function buildMock(seed: Seed, id: string, bgIndex: number): Lesson {
  return {
    id,
    title: seed.title,
    description: seed.description,
    duration: 60_000,
    videoUrl: null,
    thumbUrl: null,
    creator: {
      handle: seed.handle,
      displayName: seed.displayName,
      avatarUrl: null,
    },
    category: {
      slug: seed.categoryId,
      name: CATEGORY_LABELS[seed.categoryId] ?? seed.categoryId,
    },
    counts: {
      likes: seed.likes,
      comments: seed.comments,
      saves: seed.saves,
    },
    bgIndex,
  };
}

export function makeFeedBatch(start: number, count: number): Lesson[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = start + i;
    const base = SEED[idx % SEED.length];
    return buildMock(base, `lesson-${idx}`, idx % VIDEO_BG.length);
  });
}

export function makeTopicBatch(categoryId: string): Lesson[] {
  const filtered = SEED.filter((s) => s.categoryId === categoryId);
  return filtered.map((base, i) =>
    buildMock(base, `topic-${categoryId}-${i}`, i % VIDEO_BG.length),
  );
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
