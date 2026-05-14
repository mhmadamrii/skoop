import prisma from '@skoop/db';
import { z } from 'zod';

import { protectedProcedure, publicProcedure, router } from '../index';
import { signDownloadUrl } from '../lib/s3';

const FEED_PAGE_SIZE = 10;
const FEED_PAGE_MAX = 20;

const CATEGORY_NAMES: Record<string, string> = {
  sains: 'Sains',
  sejarah: 'Sejarah',
  koding: 'Koding',
  finansial: 'Finansial',
  bahasa: 'Bahasa',
  seni: 'Seni',
  kesehatan: 'Kesehatan',
  bisnis: 'Bisnis',
};

function slugifyHandle(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9_.]/g, '')
      .slice(0, 24) || 'creator'
  );
}

async function ensureCreator(
  userId: string,
  email: string,
  name: string | null,
) {
  const existing = await prisma.creator.findUnique({ where: { userId } });
  if (existing) return existing;

  const base = slugifyHandle(email.split('@')[0] ?? 'creator');
  let handle = base;
  let suffix = 0;
  while (await prisma.creator.findUnique({ where: { handle } })) {
    suffix += 1;
    handle = `${base}${suffix}`;
  }

  return prisma.creator.create({
    data: {
      userId,
      handle,
      displayName: name?.trim() || handle,
    },
  });
}

async function ensureCategory(slug: string) {
  const name = CATEGORY_NAMES[slug] ?? slug;
  return prisma.category.upsert({
    where: { slug },
    update: {},
    create: { slug, name },
  });
}

export const lessonRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        videoKey: z.string().min(1),
        coverKey: z.string().min(1),
        title: z.string().min(1).max(120),
        description: z.string().max(500).default(''),
        categorySlug: z.string().min(1).max(40),
        duration: z.number().int().positive().max(120_000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const creator = await ensureCreator(
        user.id,
        user.email ?? '',
        user.name ?? null,
      );
      const category = await ensureCategory(input.categorySlug);

      const lesson = await prisma.lesson.create({
        data: {
          creatorId: creator.id,
          categoryId: category.id,
          title: input.title,
          description: input.description,
          videoUrl: input.videoKey,
          thumbUrl: input.coverKey,
          duration: input.duration,
        },
      });

      return { id: lesson.id };
    }),

  feed: publicProcedure
    .input(
      z
        .object({
          cursor: z.string().optional(),
          limit: z.number().int().min(1).max(FEED_PAGE_MAX).optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const limit = input?.limit ?? FEED_PAGE_SIZE;
      const cursor = input?.cursor;

      const rows = await prisma.lesson.findMany({
        take: limit + 1,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        orderBy: { publishedAt: 'desc' },
        include: {
          creator: true,
          category: true,
          _count: { select: { likes: true, comments: true, saves: true } },
        },
      });

      const hasMore = rows.length > limit;
      const sliced = hasMore ? rows.slice(0, -1) : rows;

      const items = await Promise.all(
        sliced.map(async (l) => ({
          id: l.id,
          title: l.title,
          description: l.description,
          duration: l.duration,
          publishedAt: l.publishedAt,
          videoUrl: await signDownloadUrl(l.videoUrl),
          thumbUrl: await signDownloadUrl(l.thumbUrl),
          creator: {
            handle: l.creator.handle,
            displayName: l.creator.displayName,
            avatarUrl: l.creator.avatarUrl,
          },
          category: {
            slug: l.category.slug,
            name: l.category.name,
          },
          counts: {
            likes: l._count.likes,
            comments: l._count.comments,
            saves: l._count.saves,
          },
        })),
      );

      return {
        items,
        nextCursor: hasMore ? sliced[sliced.length - 1]!.id : null,
      };
    }),
});
