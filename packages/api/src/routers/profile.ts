import prisma from '@skoop/db';
import { protectedProcedure, router } from '../index';

export const profileRouter = router({
  stats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const [following, followers, lessons] = await Promise.all([
      prisma.follow.count({ where: { userId } }),
      prisma.follow.count({ where: { creator: { userId } } }),
      prisma.lesson.count({ where: { creator: { userId } } }),
    ]);

    return { following, followers, lessons };
  }),
});
