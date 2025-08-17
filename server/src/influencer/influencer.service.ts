import { Injectable, Logger, NotFoundException, BadRequestException, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateAIInfluencerDto, 
  UpdateAIInfluencerDto, 
  GenerateImageDto, 
  GenerateVideoDto,
  VideoIdeaDto,
  ImageType,
  VideoStatus 
} from './dto/influencer.dto';
import { RequestUser } from '../auth/dto/request-user.dto';

@Injectable()
export class InfluencerService {
  private readonly logger = new Logger(InfluencerService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createInfluencer(
    createInfluencerDto: CreateAIInfluencerDto,
    user: RequestUser,
  ) {
    try {
      const influencer = await this.prismaService.aIInfluencer.create({
        data: {
          ...createInfluencerDto,
          userId: user.id,
        },
        include: {
          images: true,
          videos: true,
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
          OR: [
            { userId: user.id },
            { isDefault: true },
          ],
          isActive: true,
        },
        include: {
          images: {
            orderBy: { createdAt: 'desc' },
          },
          videos: {
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
          OR: [
            { userId: user.id },
            { isDefault: true },
          ],
          isActive: true,
        },
        include: {
          images: {
            orderBy: { createdAt: 'desc' },
          },
          videos: {
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

  async updateInfluencer(
    id: string,
    updateInfluencerDto: UpdateAIInfluencerDto,
    user: RequestUser,
  ) {
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

  async generateImagePrompt(influencerId: string, imageType: ImageType, user: RequestUser) {
    try {
      const influencer = await this.getInfluencer(influencerId, user);
      
      // Build the prompt based on the influencer's characteristics
      const prompt = this.buildImagePrompt(influencer, imageType);
      
      return {
        prompt,
        influencer: {
          id: influencer.id,
          name: influencer.name,
        },
        imageType,
      };
    } catch (error) {
      this.logger.error(`Failed to generate image prompt: ${error.message}`, error);
      throw error;
    }
  }

  async generateImage(generateImageDto: GenerateImageDto, user: RequestUser) {
    try {
      const influencer = await this.getInfluencer(generateImageDto.influencerId, user);
      
      // Generate the prompt if not provided
      const prompt = generateImageDto.customPrompt || 
        this.buildImagePrompt(influencer, generateImageDto.imageType);

      // Here you would integrate with Google's Imagen API
      // For now, we'll create a placeholder image record
      const imageRecord = await this.prismaService.influencerImage.create({
        data: {
          influencerId: generateImageDto.influencerId,
          imageUrl: '/api/placeholder/512/512', // Placeholder until real generation
          imageType: generateImageDto.imageType,
          prompt,
          isReference: generateImageDto.isReference || false,
          metadata: {
            generatedAt: new Date().toISOString(),
            model: 'imagen2',
          },
        },
      });

      this.logger.log(`Image generated for influencer ${generateImageDto.influencerId}`);
      return imageRecord;
    } catch (error) {
      this.logger.error(`Failed to generate image: ${error.message}`, error);
      throw new BadRequestException('Failed to generate image');
    }
  }

  async generateVideoIdeas(influencerId: string, user: RequestUser): Promise<VideoIdeaDto[]> {
    try {
      const influencer = await this.getInfluencer(influencerId, user);
      
      // Generate 20 video ideas based on the influencer's characteristics
      const ideas: VideoIdeaDto[] = [
        {
          id: '1',
          title: 'Morning Skincare Routine',
          description: `${influencer.name} shares her morning skincare routine in a luxurious bathroom setting`,
          scenario: 'Luxury bathroom with marble countertops, performing skincare routine',
          estimatedDuration: 30,
          category: 'beauty',
        },
        {
          id: '2',
          title: 'Dancing in Bedroom',
          description: `${influencer.name} dances energetically to upbeat music in her modern bedroom`,
          scenario: 'Modern bedroom with natural lighting, dancing to music',
          estimatedDuration: 25,
          category: 'dance',
        },
        {
          id: '3',
          title: 'Cooking Healthy Breakfast',
          description: `${influencer.name} prepares a healthy breakfast in a stunning kitchen`,
          scenario: 'Modern kitchen with quartz countertops, cooking breakfast',
          estimatedDuration: 35,
          category: 'cooking',
        },
        {
          id: '4',
          title: 'Workout Session',
          description: `${influencer.name} demonstrates her fitness routine in a home gym`,
          scenario: 'Home gym with mirrors and equipment, working out',
          estimatedDuration: 40,
          category: 'fitness',
        },
        {
          id: '5',
          title: 'Fashion Outfit Change',
          description: `${influencer.name} shows different outfit combinations`,
          scenario: 'Walk-in closet or bedroom, trying on different outfits',
          estimatedDuration: 20,
          category: 'fashion',
        },
        // Add more ideas...
        {
          id: '6',
          title: 'Reading in Living Room',
          description: `${influencer.name} enjoys a peaceful reading session during golden hour`,
          scenario: 'Elegant living room with natural lighting, reading a book',
          estimatedDuration: 25,
          category: 'lifestyle',
        },
        {
          id: '7',
          title: 'Coffee Making Ritual',
          description: `${influencer.name} demonstrates her perfect coffee brewing technique`,
          scenario: 'Modern kitchen, making specialty coffee',
          estimatedDuration: 20,
          category: 'lifestyle',
        },
        {
          id: '8',
          title: 'Evening Wind Down',
          description: `${influencer.name} shows her relaxing evening routine`,
          scenario: 'Bedroom or living room, evening relaxation activities',
          estimatedDuration: 30,
          category: 'lifestyle',
        },
        {
          id: '9',
          title: 'Yoga Session',
          description: `${influencer.name} practices yoga in a serene setting`,
          scenario: 'Bright room with yoga mat, performing yoga poses',
          estimatedDuration: 35,
          category: 'fitness',
        },
        {
          id: '10',
          title: 'Makeup Tutorial',
          description: `${influencer.name} creates a stunning makeup look`,
          scenario: 'Vanity area with good lighting, applying makeup',
          estimatedDuration: 40,
          category: 'beauty',
        },
        // Continue with more creative ideas...
        {
          id: '11',
          title: 'Plant Care Routine',
          description: `${influencer.name} tends to her indoor garden`,
          scenario: 'Room with plants, watering and caring for plants',
          estimatedDuration: 25,
          category: 'lifestyle',
        },
        {
          id: '12',
          title: 'Jewelry Collection',
          description: `${influencer.name} showcases her favorite jewelry pieces`,
          scenario: 'Vanity or dresser, displaying jewelry',
          estimatedDuration: 20,
          category: 'fashion',
        },
        {
          id: '13',
          title: 'Hair Styling Tutorial',
          description: `${influencer.name} creates different hairstyles`,
          scenario: 'Bathroom or vanity area, styling hair',
          estimatedDuration: 30,
          category: 'beauty',
        },
        {
          id: '14',
          title: 'Meditation Session',
          description: `${influencer.name} guides through a peaceful meditation`,
          scenario: 'Quiet room with natural light, meditating',
          estimatedDuration: 15,
          category: 'lifestyle',
        },
        {
          id: '15',
          title: 'Closet Organization',
          description: `${influencer.name} organizes her wardrobe efficiently`,
          scenario: 'Walk-in closet, organizing clothes and accessories',
          estimatedDuration: 35,
          category: 'lifestyle',
        },
        {
          id: '16',
          title: 'Healthy Smoothie Recipe',
          description: `${influencer.name} creates a nutritious smoothie`,
          scenario: 'Kitchen with blender and fresh ingredients',
          estimatedDuration: 15,
          category: 'cooking',
        },
        {
          id: '17',
          title: 'Desk Setup Tour',
          description: `${influencer.name} shows her perfect workspace setup`,
          scenario: 'Home office or desk area, showcasing organization',
          estimatedDuration: 20,
          category: 'lifestyle',
        },
        {
          id: '18',
          title: 'Stretching Routine',
          description: `${influencer.name} demonstrates daily stretching exercises`,
          scenario: 'Living room or gym area, performing stretches',
          estimatedDuration: 25,
          category: 'fitness',
        },
        {
          id: '19',
          title: 'Nighttime Skincare',
          description: `${influencer.name} shares her nighttime beauty routine`,
          scenario: 'Bathroom with soft lighting, nighttime skincare',
          estimatedDuration: 25,
          category: 'beauty',
        },
        {
          id: '20',
          title: 'Cozy Reading Nook',
          description: `${influencer.name} creates the perfect reading atmosphere`,
          scenario: 'Cozy corner with books and soft lighting',
          estimatedDuration: 20,
          category: 'lifestyle',
        },
      ];

      return ideas;
    } catch (error) {
      this.logger.error(`Failed to generate video ideas: ${error.message}`, error);
      throw new BadRequestException('Failed to generate video ideas');
    }
  }

  async generateVideo(generateVideoDto: GenerateVideoDto, user: RequestUser) {
    try {
      const influencer = await this.getInfluencer(generateVideoDto.influencerId, user);
      
      // Create video record with PENDING status
      const videoRecord = await this.prismaService.influencerVideo.create({
        data: {
          influencerId: generateVideoDto.influencerId,
          title: generateVideoDto.title,
          description: generateVideoDto.description,
          scenario: generateVideoDto.scenario,
          prompt: generateVideoDto.customPrompt || 
            this.buildVideoPrompt(influencer, generateVideoDto.scenario),
          duration: generateVideoDto.duration,
          status: VideoStatus.PENDING,
          metadata: {
            startedAt: new Date().toISOString(),
            model: 'veo3',
          },
        },
      });

      // Start video generation process (async)
      this.processVideoGeneration(videoRecord.id, influencer);

      this.logger.log(`Video generation started for influencer ${generateVideoDto.influencerId}`);
      return videoRecord;
    } catch (error) {
      this.logger.error(`Failed to start video generation: ${error.message}`, error);
      throw new BadRequestException('Failed to start video generation');
    }
  }

  async getVideoStatus(videoId: string, user: RequestUser) {
    try {
      const video = await this.prismaService.influencerVideo.findFirst({
        where: {
          id: videoId,
          influencer: {
            OR: [
              { userId: user.id },
              { isDefault: true },
            ],
          },
        },
        include: {
          influencer: true,
        },
      });

      if (!video) {
        throw new NotFoundException('Video not found');
      }

      return video;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to get video status: ${error.message}`, error);
      throw new BadRequestException('Failed to get video status');
    }
  }

  async streamVideoProgress(videoId: string, user: RequestUser, res: Response) {
    try {
      // First verify the video exists and user has access
      await this.getVideoStatus(videoId, user);
      
      // Set SSE headers
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      });

      let progress = 0;
      let completed = false;

      const sendUpdate = (step: string, progressValue: number, message: string, isComplete = false, error?: string) => {
        const data = JSON.stringify({
          step,
          progress: progressValue,
          message,
          isComplete,
          error,
        });
        
        res.write(`data: ${data}\n\n`);
        
        if (isComplete || error) {
          completed = true;
          res.end();
        }
      };

      const pollStatus = async () => {
        try {
          const video = await this.prismaService.influencerVideo.findUnique({
            where: { id: videoId },
          });

          if (!video) {
            sendUpdate('Error', 0, 'Video not found', true, 'Video not found');
            return;
          }

          switch (video.status) {
            case 'PENDING':
              progress = Math.min(progress + 5, 20);
              sendUpdate('Initializing', progress, 'Preparing video generation...');
              break;
            case 'GENERATING':
              progress = Math.min(progress + 10, 90);
              if (progress < 30) {
                sendUpdate('Analyzing', progress, 'Analyzing character features...');
              } else if (progress < 60) {
                sendUpdate('Composing', progress, 'Generating scene composition...');
              } else {
                sendUpdate('Rendering', progress, 'Creating video with Veo3...');
              }
              break;
            case 'COMPLETED':
              sendUpdate('Completed', 100, 'Video generation completed!', true);
              return;
            case 'FAILED':
              sendUpdate('Failed', progress, 'Video generation failed', true, 'Generation failed');
              return;
          }

          if (!completed) {
            setTimeout(pollStatus, 2000); // Poll every 2 seconds
          }
        } catch (error) {
          this.logger.error(`Error in progress stream: ${error.message}`, error);
          sendUpdate('Error', progress, 'An error occurred', true, error.message);
        }
      };

      // Handle client disconnect
      res.on('close', () => {
        completed = true;
        this.logger.log(`Client disconnected from video progress stream: ${videoId}`);
      });

      // Start polling
      pollStatus();
    } catch (error) {
      this.logger.error(`Failed to create progress stream: ${error.message}`, error);
      throw error;
    }
  }

  private buildImagePrompt(influencer: any, imageType: ImageType): string {
    const baseDescription = this.buildCharacterDescription(influencer);
    
    const typeSpecificPrompts = {
      [ImageType.PORTRAIT]: `Close-up portrait photograph of ${baseDescription}. Soft natural lighting from 45-degree angle, neutral background, professional photography style.`,
      [ImageType.FULL_BODY]: `Full body portrait photograph of ${baseDescription}. Standing pose, professional lighting, studio setting.`,
      [ImageType.BEAUTY_SHOT]: `Beauty close-up of ${baseDescription}. Focus on facial features, soft beauty lighting, minimal makeup.`,
      [ImageType.LIFESTYLE]: `Lifestyle portrait of ${baseDescription}. Natural candid expression, environmental setting, natural lighting.`,
      [ImageType.REFERENCE]: `Reference image of ${baseDescription}. Multiple angles, consistent lighting, character sheet style.`,
    };

    const qualityModifiers = `Technical specifications: 8K resolution, professional photography, sharp focus, detailed skin texture, realistic lighting, color graded, shot on Canon EOS R5, 85mm f/1.4 lens, perfect exposure, photorealistic, hyperrealistic.`;
    
    const negativePrompt = `Negative prompt: cartoon, anime, illustration, painting, drawing, art, sketch, (worst quality:2), (low quality:2), blurry, bad anatomy, bad proportions.`;

    return `${typeSpecificPrompts[imageType]} ${qualityModifiers} ${negativePrompt}`;
  }

  private buildVideoPrompt(influencer: any, scenario: string): string {
    const characterDescription = this.buildCharacterDescription(influencer);
    
    return `${characterDescription} ${scenario}. High quality video, 4K resolution, smooth camera movement, professional lighting, realistic movement, cinematic style.`;
  }

  private buildCharacterDescription(influencer: any): string {
    const parts: string[] = [];
    
    if (influencer.age) parts.push(`${influencer.age}-year-old`);
    if (influencer.primaryEthnicity) parts.push(influencer.primaryEthnicity);
    parts.push('woman');
    
    if (influencer.faceShape) parts.push(`with ${influencer.faceShape} face shape`);
    if (influencer.eyeColor && influencer.eyeShape) {
      parts.push(`${influencer.eyeShape} ${influencer.eyeColor} eyes`);
    }
    if (influencer.hairColor && influencer.hairTexture && influencer.hairLength) {
      parts.push(`${influencer.hairLength} ${influencer.hairColor} ${influencer.hairTexture} hair`);
    }
    if (influencer.height && influencer.overallBuild) {
      parts.push(`${influencer.height} tall with ${influencer.overallBuild} build`);
    }

    return parts.join(', ');
  }

  private async processVideoGeneration(videoId: string, influencer: any) {
    try {
      // Update status to GENERATING
      await this.prismaService.influencerVideo.update({
        where: { id: videoId },
        data: { 
          status: VideoStatus.GENERATING,
          metadata: {
            startedAt: new Date().toISOString(),
            model: 'veo3',
            status: 'generating',
          },
        },
      });

      // Simulate video generation process
      // In real implementation, this would call Veo3 API
      setTimeout(async () => {
        try {
          await this.prismaService.influencerVideo.update({
            where: { id: videoId },
            data: {
              status: VideoStatus.COMPLETED,
              videoUrl: '/api/placeholder/video.mp4', // Placeholder
              thumbnailUrl: '/api/placeholder/thumbnail.jpg',
              metadata: {
                startedAt: new Date().toISOString(),
                completedAt: new Date().toISOString(),
                model: 'veo3',
                status: 'completed',
              },
            },
          });
          this.logger.log(`Video generation completed for video ${videoId}`);
        } catch (error) {
          await this.prismaService.influencerVideo.update({
            where: { id: videoId },
            data: {
              status: VideoStatus.FAILED,
              metadata: {
                startedAt: new Date().toISOString(),
                failedAt: new Date().toISOString(),
                error: error.message,
                model: 'veo3',
                status: 'failed',
              },
            },
          });
          this.logger.error(`Video generation failed for video ${videoId}: ${error.message}`);
        }
      }, 30000); // 30 seconds simulation

    } catch (error) {
      this.logger.error(`Error in video generation process: ${error.message}`, error);
    }
  }
}
