import { randomUUID } from 'node:crypto';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';

import { S3_BUCKET, s3 } from '../lib/s3';
import { protectedProcedure, router } from '../index';

const PUT_URL_TTL_SECONDS = 60;
const GET_URL_TTL_SECONDS = 60 * 60;

const MAX_BYTES = 200 * 1024 * 1024;

const ALLOWED_PREFIXES = ['avatars', 'lessons', 'thumbnails'] as const;
type AllowedPrefix = (typeof ALLOWED_PREFIXES)[number];

function buildKey(prefix: AllowedPrefix, userId: string, ext: string) {
  const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
  return `${prefix}/${userId}/${randomUUID()}${safeExt ? '.' + safeExt : ''}`;
}

export const storageRouter = router({
  createUploadUrl: protectedProcedure
    .input(
      z.object({
        prefix: z.enum(ALLOWED_PREFIXES),
        contentType: z.string().min(1).max(127),
        contentLength: z.number().int().positive().max(MAX_BYTES),
        ext: z.string().max(8).optional().default(''),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const key = buildKey(input.prefix, userId, input.ext);

      const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        ContentType: input.contentType,
      });

      const url = await getSignedUrl(s3, command, {
        expiresIn: PUT_URL_TTL_SECONDS,
      });

      return { url, key, bucket: S3_BUCKET };
    }),

  createDownloadUrl: protectedProcedure
    .input(z.object({ key: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: input.key,
      });
      const url = await getSignedUrl(s3, command, {
        expiresIn: GET_URL_TTL_SECONDS,
      });
      return { url };
    }),
});
