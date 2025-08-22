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
  CreateImageIdeaDto,
  CreateVideoIdeaDto,
  UpdateImageIdeaDto,
  UpdateVideoIdeaDto,
  GenerateImageFromIdeaDto,
  GenerateVideoFromIdeaDto,
  AnalyzeImageForIdeaDto,
  PaginationQueryDto,
  PaginatedResponseDto,
  AIInfluencerResponseDto,
  ImageIdeaDto,
  VideoIdeaDto,
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
  async createInfluencer(@Body() createInfluencerDto: CreateAIInfluencerDto, @CurrentUser() user: RequestUser) {
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
  // IMAGE IDEA MANAGEMENT
  // ============================================================================

  @Post(':id/image-ideas')
  @ApiOperation({ summary: 'Create a new image idea for an AI influencer' })
  @ApiResponse({ status: 201, description: 'Image idea created successfully', type: ImageIdeaDto })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async createImageIdea(
    @Param('id') influencerId: string,
    @Body() createDto: CreateImageIdeaDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Creating image idea for influencer ${influencerId}`);
    return await this.influencerService.createImageIdea(influencerId, createDto, user);
  }

  @Post(':id/image-ideas/analyze')
  @ApiOperation({ summary: 'Analyze uploaded image to suggest idea details' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to analyze',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to analyze',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 200, description: 'Image analyzed successfully', type: AnalyzeImageForIdeaDto })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async analyzeImageForIdea(
    @Param('id') influencerId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Analyzing image for idea generation for influencer ${influencerId}`);
    return await this.influencerService.analyzeImageForIdea(influencerId, file, user);
  }

  @Get(':id/image-ideas')
  @ApiOperation({ summary: 'Get image ideas for an AI influencer with pagination' })
  @ApiResponse({ status: 200, description: 'Image ideas retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async getImageIdeas(
    @Param('id') influencerId: string,
    @Query() query: PaginationQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaginatedResponseDto<ImageIdeaDto>> {
    this.logger.log(`Retrieving image ideas for influencer ${influencerId}`);
    return await this.influencerService.getImageIdeas(influencerId, query, user);
  }

  @Put(':id/image-ideas/:ideaId')
  @ApiOperation({ summary: 'Update an image idea' })
  @ApiResponse({ status: 200, description: 'Image idea updated successfully', type: ImageIdeaDto })
  @ApiResponse({ status: 404, description: 'Influencer or idea not found' })
  async updateImageIdea(
    @Param('id') influencerId: string,
    @Param('ideaId') ideaId: string,
    @Body() updateDto: UpdateImageIdeaDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Updating image idea ${ideaId} for influencer ${influencerId}`);
    return await this.influencerService.updateImageIdea(influencerId, ideaId, updateDto, user);
  }

  @Delete(':id/image-ideas/:ideaId')
  @ApiOperation({ summary: 'Delete an image idea' })
  @ApiResponse({ status: 200, description: 'Image idea deleted successfully' })
  @ApiResponse({ status: 404, description: 'Influencer or idea not found' })
  async deleteImageIdea(
    @Param('id') influencerId: string,
    @Param('ideaId') ideaId: string,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Deleting image idea ${ideaId} for influencer ${influencerId}`);
    return await this.influencerService.deleteImageIdea(influencerId, ideaId, user);
  }

  @Post(':id/generate-image')
  @ApiOperation({ summary: 'Generate image from an idea using Gemini Imagen' })
  @ApiResponse({ status: 201, description: 'Image generation started successfully' })
  @ApiResponse({ status: 404, description: 'Influencer or idea not found' })
  async generateImageFromIdea(
    @Param('id') influencerId: string,
    @Body() generateDto: GenerateImageFromIdeaDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Generating image from idea for influencer ${influencerId}`);
    return await this.influencerService.generateImageFromIdea(influencerId, generateDto, user);
  }

  @Post(':id/generate-prompt')
  @ApiOperation({ summary: 'Generate optimized AI prompt for image generation' })
  @ApiResponse({ status: 200, description: 'Optimized prompt generated successfully' })
  @ApiResponse({ status: 404, description: 'Influencer or idea not found' })
  async generateImagePrompt(
    @Param('id') influencerId: string,
    @Body() body: { imageIdeaId: string; imageType: string; customInstructions?: string },
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Generating optimized prompt for influencer ${influencerId}`);
    return await this.influencerService.generateImagePrompt(influencerId, body, user);
  }

  @Get('diagnose')
  @ApiOperation({ summary: 'Diagnose image generation configuration and connectivity' })
  @ApiResponse({ status: 200, description: 'Diagnostic information' })
  async diagnoseImageGeneration() {
    this.logger.log('Running image generation diagnostics');
    return await this.influencerService.diagnoseImageGeneration();
  }

  @Delete(':id/images/:imageId')
  @ApiOperation({ summary: 'Delete a generated image' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Influencer or image not found' })
  async deleteImage(
    @Param('id') influencerId: string,
    @Param('imageId') imageId: string,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Deleting image ${imageId} for influencer ${influencerId}`);
    return await this.influencerService.deleteImage(influencerId, imageId, user);
  }

  // ============================================================================
  // VIDEO IDEA MANAGEMENT
  // ============================================================================

  @Post(':id/video-ideas')
  @ApiOperation({ summary: 'Create a new video idea for an AI influencer' })
  @ApiResponse({ status: 201, description: 'Video idea created successfully', type: VideoIdeaDto })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async createVideoIdea(
    @Param('id') influencerId: string,
    @Body() createDto: CreateVideoIdeaDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Creating video idea for influencer ${influencerId}`);
    return await this.influencerService.createVideoIdea(influencerId, createDto, user);
  }

  @Get(':id/video-ideas')
  @ApiOperation({ summary: 'Get video ideas for an AI influencer with pagination' })
  @ApiResponse({ status: 200, description: 'Video ideas retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Influencer not found' })
  async getVideoIdeas(
    @Param('id') influencerId: string,
    @Query() query: PaginationQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<PaginatedResponseDto<VideoIdeaDto>> {
    this.logger.log(`Retrieving video ideas for influencer ${influencerId}`);
    return await this.influencerService.getVideoIdeas(influencerId, query, user);
  }

  @Put(':id/video-ideas/:ideaId')
  @ApiOperation({ summary: 'Update a video idea' })
  @ApiResponse({ status: 200, description: 'Video idea updated successfully', type: VideoIdeaDto })
  @ApiResponse({ status: 404, description: 'Influencer or idea not found' })
  async updateVideoIdea(
    @Param('id') influencerId: string,
    @Param('ideaId') ideaId: string,
    @Body() updateDto: UpdateVideoIdeaDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Updating video idea ${ideaId} for influencer ${influencerId}`);
    return await this.influencerService.updateVideoIdea(influencerId, ideaId, updateDto, user);
  }

  @Delete(':id/video-ideas/:ideaId')
  @ApiOperation({ summary: 'Delete a video idea' })
  @ApiResponse({ status: 200, description: 'Video idea deleted successfully' })
  @ApiResponse({ status: 404, description: 'Influencer or idea not found' })
  async deleteVideoIdea(
    @Param('id') influencerId: string,
    @Param('ideaId') ideaId: string,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Deleting video idea ${ideaId} for influencer ${influencerId}`);
    return await this.influencerService.deleteVideoIdea(influencerId, ideaId, user);
  }

  @Post(':id/generate-video')
  @ApiOperation({ summary: 'Generate video from an idea using Veo3' })
  @ApiResponse({ status: 201, description: 'Video generation started successfully' })
  @ApiResponse({ status: 404, description: 'Influencer or idea not found' })
  async generateVideoFromIdea(
    @Param('id') influencerId: string,
    @Body() generateDto: GenerateVideoFromIdeaDto,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Generating video from idea for influencer ${influencerId}`);
    return await this.influencerService.generateVideoFromIdea(influencerId, generateDto, user);
  }

  @Get(':id/videos/:videoId/status')
  @ApiOperation({ summary: 'Check video generation status' })
  @ApiResponse({ status: 200, description: 'Video status retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async checkVideoStatus(
    @Param('id') influencerId: string,
    @Param('videoId') videoId: string,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Checking video generation status for video ${videoId}`);
    return await this.influencerService.checkVideoGenerationStatus(videoId, user);
  }

  // ============================================================================
  // LEGACY ENDPOINTS (for backward compatibility)
  // ============================================================================

  @Post(':id/legacy/image-prompt/:imageType')
  @ApiOperation({ summary: 'Legacy: Generate image prompt (for backward compatibility)' })
  @ApiResponse({ status: 200, description: 'Legacy prompt generated successfully' })
  async generateLegacyImagePrompt(
    @Param('id') influencerId: string,
    @Param('imageType') imageType: string,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Generating legacy image prompt for influencer ${influencerId}, type: ${imageType}`);

    // Create a simple prompt based on influencer data
    const influencer = await this.influencerService.getInfluencer(influencerId, user);
    if (!influencer) {
      return { error: { message: 'Influencer not found' } };
    }

    const prompt = `Create a high-quality ${imageType} image of ${influencer.name}, a ${influencer.age}-year-old AI influencer with ${influencer.hairColor} hair and ${influencer.eyeColor} eyes. Style: ${influencer.styleAesthetic}. Professional photography, high resolution, realistic.`;

    return {
      data: {
        prompt,
        reasoning: 'Generated from influencer characteristics',
        technicalNotes: 'Legacy endpoint - consider using new idea-based generation',
        alternativePrompts: [prompt],
      },
    };
  }

  @Post(':id/legacy/generate-image')
  @ApiOperation({ summary: 'Legacy: Generate image (for backward compatibility)' })
  @ApiResponse({ status: 201, description: 'Legacy image generation started' })
  async generateLegacyImage(@Param('id') influencerId: string, @Body() body: any, @CurrentUser() user: RequestUser) {
    this.logger.log(`Legacy image generation for influencer ${influencerId}`);

    // For legacy compatibility, create a temporary idea and generate from it
    const tempIdea = await this.influencerService.createImageIdea(
      influencerId,
      {
        title: `Legacy ${body.imageType} Image`,
        description: body.customPrompt || `Generated ${body.imageType} image`,
        category: body.imageType,
      },
      user,
    );

    return await this.influencerService.generateImageFromIdea(
      influencerId,
      {
        imageIdeaId: tempIdea.id,
        imageType: body.imageType,
        customPrompt: body.customPrompt,
        isReference: body.isReference,
      },
      user,
    );
  }

  @Post(':id/legacy/generate-video')
  @ApiOperation({ summary: 'Legacy: Generate video (for backward compatibility)' })
  @ApiResponse({ status: 201, description: 'Legacy video generation started' })
  async generateLegacyVideo(@Param('id') influencerId: string, @Body() body: any, @CurrentUser() user: RequestUser) {
    this.logger.log(`Legacy video generation for influencer ${influencerId}`);

    // For legacy compatibility, create a temporary idea and generate from it
    const tempIdea = await this.influencerService.createVideoIdea(
      influencerId,
      {
        title: body.title,
        description: body.description || body.title,
        scenario: body.scenario,
        category: 'Custom',
      },
      user,
    );

    return await this.influencerService.generateVideoFromIdea(
      influencerId,
      {
        videoIdeaId: tempIdea.id,
        customPrompt: body.customPrompt,
        duration: body.duration,
      },
      user,
    );
  }

  @Get(':id/legacy/video-ideas')
  @ApiOperation({ summary: 'Legacy: Get video ideas (for backward compatibility)' })
  @ApiResponse({ status: 200, description: 'Legacy video ideas retrieved' })
  async getLegacyVideoIdeas(@Param('id') influencerId: string, @CurrentUser() user: RequestUser) {
    this.logger.log(`Legacy video ideas retrieval for influencer ${influencerId}`);

    const result = await this.influencerService.getVideoIdeas(influencerId, { page: 1, limit: 50 }, user);

    // Transform to legacy format
    return result.items.map((idea) => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      category: idea.category,
      scenario: idea.scenario,
      keyMoments: idea.keyMoments,
      estimatedDuration: idea.duration,
    }));
  }

  @Get(':id/legacy/video-status/:videoId')
  @ApiOperation({ summary: 'Legacy: Check video status (for backward compatibility)' })
  @ApiResponse({ status: 200, description: 'Legacy video status retrieved' })
  async getLegacyVideoStatus(
    @Param('id') influencerId: string,
    @Param('videoId') videoId: string,
    @CurrentUser() user: RequestUser,
  ) {
    this.logger.log(`Legacy video status check for video ${videoId}`);
    return await this.influencerService.checkVideoGenerationStatus(videoId, user);
  }
}
