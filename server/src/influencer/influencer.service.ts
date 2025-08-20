import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIService, ImageIdea, VideoIdea } from '../common/ai.service';
import {
  CreateAIInfluencerDto,
  UpdateAIInfluencerDto,
  GenerateImageIdeasDto,
  GenerateVideoIdeasDto,
  GeneratePromptDto,
  UploadMediaDto,
  ImageIdeaDto,
  VideoIdeaDto,
  OptimizedPromptDto,
} from './dto/influencer.dto';
import { RequestUser } from '../auth/dto/request-user.dto';

@Injectable()
export class InfluencerService {
  private readonly logger = new Logger(InfluencerService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly aiService: AIService,
  ) {}

  // ============================================================================
  // BASIC INFLUENCER CRUD OPERATIONS
  // ============================================================================

  async createInfluencer(createInfluencerDto: CreateAIInfluencerDto, user: RequestUser) {
    try {
      const influencer = await this.prismaService.aIInfluencer.create({
        data: {
          ...createInfluencerDto,
          userId: user.id,
        },
        include: {
          images: true,
          videos: true,
          imageIdeas: true,
          videoIdeas: true,
        },
      });

      this.logger.log(`AI Influencer ${influencer.name} created by user ${user.id}`);
      return influencer;
    } catch (error) {
      this.logger.error(`Failed to create AI influencer: ${error.message}`, error);
      throw new BadRequestException('Failed to create AI influencer');
    }
  }

  async getInfluencers(user: RequestUser) {
    try {
      const influencers = await this.prismaService.aIInfluencer.findMany({
        where: {
          OR: [{ userId: user.id }, { isDefault: true }],
          isActive: true,
        },
        include: {
          images: {
            orderBy: { createdAt: 'desc' },
          },
          videos: {
            orderBy: { createdAt: 'desc' },
          },
          imageIdeas: {
            orderBy: { createdAt: 'desc' },
          },
          videoIdeas: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return influencers;
    } catch (error) {
      this.logger.error(`Failed to get influencers for user ${user.id}: ${error.message}`, error);
      throw new BadRequestException('Failed to retrieve influencers');
    }
  }

  async getInfluencer(id: string, user: RequestUser) {
    try {
      const influencer = await this.prismaService.aIInfluencer.findFirst({
        where: {
          id,
          OR: [{ userId: user.id }, { isDefault: true }],
          isActive: true,
        },
        include: {
          images: {
            orderBy: { createdAt: 'desc' },
          },
          videos: {
            orderBy: { createdAt: 'desc' },
          },
          imageIdeas: {
            orderBy: { createdAt: 'desc' },
          },
          videoIdeas: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!influencer) {
        throw new NotFoundException('AI Influencer not found');
      }

      return influencer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to get influencer ${id}: ${error.message}`, error);
      throw new BadRequestException('Failed to retrieve influencer');
    }
  }

  async updateInfluencer(id: string, updateInfluencerDto: UpdateAIInfluencerDto, user: RequestUser) {
    try {
      // Check if user owns this influencer
      const existingInfluencer = await this.prismaService.aIInfluencer.findFirst({
        where: {
          id,
          userId: user.id,
          isActive: true,
        },
      });

      if (!existingInfluencer) {
        throw new NotFoundException('AI Influencer not found or not owned by user');
      }

      const updatedInfluencer = await this.prismaService.aIInfluencer.update({
        where: { id },
        data: updateInfluencerDto,
        include: {
          images: true,
          videos: true,
          imageIdeas: true,
          videoIdeas: true,
        },
      });

      this.logger.log(`AI Influencer ${id} updated by user ${user.id}`);
      return updatedInfluencer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update influencer ${id}: ${error.message}`, error);
      throw new BadRequestException('Failed to update influencer');
    }
  }

  async deleteInfluencer(id: string, user: RequestUser) {
    try {
      // Check if user owns this influencer
      const existingInfluencer = await this.prismaService.aIInfluencer.findFirst({
        where: {
          id,
          userId: user.id,
          isActive: true,
        },
      });

      if (!existingInfluencer) {
        throw new NotFoundException('AI Influencer not found or not owned by user');
      }

      // Soft delete by setting isActive to false
      await this.prismaService.aIInfluencer.update({
        where: { id },
        data: { isActive: false },
      });

      this.logger.log(`AI Influencer ${id} deleted by user ${user.id}`);
      return { success: true, message: 'AI Influencer deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete influencer ${id}: ${error.message}`, error);
      throw new BadRequestException('Failed to delete influencer');
    }
  }

  // ============================================================================
  // IMAGE IDEA GENERATION AND MANAGEMENT
  // ============================================================================

  async generateImageIdeas(
    influencerId: string,
    generateDto: GenerateImageIdeasDto,
    user: RequestUser,
  ): Promise<ImageIdeaDto[]> {
    try {
      const influencer = await this.getInfluencer(influencerId, user);

      // Get already used idea IDs to avoid duplicates
      const usedIdeas = await this.prismaService.imageIdea.findMany({
        where: { influencerId, isUsed: true },
        select: { ideaId: true },
      });
      const usedIdeaIds = usedIdeas.map((idea) => idea.ideaId);

      // Generate new ideas using AI
      const aiIdeas = await this.aiService.generateImageIdeas(influencer, generateDto.count || 6, usedIdeaIds);

      // Save ideas to database
      const savedIdeas = await Promise.all(
        aiIdeas.map(async (idea: ImageIdea) => {
          const savedIdea = await this.prismaService.imageIdea.create({
            data: {
              influencerId,
              ideaId: idea.id,
              title: idea.title,
              description: idea.description,
              category: idea.category,
              visualElements: idea.visualElements,
              mood: idea.mood,
              setting: idea.setting,
              styleNotes: idea.styleNotes,
            },
          });

          return this.mapImageIdeaToDto(savedIdea);
        }),
      );

      this.logger.log(`Generated ${savedIdeas.length} image ideas for influencer ${influencerId}`);
      return savedIdeas;
    } catch (error) {
      this.logger.error(`Failed to generate image ideas: ${error.message}`, error);
      throw new BadRequestException('Failed to generate image ideas');
    }
  }

  async getImageIdeas(influencerId: string, user: RequestUser): Promise<ImageIdeaDto[]> {
    try {
      await this.getInfluencer(influencerId, user); // Verify access

      const ideas = await this.prismaService.imageIdea.findMany({
        where: { influencerId },
        orderBy: { createdAt: 'desc' },
      });

      return ideas.map((idea) => this.mapImageIdeaToDto(idea));
    } catch (error) {
      this.logger.error(`Failed to get image ideas: ${error.message}`, error);
      throw new BadRequestException('Failed to retrieve image ideas');
    }
  }

  async generateImagePrompt(
    influencerId: string,
    ideaId: string,
    promptDto: GeneratePromptDto,
    user: RequestUser,
  ): Promise<OptimizedPromptDto> {
    try {
      const influencer = await this.getInfluencer(influencerId, user);

      const idea = await this.prismaService.imageIdea.findFirst({
        where: { influencerId, ideaId },
      });

      if (!idea) {
        throw new NotFoundException('Image idea not found');
      }

      // Convert database idea to AI service format
      const imageIdea: ImageIdea = {
        id: idea.ideaId,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        visualElements: idea.visualElements as string[],
        mood: idea.mood,
        setting: idea.setting,
        styleNotes: idea.styleNotes,
      };

      const optimizedPrompt = await this.aiService.generateImagePrompt(
        influencer,
        imageIdea,
        promptDto.customInstructions,
      );

      this.logger.log(`Generated optimized image prompt for idea ${ideaId}`);
      return optimizedPrompt;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to generate image prompt: ${error.message}`, error);
      throw new BadRequestException('Failed to generate image prompt');
    }
  }

  async uploadImage(
    influencerId: string,
    ideaId: string,
    file: Express.Multer.File,
    uploadDto: UploadMediaDto,
    user: RequestUser,
  ) {
    try {
      const influencer = await this.getInfluencer(influencerId, user);

      const idea = await this.prismaService.imageIdea.findFirst({
        where: { influencerId, ideaId },
      });

      if (!idea) {
        throw new NotFoundException('Image idea not found');
      }

      // Upload file to S3
      const uploadResult = await this.aiService.uploadFile(file, 'image');

      // Create image record
      const imageRecord = await this.prismaService.influencerImage.create({
        data: {
          influencerId,
          imageIdeaId: idea.id,
          imageUrl: uploadResult.url,
          imageType: 'LIFESTYLE', // Default type, could be determined from idea category
          prompt: uploadDto.generatedPrompt,
          isReference: false,
          metadata: {
            ...uploadDto.metadata,
            uploadedAt: new Date().toISOString(),
            originalFileName: file.originalname,
            s3Key: uploadResult.key,
            ideaUsed: {
              id: idea.ideaId,
              title: idea.title,
              category: idea.category,
            },
          },
        },
      });

      // Mark idea as used
      await this.prismaService.imageIdea.update({
        where: { id: idea.id },
        data: { isUsed: true },
      });

      this.logger.log(`Image uploaded for influencer ${influencerId} using idea ${ideaId}`);
      return imageRecord;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to upload image: ${error.message}`, error);
      throw new BadRequestException('Failed to upload image');
    }
  }

  // ============================================================================
  // VIDEO IDEA GENERATION AND MANAGEMENT
  // ============================================================================

  async generateVideoIdeas(
    influencerId: string,
    generateDto: GenerateVideoIdeasDto,
    user: RequestUser,
  ): Promise<VideoIdeaDto[]> {
    try {
      const influencer = await this.getInfluencer(influencerId, user);

      // Get already used idea IDs to avoid duplicates
      const usedIdeas = await this.prismaService.videoIdea.findMany({
        where: { influencerId, isUsed: true },
        select: { ideaId: true },
      });
      const usedIdeaIds = usedIdeas.map((idea) => idea.ideaId);

      // Generate new ideas using AI
      const aiIdeas = await this.aiService.generateVideoIdeas(influencer, generateDto.count || 6, usedIdeaIds);

      // Save ideas to database
      const savedIdeas = await Promise.all(
        aiIdeas.map(async (idea: VideoIdea) => {
          const savedIdea = await this.prismaService.videoIdea.create({
            data: {
              influencerId,
              ideaId: idea.id,
              title: idea.title,
              description: idea.description,
              category: idea.category,
              scenario: idea.scenario,
              keyMoments: idea.keyMoments,
              duration: idea.duration,
              mood: idea.mood,
              visualStyle: idea.visualStyle,
            },
          });

          return this.mapVideoIdeaToDto(savedIdea);
        }),
      );

      this.logger.log(`Generated ${savedIdeas.length} video ideas for influencer ${influencerId}`);
      return savedIdeas;
    } catch (error) {
      this.logger.error(`Failed to generate video ideas: ${error.message}`, error);
      throw new BadRequestException('Failed to generate video ideas');
    }
  }

  async getVideoIdeas(influencerId: string, user: RequestUser): Promise<VideoIdeaDto[]> {
    try {
      await this.getInfluencer(influencerId, user); // Verify access

      const ideas = await this.prismaService.videoIdea.findMany({
        where: { influencerId },
        orderBy: { createdAt: 'desc' },
      });

      return ideas.map((idea) => this.mapVideoIdeaToDto(idea));
    } catch (error) {
      this.logger.error(`Failed to get video ideas: ${error.message}`, error);
      throw new BadRequestException('Failed to retrieve video ideas');
    }
  }

  async generateVideoPrompt(
    influencerId: string,
    ideaId: string,
    promptDto: GeneratePromptDto,
    user: RequestUser,
  ): Promise<OptimizedPromptDto> {
    try {
      const influencer = await this.getInfluencer(influencerId, user);

      const idea = await this.prismaService.videoIdea.findFirst({
        where: { influencerId, ideaId },
      });

      if (!idea) {
        throw new NotFoundException('Video idea not found');
      }

      // Convert database idea to AI service format
      const videoIdea: VideoIdea = {
        id: idea.ideaId,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        scenario: idea.scenario,
        keyMoments: idea.keyMoments as string[],
        duration: idea.duration,
        mood: idea.mood,
        visualStyle: idea.visualStyle,
      };

      const optimizedPrompt = await this.aiService.generateVideoPrompt(
        influencer,
        videoIdea,
        promptDto.customInstructions,
      );

      this.logger.log(`Generated optimized video prompt for idea ${ideaId}`);
      return optimizedPrompt;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to generate video prompt: ${error.message}`, error);
      throw new BadRequestException('Failed to generate video prompt');
    }
  }

  async uploadVideo(
    influencerId: string,
    ideaId: string,
    file: Express.Multer.File,
    uploadDto: UploadMediaDto,
    user: RequestUser,
  ) {
    try {
      const influencer = await this.getInfluencer(influencerId, user);

      const idea = await this.prismaService.videoIdea.findFirst({
        where: { influencerId, ideaId },
      });

      if (!idea) {
        throw new NotFoundException('Video idea not found');
      }

      // Upload file to S3
      const uploadResult = await this.aiService.uploadFile(file, 'video');

      // Create video record
      const videoRecord = await this.prismaService.influencerVideo.create({
        data: {
          influencerId,
          videoIdeaId: idea.id,
          title: idea.title,
          description: idea.description,
          videoUrl: uploadResult.url,
          prompt: uploadDto.generatedPrompt,
          scenario: idea.scenario,
          status: 'COMPLETED',
          metadata: {
            ...uploadDto.metadata,
            uploadedAt: new Date().toISOString(),
            originalFileName: file.originalname,
            s3Key: uploadResult.key,
            ideaUsed: {
              id: idea.ideaId,
              title: idea.title,
              category: idea.category,
            },
          },
        },
      });

      // Mark idea as used
      await this.prismaService.videoIdea.update({
        where: { id: idea.id },
        data: { isUsed: true },
      });

      this.logger.log(`Video uploaded for influencer ${influencerId} using idea ${ideaId}`);
      return videoRecord;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to upload video: ${error.message}`, error);
      throw new BadRequestException('Failed to upload video');
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private mapImageIdeaToDto(idea: any): ImageIdeaDto {
    return {
      id: idea.ideaId,
      title: idea.title,
      description: idea.description,
      category: idea.category,
      visualElements: Array.isArray(idea.visualElements) ? idea.visualElements : [],
      mood: idea.mood,
      setting: idea.setting,
      styleNotes: idea.styleNotes,
      isUsed: idea.isUsed,
      createdAt: idea.createdAt.toISOString(),
    };
  }

  private mapVideoIdeaToDto(idea: any): VideoIdeaDto {
    return {
      id: idea.ideaId,
      title: idea.title,
      description: idea.description,
      category: idea.category,
      scenario: idea.scenario,
      keyMoments: Array.isArray(idea.keyMoments) ? idea.keyMoments : [],
      duration: idea.duration,
      mood: idea.mood,
      visualStyle: idea.visualStyle,
      isUsed: idea.isUsed,
      createdAt: idea.createdAt.toISOString(),
    };
  }
}
