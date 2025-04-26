import { Server, ServerCredentials } from '@grpc/grpc-js';
import { SlicingServiceService } from '../proto/slicing_grpc_pb.js';
import { SliceService } from '../services/slice.service.js';
import { ModelAnalyzer } from '../services/model-analyzer.service.js';
import { config } from '../config.js';

export class GrpcServer {
  private server: Server;
  private sliceService: SliceService;
  private modelAnalyzer: ModelAnalyzer;

  constructor() {
    this.server = new Server();
    this.sliceService = new SliceService();
    this.modelAnalyzer = new ModelAnalyzer();
  }

  private async analyzeModel(call: any, callback: any) {
    try {
      const { modelData, fileName } = call.request;
      const analysis = await this.modelAnalyzer.analyzeModel(modelData);
      callback(null, analysis);
    } catch (error) {
      callback(error);
    }
  }

  private async sliceModel(call: any, callback: any) {
    try {
      const { modelUrl, profile, options } = call.request;
      const result = await this.sliceService.sliceModel(modelUrl, profile, options);
      callback(null, result);
    } catch (error) {
      callback(error);
    }
  }

  start() {
    this.server.addService(SlicingServiceService, {
      analyzeModel: this.analyzeModel.bind(this),
      sliceModel: this.sliceModel.bind(this),
    });

    const port = config.grpcPort || 50051;
    this.server.bindAsync(
      `0.0.0.0:${port}`,
      ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          console.error('Failed to start gRPC server:', err);
          return;
        }
        console.log(`gRPC server listening on port ${port}`);
        this.server.start();
      }
    );
  }

  stop() {
    this.server.forceShutdown();
  }
} 