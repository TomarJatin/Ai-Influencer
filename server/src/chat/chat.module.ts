import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatController } from './chat.controller';
import { ToolsService } from './tools.service';
import { S3Service } from 'src/common/s3.service';

@Module({
  imports: [PrismaModule],
  controllers: [ChatController],
  providers: [ChatService, ToolsService, S3Service],
  exports: [ChatService],
})
export class ChatModule {}
