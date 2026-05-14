import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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

const DEFAULT_GET_TTL_SECONDS = 60 * 60 * 24;

export async function signDownloadUrl(
  key: string,
  expiresIn: number = DEFAULT_GET_TTL_SECONDS,
): Promise<string> {
  const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
  return getSignedUrl(s3, command, { expiresIn });
}
