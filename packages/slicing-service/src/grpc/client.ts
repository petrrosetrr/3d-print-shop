import { credentials, Client } from '@grpc/grpc-js';
import { SlicingServiceClient } from '../proto/slicing_grpc_pb.js';
import { AnalyzeModelRequest, SliceModelRequest } from '../proto/slicing_pb.js';
import { config } from '../config.js';

export class SlicingClient {
  private client: SlicingServiceClient;

  constructor(host: string = 'localhost', port: number = 50051) {
    this.client = new SlicingServiceClient(
      `${host}:${port}`,
      credentials.createInsecure()
    );
  }

  async analyzeModel(modelData: Buffer, fileName: string) {
    const request = new AnalyzeModelRequest();
    request.setModelData(modelData);
    request.setFileName(fileName);

    return new Promise((resolve, reject) => {
      this.client.analyzeModel(request, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response);
      });
    });
  }

  async sliceModel(modelUrl: string, profile: string, options?: Record<string, string>) {
    const request = new SliceModelRequest();
    request.setModelUrl(modelUrl);
    request.setProfile(profile);
    
    if (options) {
      const optionsMap = request.getOptionsMap();
      Object.entries(options).forEach(([key, value]) => {
        optionsMap.set(key, value);
      });
    }

    return new Promise((resolve, reject) => {
      this.client.sliceModel(request, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response);
      });
    });
  }

  close() {
    this.client.close();
  }
} 