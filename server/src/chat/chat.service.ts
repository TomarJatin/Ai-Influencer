import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetChatsQueryDto, MessageDto, UpdateChatDto } from './dto/chat.dto';
import {
  appendClientMessage,
  appendResponseMessages,
  generateObject,
  pipeDataStreamToResponse,
  smoothStream,
  streamText,
  LanguageModel,
  Attachment,
} from 'ai';
import { Response } from 'express';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { InputJsonValue } from 'prisma/client/runtime/library';
import { dbToAiMessage } from './dto/db-to-aiMessage';
import { ToolsService } from './tools.service';
import { z } from 'zod';
import { S3Service } from 'src/common/s3.service';
import { getPrompt } from './prompt';
import { RequestUser } from 'src/auth/dto/request-user.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly toolsService: ToolsService,
    private readonly s3Service: S3Service,
  ) {}

  private getModel(modelString: string): LanguageModel {
    const [provider, modelName] = modelString.split('/');
    if (!provider || !modelName) {
      throw new BadRequestException('Invalid model format. Use: provider/model-name');
    }

    switch (provider.toLowerCase()) {
      case 'openai':
        return openai(modelName);
      case 'anthropic':
        return anthropic(modelName);
      case 'google':
        return google(modelName);
      default:
        throw new BadRequestException(
          `Unsupported provider: ${provider}. Supported providers: openai, anthropic, google`,
        );
    }
  }
  private getTemperature(modelName: string) {
    if (modelName.includes('gpt-5')) {
      return 1;
    }
    return 0.5;
  }

  private isAllowTools(modelName: string) {
    if (modelName.includes('gpt-5-chat-latest')) {
      return false;
    }
    return true;
  }

  async createMessage(user: RequestUser, chatId: string, body: MessageDto, res: Response) {
    const { message, model } = body;
    const chat = await this.getChat(user.id, chatId);
    await this.prisma.message.create({
      data: {
        chatId,
        content: message.content,
        role: message.role,
        parts: message.parts as unknown as InputJsonValue,
        attachments: message.experimental_attachments as unknown as InputJsonValue,
      },
    });
    const messages = appendClientMessage({
      messages: chat.messages,
      message,
    });
    if (chat.title === 'New Chat') {
      void this.generateAndChangeTitle(message.content, chatId);
    }

    const selectedModel = this.getModel(model);

    pipeDataStreamToResponse(res, {
      execute: (dataStreamWriter) => {
        const result = streamText({
          model: selectedModel,
          messages,
          maxSteps: 10,
          system: getPrompt(user.name || 'Unknown'),
          tools: this.isAllowTools(model) ? this.toolsService.getTools() : undefined,
          toolCallStreaming: true,
          experimental_transform: smoothStream({ chunking: 'word' }),
          onFinish: async ({ response }) => {
            const [, assistantMessage] = appendResponseMessages({
              messages: [message],
              responseMessages: response.messages,
            });
            await this.prisma.message.create({
              data: {
                chatId,
                content: assistantMessage.content,
                role: assistantMessage.role,
                parts: assistantMessage.parts as unknown as InputJsonValue,
                attachments: assistantMessage.experimental_attachments as unknown as InputJsonValue,
              },
            });
          },
          temperature: this.getTemperature(model),
        });
        result.mergeIntoDataStream(dataStreamWriter);
      },
      onError: (error) => {
        return error instanceof Error ? error.message : String(error);
      },
    });
  }

  async createChat(userId: string) {
    const chat = await this.prisma.chat.create({
      data: {
        userId,
      },
    });
    return chat;
  }

  async getChat(userId: string, chatId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
        userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return {
      ...chat,
      messages: chat.messages.map(dbToAiMessage),
    };
  }

  async getChats(userId: string, query: GetChatsQueryDto) {
    const [chats, total] = await Promise.all([
      this.prisma.chat.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.chat.count({
        where: {
          userId,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / query.limit);
    const hasNextPage = query.page < totalPages;
    const hasPreviousPage = query.page > 1;

    return {
      chats,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async updateChat(userId: string, chatId: string, body: UpdateChatDto) {
    const chat = await this.prisma.chat.update({
      where: { id: chatId, userId },
      data: body,
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return chat;
  }

  async deleteChat(userId: string, chatId: string) {
    const chat = await this.prisma.chat.delete({
      where: { id: chatId, userId },
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return chat;
  }

  async uploadFiles(userId: string, files: Express.Multer.File[]): Promise<Attachment[]> {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const { url } = await this.s3Service.uploadFile(file, `chat-template/${userId}/${file.originalname}`);
        return {
          url,
          contentType: file.mimetype,
          name: file.originalname,
        } satisfies Attachment;
      }),
    );
    return uploadedFiles;
  }

  private async generateAndChangeTitle(userMessage: string, chatId: string) {
    const res = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        title: z.string(),
      }),
      prompt: `Generate a concise title (max 5 words) that summarizes the intent or topic of the following user message. Avoid punctuation unless necessary. 
			User message:
			${userMessage}`,
    });
    if (res.object.title) {
      await this.prisma.chat.update({
        where: { id: chatId },
        data: { title: res.object.title },
      });
    }
  }
}
