import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIService, ImageAnalysis, OptimizedPromptSchema } from '../common/ai.service';
import {
  CreateAIInfluencerDto,
  UpdateAIInfluencerDto,
  CreateImageIdeaDto,
  CreateVideoIdeaDto,
  UpdateImageIdeaDto,
  UpdateVideoIdeaDto,
  GenerateImageFromIdeaDto,
  GenerateVideoFromIdeaDto,
  AnalyzeImageForIdeaDto,
  PaginationQueryDto,
  PaginatedResponseDto,
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
  // IMAGE IDEA MANAGEMENT
  // ============================================================================

  async createImageIdea(influencerId: string, createDto: CreateImageIdeaDto, user: RequestUser): Promise<ImageIdeaDto> {
    try {
      await this.getInfluencer(influencerId, user); // Verify access

      const idea = await this.prismaService.imageIdea.create({
        data: {
          influencerId,
          ideaId: `img_custom_${Date.now()}`, // Generate unique ID
          title: createDto.title,
          description: createDto.description,
          category: createDto.category || 'Custom',
          visualElements: createDto.visualElements || [],
          mood: createDto.mood || '',
          setting: createDto.setting || '',
          styleNotes: createDto.styleNotes || '',
        },
      });

      this.logger.log(`Created image idea ${idea.id} for influencer ${influencerId}`);
      return this.mapImageIdeaToDto(idea);
    } catch (error) {
      this.logger.error(`Failed to create image idea: ${error.message}`, error);
      throw new BadRequestException('Failed to create image idea');
    }
  }

  async analyzeImageForIdea(
    influencerId: string,
    file: Express.Multer.File,
    user: RequestUser,
  ): Promise<AnalyzeImageForIdeaDto> {
    try {
      await this.getInfluencer(influencerId, user); // Verify access

      const analysis = await this.aiService.analyzeImageForIdea(file.buffer, file.mimetype);

      this.logger.log(`Analyzed image for idea generation for influencer ${influencerId}`);
      return analysis;
    } catch (error) {
      this.logger.error(`Failed to analyze image: ${error.message}`, error);
      throw new BadRequestException('Failed to analyze image for idea generation');
    }
  }

  async getImageIdeas(
    influencerId: string,
    query: PaginationQueryDto,
    user: RequestUser,
  ): Promise<PaginatedResponseDto<ImageIdeaDto>> {
    try {
      await this.getInfluencer(influencerId, user); // Verify access

      const { page = 1, limit = 10, search, category, isUsed } = query;
      const skip = (page - 1) * limit;

      const where: any = { influencerId };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (category) {
        where.category = category;
      }

      if (typeof isUsed === 'boolean') {
        where.isUsed = isUsed;
      }

      const [ideas, total] = await Promise.all([
        this.prismaService.imageIdea.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prismaService.imageIdea.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        items: ideas.map((idea) => this.mapImageIdeaToDto(idea)),
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      this.logger.error(`Failed to get image ideas: ${error.message}`, error);
      throw new BadRequestException('Failed to retrieve image ideas');
    }
  }

  async updateImageIdea(
    influencerId: string,
    ideaId: string,
    updateDto: UpdateImageIdeaDto,
    user: RequestUser,
  ): Promise<ImageIdeaDto> {
    try {
      await this.getInfluencer(influencerId, user); // Verify access

      const idea = await this.prismaService.imageIdea.findFirst({
        where: { id: ideaId, influencerId },
      });

      if (!idea) {
        throw new NotFoundException('Image idea not found');
      }

      const updatedIdea = await this.prismaService.imageIdea.update({
        where: { id: ideaId },
        data: {
          ...updateDto,
          visualElements: updateDto.visualElements || (idea.visualElements as string[]),
        },
      });

      this.logger.log(`Updated image idea ${ideaId} for influencer ${influencerId}`);
      return this.mapImageIdeaToDto(updatedIdea);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update image idea: ${error.message}`, error);
      throw new BadRequestException('Failed to update image idea');
    }
  }

  async deleteImageIdea(influencerId: string, ideaId: string, user: RequestUser): Promise<void> {
    try {
      await this.getInfluencer(influencerId, user); // Verify access

      const idea = await this.prismaService.imageIdea.findFirst({
        where: { id: ideaId, influencerId },
      });

      if (!idea) {
        throw new NotFoundException('Image idea not found');
      }

      await this.prismaService.imageIdea.delete({
        where: { id: ideaId },
      });

      this.logger.log(`Deleted image idea ${ideaId} for influencer ${influencerId}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete image idea: ${error.message}`, error);
      throw new BadRequestException('Failed to delete image idea');
    }
  }

  async generateImageFromIdea(influencerId: string, generateDto: GenerateImageFromIdeaDto, user: RequestUser) {
    try {
      const influencer = await this.getInfluencer(influencerId, user);
      console.log('influencerId', influencerId);
      console.log('generateDto', generateDto);

      const idea = await this.prismaService.imageIdea.findFirst({
        where: { id: generateDto.imageIdeaId, influencerId },
      });

      if (!idea) {
        throw new NotFoundException('Image idea not found');
      }

      // Generate optimized prompt based on idea and influencer data
      const promptData = {
        influencer,
        idea: {
          title: idea.title,
          description: idea.description,
          category: idea.category,
          visualElements: idea.visualElements as string[],
          mood: idea.mood,
          setting: idea.setting,
          styleNotes: idea.styleNotes,
        },
        imageType: generateDto.imageType,
      };

      const optimizedPrompt = await this.generateImagePromptFromIdea(promptData);
      console.log('optimizedPrompt', optimizedPrompt);
      const finalPrompt = generateDto.customPrompt || optimizedPrompt.prompt;

      // Generate image using Gemini Imagen
      const result = await this.aiService.generateImageWithGemini(
        finalPrompt,
        generateDto.imageType,
        '1:1', // Default aspect ratio, could be configurable
      );
      console.log('result', result);

      // Create image record
      const imageRecord = await this.prismaService.influencerImage.create({
        data: {
          influencerId,
          imageIdeaId: idea.id,
          imageUrl: result.imageUrl,
          imageType: generateDto.imageType,
          prompt: finalPrompt,
          isReference: generateDto.isReference || false,
          metadata: {
            ...result.metadata,
            ideaUsed: {
              id: idea.id,
              title: idea.title,
              category: idea.category,
            },
            optimizedPrompt: JSON.parse(JSON.stringify(optimizedPrompt)),
          },
        },
      });

      // Mark idea as used
      await this.prismaService.imageIdea.update({
        where: { id: idea.id },
        data: { isUsed: true },
      });

      this.logger.log(`Generated image for influencer ${influencerId} using idea ${generateDto.imageIdeaId}`);
      return imageRecord;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log('failed to generate image from idea', error);
      this.logger.error(`Failed to generate image from idea: ${error.message}`, error);
      throw new BadRequestException('Failed to generate image from idea');
    }
  }

  private async generateImagePromptFromIdea(data: any): Promise<OptimizedPromptDto> {
    const { influencer, idea, imageType } = data;

    const prompt = `
You are an expert prompt engineer specializing in AI image generation. Create an optimized prompt for generating a high-quality ${imageType} image based on the following:

INFLUENCER CHARACTERISTICS:
- Name: ${influencer.name || 'AI Influencer'}
- Personality: ${influencer.personalityArchetype || 'Not specified'}
- Style: ${influencer.styleAesthetic || 'Not specified'}
- Age: ${influencer.age || 'Not specified'}
- Ethnicity: ${influencer.primaryEthnicity || 'Not specified'}
- Height: ${influencer.height || 'Not specified'}
- Body Type: ${influencer.bodyType || 'Not specified'}
- Hair: ${influencer.hairColor || 'Not specified'}
- Eyes: ${influencer.eyeColor || 'Not specified'}
- Key Features: ${influencer.keyFeatures || 'Not specified'}

SELECTED IMAGE IDEA:
- Title: ${idea.title}
- Description: ${idea.description}
- Category: ${idea.category}
- Visual Elements: ${idea.visualElements.join(', ')}
- Mood: ${idea.mood}
- Setting: ${idea.setting}
- Style Notes: ${idea.styleNotes}

OPTIMIZATION REQUIREMENTS:
1. Create a detailed, specific prompt optimized for AI image generation
2. Include physical characteristics that match the influencer
3. Specify lighting, composition, and camera angles
4. Add professional photography terminology
5. Include style and mood descriptors
6. Ensure the prompt is clear and unambiguous
7. Optimize for high-quality, realistic results
8. Keep the prompt focused and not overly complex

Generate an optimized prompt that will produce a stunning, professional-quality image that authentically represents this AI influencer.
    `;

    // Use the imported OptimizedPromptSchema
    const result = await this.aiService.generateObject(prompt, OptimizedPromptSchema);
    return result as OptimizedPromptDto;
  }

  // ============================================================================
  // VIDEO IDEA MANAGEMENT
  // ============================================================================

  async createVideoIdea(influencerId: string, createDto: CreateVideoIdeaDto, user: RequestUser): Promise<VideoIdeaDto> {
    try {
      await this.getInfluencer(influencerId, user); // Verify access

      const idea = await this.prismaService.videoIdea.create({
        data: {
          influencerId,
          ideaId: `vid_custom_${Date.now()}`, // Generate unique ID
          title: createDto.title,
          description: createDto.description,
          scenario: createDto.scenario,
          category: createDto.category || 'Custom',
          keyMoments: createDto.keyMoments || [],
          duration: createDto.duration || '5-10 seconds',
          mood: createDto.mood || '',
          visualStyle: createDto.visualStyle || '',
        },
      });

      this.logger.log(`Created video idea ${idea.id} for influencer ${influencerId}`);
      return this.mapVideoIdeaToDto(idea);
    } catch (error) {
      this.logger.error(`Failed to create video idea: ${error.message}`, error);
      throw new BadRequestException('Failed to create video idea');
    }
  }

  async getVideoIdeas(
    influencerId: string,
    query: PaginationQueryDto,
    user: RequestUser,
  ): Promise<PaginatedResponseDto<VideoIdeaDto>> {
    try {
      await this.getInfluencer(influencerId, user); // Verify access

      const { page = 1, limit = 10, search, category, isUsed } = query;
      const skip = (page - 1) * limit;

      const where: any = { influencerId };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { scenario: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (category) {
        where.category = category;
      }

      if (typeof isUsed === 'boolean') {
        where.isUsed = isUsed;
      }

      const [ideas, total] = await Promise.all([
        this.prismaService.videoIdea.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prismaService.videoIdea.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        items: ideas.map((idea) => this.mapVideoIdeaToDto(idea)),
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      this.logger.error(`Failed to get video ideas: ${error.message}`, error);
      throw new BadRequestException('Failed to retrieve video ideas');
    }
  }

  async updateVideoIdea(
    influencerId: string,
    ideaId: string,
    updateDto: UpdateVideoIdeaDto,
    user: RequestUser,
  ): Promise<VideoIdeaDto> {
    try {
      await this.getInfluencer(influencerId, user); // Verify access

      const idea = await this.prismaService.videoIdea.findFirst({
        where: { id: ideaId, influencerId },
      });

      if (!idea) {
        throw new NotFoundException('Video idea not found');
      }

      const updatedIdea = await this.prismaService.videoIdea.update({
        where: { id: ideaId },
        data: {
          ...updateDto,
          keyMoments: updateDto.keyMoments || (idea.keyMoments as string[]),
        },
      });

      this.logger.log(`Updated video idea ${ideaId} for influencer ${influencerId}`);
      return this.mapVideoIdeaToDto(updatedIdea);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update video idea: ${error.message}`, error);
      throw new BadRequestException('Failed to update video idea');
    }
  }

  async deleteVideoIdea(influencerId: string, ideaId: string, user: RequestUser): Promise<void> {
    try {
      await this.getInfluencer(influencerId, user); // Verify access

      const idea = await this.prismaService.videoIdea.findFirst({
        where: { id: ideaId, influencerId },
      });

      if (!idea) {
        throw new NotFoundException('Video idea not found');
      }

      await this.prismaService.videoIdea.delete({
        where: { id: ideaId },
      });

      this.logger.log(`Deleted video idea ${ideaId} for influencer ${influencerId}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete video idea: ${error.message}`, error);
      throw new BadRequestException('Failed to delete video idea');
    }
  }

  async generateVideoFromIdea(influencerId: string, generateDto: GenerateVideoFromIdeaDto, user: RequestUser) {
    try {
      const influencer = await this.getInfluencer(influencerId, user);

      const idea = await this.prismaService.videoIdea.findFirst({
        where: { id: generateDto.videoIdeaId, influencerId },
      });

      if (!idea) {
        throw new NotFoundException('Video idea not found');
      }

      // Generate optimized prompt based on idea and influencer data
      const promptData = {
        influencer,
        idea: {
          title: idea.title,
          description: idea.description,
          category: idea.category,
          scenario: idea.scenario,
          keyMoments: idea.keyMoments as string[],
          duration: idea.duration,
          mood: idea.mood,
          visualStyle: idea.visualStyle,
        },
      };

      const optimizedPrompt = await this.generateVideoPromptFromIdea(promptData);
      const finalPrompt = generateDto.customPrompt || optimizedPrompt.prompt;

      // Generate video using Veo3
      const result = await this.aiService.generateVideoWithVeo3(finalPrompt, generateDto.duration || 5);

      // Create video record
      const videoRecord = await this.prismaService.influencerVideo.create({
        data: {
          influencerId,
          videoIdeaId: idea.id,
          title: idea.title,
          description: idea.description,
          prompt: finalPrompt,
          scenario: idea.scenario,
          status: 'GENERATING',
          metadata: {
            ...result.metadata,
            ideaUsed: {
              id: idea.id,
              title: idea.title,
              category: idea.category,
            },
            optimizedPrompt: JSON.parse(JSON.stringify(optimizedPrompt)),
            videoId: result.videoId,
          },
        },
      });

      // Mark idea as used
      await this.prismaService.videoIdea.update({
        where: { id: idea.id },
        data: { isUsed: true },
      });

      this.logger.log(`Started video generation for influencer ${influencerId} using idea ${generateDto.videoIdeaId}`);
      return videoRecord;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to generate video from idea: ${error.message}`, error);
      throw new BadRequestException('Failed to generate video from idea');
    }
  }

  async checkVideoGenerationStatus(videoId: string, user: RequestUser) {
    try {
      const video = await this.prismaService.influencerVideo.findUnique({
        where: { id: videoId },
        include: { influencer: true },
      });

      if (!video) {
        throw new NotFoundException('Video not found');
      }

      // Check if user has access to this video
      if (video.influencer.userId !== user.id) {
        throw new NotFoundException('Video not found');
      }

      if (video.status === 'COMPLETED' || video.status === 'FAILED') {
        return video;
      }

      // Check status with AI service
      const metadata = video.metadata as any;
      const operationId = metadata?.operationId as string;
      if (!operationId) {
        throw new BadRequestException('No operation ID found for video generation');
      }

      const status = await this.aiService.checkVideoStatus(videoId, operationId);

      // Update video record with new status
      const updatedVideo = await this.prismaService.influencerVideo.update({
        where: { id: videoId },
        data: {
          status: status.status as any,
          videoUrl: status.videoUrl,
          thumbnailUrl: status.thumbnailUrl,
          duration: status.metadata?.duration as number,
          metadata: {
            ...(video.metadata as any),
            ...(status.metadata || {}),
          },
        },
      });

      this.logger.log(`Updated video status for ${videoId}: ${status.status}`);
      return updatedVideo;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to check video status: ${error.message}`, error);
      throw new BadRequestException('Failed to check video generation status');
    }
  }

  private async generateVideoPromptFromIdea(data: any): Promise<OptimizedPromptDto> {
    const { influencer, idea } = data;

    const prompt = `
You are an expert prompt engineer specializing in AI video generation. Create an optimized prompt for generating a high-quality video based on the following:

INFLUENCER CHARACTERISTICS:
- Name: ${influencer.name || 'AI Influencer'}
- Personality: ${influencer.personalityArchetype || 'Not specified'}
- Style: ${influencer.styleAesthetic || 'Not specified'}
- Age: ${influencer.age || 'Not specified'}
- Ethnicity: ${influencer.primaryEthnicity || 'Not specified'}
- Height: ${influencer.height || 'Not specified'}
- Body Type: ${influencer.bodyType || 'Not specified'}
- Hair: ${influencer.hairColor || 'Not specified'}
- Eyes: ${influencer.eyeColor || 'Not specified'}
- Key Features: ${influencer.keyFeatures || 'Not specified'}

SELECTED VIDEO IDEA:
- Title: ${idea.title}
- Description: ${idea.description}
- Category: ${idea.category}
- Scenario: ${idea.scenario}
- Key Moments: ${idea.keyMoments.join(', ')}
- Duration: ${idea.duration}
- Mood: ${idea.mood}
- Visual Style: ${idea.visualStyle}

OPTIMIZATION REQUIREMENTS:
1. Create a detailed, specific prompt optimized for AI video generation
2. Include physical characteristics that match the influencer
3. Describe camera movements, angles, and transitions
4. Specify lighting and visual aesthetics
5. Include pacing and timing considerations
6. Add professional cinematography terminology
7. Ensure narrative flow and visual continuity
8. Optimize for engaging, high-quality video content
9. Consider the target video duration and format

Generate an optimized prompt that will produce a compelling, professional-quality video that authentically represents this AI influencer.
    `;

    // Use the imported OptimizedPromptSchema
    const result = await this.aiService.generateObject(prompt, OptimizedPromptSchema);
    return result as OptimizedPromptDto;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private mapImageIdeaToDto(idea: any): ImageIdeaDto {
    return {
      id: idea.id, // Use database ID instead of ideaId
      title: idea.title,
      description: idea.description,
      category: idea.category,
      visualElements: Array.isArray(idea.visualElements) ? idea.visualElements : [],
      mood: idea.mood,
      setting: idea.setting,
      styleNotes: idea.styleNotes,
      isUsed: idea.isUsed,
      createdAt: idea.createdAt.toISOString(),
      updatedAt: idea.updatedAt.toISOString(),
    };
  }

  private mapVideoIdeaToDto(idea: any): VideoIdeaDto {
    return {
      id: idea.id, // Use database ID instead of ideaId
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
      updatedAt: idea.updatedAt.toISOString(),
    };
  }
}
