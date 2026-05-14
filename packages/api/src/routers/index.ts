import { protectedProcedure, publicProcedure, router } from '../index';
import { lessonRouter } from './lesson';
import { profileRouter } from './profile';
import { storageRouter } from './storage';

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return 'OK';
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: 'This is private',
      user: ctx.session.user,
    };
  }),
  lesson: lessonRouter,
  profile: profileRouter,
  storage: storageRouter,
});
export type AppRouter = typeof appRouter;
