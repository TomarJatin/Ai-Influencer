import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { InfluencerService } from './influencer.service';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { RequestUser } from '../auth/dto/request-user.dto';
import {
  CreateAIInfluencerDto,
  UpdateAIInfluencerDto,
  GenerateImageIdeasDto,
  GenerateVideoIdeasDto,
  GeneratePromptDto,
  UploadMediaDto,
  AIInfluencerResponseDto,
  ImageIdeaDto,
  VideoIdeaDto,
  OptimizedPromptDto,
} from './dto/influencer.dto';

@ApiTags('AI Influencers')
@ApiBearerAuth()
@Controller('api/influencers')
export class InfluencerController {
  private readonly logger = new Logger(InfluencerController.name);

  constructor(private readonly influencerService: InfluencerService) {}

  // ============================================================================
  // BASIC INFLUENCER CRUD OPERATIONS
  // ============================================================================

  @Post()
  @ApiOperation({ summary: 'Create a new AI influencer' })
  @ApiResponse({ status: 201, description: 'AI influencer created successfully', type: AIInfluencerResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createInfluencer(
    @Body() createInfluencerDto: CreateAIInfluencerDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Creating AI influencer for user ${user.id}`);
    return await this.influencerService.createInfluencer(createInfluencerDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all AI influencers for the current user' })
  @ApiResponse({ status: 200, description: 'Influencers retrieved successfully', type: [AIInfluencerResponseDto] })
  async getInfluencers(@CurrentUser() user: RequestUser) {
    this.logger.log(`Retrieving influencers for user ${user.id}`);
    return await this.influencerService.getInfluencers(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific AI influencer by ID' })
  @ApiResponse({ status: 200, description: 'Influencer retrieved successfully', type: AIInfluencerResponseDto })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async getInfluencer(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    this.logger.log(`Retrieving influencer ${id} for user ${user.id}`);
    return await this.influencerService.getInfluencer(id, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an AI influencer' })
  @ApiResponse({ status: 200, description: 'Influencer updated successfully', type: AIInfluencerResponseDto })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async updateInfluencer(
    @Param('id') id: string,
    @Body() updateInfluencerDto: UpdateAIInfluencerDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Updating influencer ${id} for user ${user.id}`);
    return await this.influencerService.updateInfluencer(id, updateInfluencerDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an AI influencer' })
  @ApiResponse({ status: 200, description: 'Influencer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async deleteInfluencer(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    this.logger.log(`Deleting influencer ${id} for user ${user.id}`);
    return await this.influencerService.deleteInfluencer(id, user);
  }

  // ============================================================================
  // IMAGE IDEA GENERATION AND MANAGEMENT
  // ============================================================================

  @Post(':id/image-ideas/generate')
  @ApiOperation({ summary: 'Generate new image ideas for an AI influencer' })
  @ApiResponse({ status: 201, description: 'Image ideas generated successfully', type: [ImageIdeaDto] })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async generateImageIdeas(
    @Param('id') influencerId: string,
    @Body() generateDto: GenerateImageIdeasDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Generating image ideas for influencer ${influencerId}`);
    return await this.influencerService.generateImageIdeas(influencerId, generateDto, user);
  }

  @Get(':id/image-ideas')
  @ApiOperation({ summary: 'Get all image ideas for an AI influencer' })
  @ApiResponse({ status: 200, description: 'Image ideas retrieved successfully', type: [ImageIdeaDto] })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async getImageIdeas(@Param('id') influencerId: string, @CurrentUser() user: RequestUser) {
    this.logger.log(`Retrieving image ideas for influencer ${influencerId}`);
    return await this.influencerService.getImageIdeas(influencerId, user);
  }

  @Post(':id/image-ideas/:ideaId/prompt')
  @ApiOperation({ summary: 'Generate optimized prompt for a specific image idea' })
  @ApiResponse({ status: 201, description: 'Optimized prompt generated successfully', type: OptimizedPromptDto })
  @ApiResponse({ status: 404, description: 'Influencer or idea not found' })
  async generateImagePrompt(
    @Param('id') influencerId: string,
    @Param('ideaId') ideaId: string,
    @Body() promptDto: GeneratePromptDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Generating image prompt for idea ${ideaId} of influencer ${influencerId}`);
    return await this.influencerService.generateImagePrompt(influencerId, ideaId, promptDto, user);
  }

  @Post(':id/image-ideas/:ideaId/upload')
  @ApiOperation({ summary: 'Upload generated image for a specific idea' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        generatedPrompt: {
          type: 'string',
          description: 'The prompt used to generate this image',
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 404, description: 'Influencer or idea not found' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') influencerId: string,
    @Param('ideaId') ideaId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadMediaDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Uploading image for idea ${ideaId} of influencer ${influencerId}`);
    return await this.influencerService.uploadImage(influencerId, ideaId, file, uploadDto, user);
  }

  // ============================================================================
  // VIDEO IDEA GENERATION AND MANAGEMENT
  // ============================================================================

  @Post(':id/video-ideas/generate')
  @ApiOperation({ summary: 'Generate new video ideas for an AI influencer' })
  @ApiResponse({ status: 201, description: 'Video ideas generated successfully', type: [VideoIdeaDto] })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async generateVideoIdeas(
    @Param('id') influencerId: string,
    @Body() generateDto: GenerateVideoIdeasDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Generating video ideas for influencer ${influencerId}`);
    return await this.influencerService.generateVideoIdeas(influencerId, generateDto, user);
  }

  @Get(':id/video-ideas')
  @ApiOperation({ summary: 'Get all video ideas for an AI influencer' })
  @ApiResponse({ status: 200, description: 'Video ideas retrieved successfully', type: [VideoIdeaDto] })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async getVideoIdeas(@Param('id') influencerId: string, @CurrentUser() user: RequestUser) {
    this.logger.log(`Retrieving video ideas for influencer ${influencerId}`);
    return await this.influencerService.getVideoIdeas(influencerId, user);
  }

  @Post(':id/video-ideas/:ideaId/prompt')
  @ApiOperation({ summary: 'Generate optimized prompt for a specific video idea' })
  @ApiResponse({ status: 201, description: 'Optimized prompt generated successfully', type: OptimizedPromptDto })
  @ApiResponse({ status: 404, description: 'Influencer or idea not found' })
  async generateVideoPrompt(
    @Param('id') influencerId: string,
    @Param('ideaId') ideaId: string,
    @Body() promptDto: GeneratePromptDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Generating video prompt for idea ${ideaId} of influencer ${influencerId}`);
    return await this.influencerService.generateVideoPrompt(influencerId, ideaId, promptDto, user);
  }

  @Post(':id/video-ideas/:ideaId/upload')
  @ApiOperation({ summary: 'Upload generated video for a specific idea' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        generatedPrompt: {
          type: 'string',
          description: 'The prompt used to generate this video',
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Video uploaded successfully' })
  @ApiResponse({ status: 404, description: 'Influencer or idea not found' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @Param('id') influencerId: string,
    @Param('ideaId') ideaId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadMediaDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Uploading video for idea ${ideaId} of influencer ${influencerId}`);
    return await this.influencerService.uploadVideo(influencerId, ideaId, file, uploadDto, user);
  }

  // ============================================================================
  // LEGACY ENDPOINTS (Deprecated but kept for backward compatibility)
  // ============================================================================

  @Get(':id/image-prompt')
  @ApiOperation({ 
    summary: 'Generate image prompt (Legacy)', 
    deprecated: true,
    description: 'Use POST /api/influencers/:id/image-ideas/:ideaId/prompt instead'
  })
  @ApiResponse({ status: 200, description: 'Image prompt generated' })
  async generateImagePromptLegacy(
    @Param('id') influencerId: string,
    @Query('imageType') imageType: string,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.warn(`Using deprecated image prompt endpoint for influencer ${influencerId}`);
    // Return a simple prompt for backward compatibility
    const influencer = await this.influencerService.getInfluencer(influencerId, user);
    return {
      prompt: `Generate a ${imageType} image of ${influencer.name}`,
      influencer: { id: influencer.id, name: influencer.name },
      imageType,
    };
  }

  @Get(':id/video-ideas')
  @ApiOperation({ 
    summary: 'Generate video ideas (Legacy)', 
    deprecated: true,
    description: 'Use POST /api/influencers/:id/video-ideas/generate instead'
  })
  @ApiResponse({ status: 200, description: 'Video ideas generated' })
  async generateVideoIdeasLegacy(@Param('id') influencerId: string, @CurrentUser() user: RequestUser) {
    this.logger.warn(`Using deprecated video ideas endpoint for influencer ${influencerId}`);
    // Generate ideas using the new method but return in legacy format
    const ideas = await this.influencerService.generateVideoIdeas(influencerId, { count: 5 }, user);
    
    // Convert to legacy format
    return ideas.map(idea => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      scenario: idea.scenario,
      estimatedDuration: 30, // Default duration
      category: idea.category,
    }));
  }
}