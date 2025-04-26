import { z } from 'zod';

const configSchema = z.object({
  port: z.number().default(3000),
  grpcPort: z.number().default(50051),
  awsRegion: z.string().default('us-east-1'),
  awsAccessKeyId: z.string().optional(),
  awsSecretAccessKey: z.string().optional(),
  tempDir: z.string().default('/tmp/slicing-service'),
  maxFileSize: z.number().default(50 * 1024 * 1024), // 50MB
  supportedFormats: z.array(z.string()).default(['stl', 'obj', '3mf']),
  slicerPath: z.string().default('/usr/local/bin/bambu-studio'),
  defaultProfile: z.string().default('default'),
  grpcHost: z.string().default('localhost'),
});

export type Config = z.infer<typeof configSchema>;

export const config: Config = configSchema.parse({
  port: Number(process.env.PORT),
  grpcPort: Number(process.env.GRPC_PORT),
  awsRegion: process.env.AWS_REGION,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  tempDir: process.env.TEMP_DIR,
  maxFileSize: Number(process.env.MAX_FILE_SIZE),
  supportedFormats: process.env.SUPPORTED_FORMATS?.split(','),
  slicerPath: process.env.SLICER_PATH,
  defaultProfile: process.env.DEFAULT_PROFILE,
  grpcHost: process.env.GRPC_HOST,
}); 