import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { createWriteStream, createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

export interface SliceResult {
  printTime: number;
  filamentUsage: {
    length: number;
    weight: number;
  };
  gcode?: string;
}

export class SliceService {
  private s3Client: S3Client;
  private tempDir: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
    });
    this.tempDir = join(tmpdir(), 'slicing-service');
  }

  async sliceModel(
    modelUrl: string,
    profile: string,
    options?: Record<string, any>
  ): Promise<SliceResult> {
    // Download model from S3 or local URL
    const modelPath = await this.downloadModel(modelUrl);
    
    // TODO: Implement actual slicing using BambuStudio/OrcaSlicer/PrusaSlicer CLI
    // For now, return mock data
    return {
      printTime: 120, // minutes
      filamentUsage: {
        length: 1000, // meters
        weight: 1000, // grams
      },
    };
  }

  private async downloadModel(url: string): Promise<string> {
    if (url.startsWith('s3://')) {
      return this.downloadFromS3(url);
    } else if (url.startsWith('http')) {
      return this.downloadFromHttp(url);
    } else {
      throw new Error('Unsupported URL scheme');
    }
  }

  private async downloadFromS3(s3Url: string): Promise<string> {
    const [bucket, ...keyParts] = s3Url.replace('s3://', '').split('/');
    const key = keyParts.join('/');
    
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    const outputPath = join(this.tempDir, key);
    
    if (response.Body) {
      await pipeline(
        response.Body as NodeJS.ReadableStream,
        createWriteStream(outputPath)
      );
    }

    return outputPath;
  }

  private async downloadFromHttp(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download model from ${url}`);
    }

    const filename = url.split('/').pop() || 'model.stl';
    const outputPath = join(this.tempDir, filename);
    
    await pipeline(
      response.body as NodeJS.ReadableStream,
      createWriteStream(outputPath)
    );

    return outputPath;
  }
} 