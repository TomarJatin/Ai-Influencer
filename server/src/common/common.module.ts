import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { S3Service } from './s3.service';

@Module({
  providers: [AIService, S3Service],
  exports: [AIService, S3Service],
})
export class CommonModule {}




