import { S3Client } from '@aws-sdk/client-s3';
import { env } from '@skoop/env/server';

export const s3 = new S3Client({
  forcePathStyle: true,
  region: env.SUPABASE_S3_REGION,
  endpoint: env.SUPABASE_S3_ENDPOINT,
  credentials: {
    accessKeyId: env.SUPABASE_S3_ACCESS_KEY_ID,
    secretAccessKey: env.SUPABASE_S3_SECRET_ACCESS_KEY,
  },
});

export const S3_BUCKET = env.SUPABASE_S3_BUCKET;
