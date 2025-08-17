import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InfluencerService } from './influencer.service';
import {
  CreateAIInfluencerDto,
  UpdateAIInfluencerDto,
  GenerateImageDto,
  GenerateVideoDto,
  AIInfluencerResponseDto,
  VideoIdeaDto,
  ImageType,
} from './dto/influencer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { RequestUser } from '../auth/dto/request-user.dto';

@ApiTags('AI Influencers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/influencers')
export class InfluencerController {
  constructor(private readonly influencerService: InfluencerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new AI influencer' })
  @ApiResponse({
    status: 201,
    description: 'AI influencer created successfully',
    type: AIInfluencerResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createInfluencer(
    @Body() createInfluencerDto: CreateAIInfluencerDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.influencerService.createInfluencer(createInfluencerDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all AI influencers for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of AI influencers',
    type: [AIInfluencerResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getInfluencers(@CurrentUser() user: RequestUser) {
    return this.influencerService.getInfluencers(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific AI influencer by ID' })
  @ApiParam({ name: 'id', description: 'AI Influencer ID' })
  @ApiResponse({
    status: 200,
    description: 'AI influencer details',
    type: AIInfluencerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'AI influencer not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getInfluencer(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.influencerService.getInfluencer(id, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an AI influencer' })
  @ApiParam({ name: 'id', description: 'AI Influencer ID' })
  @ApiResponse({
    status: 200,
    description: 'AI influencer updated successfully',
    type: AIInfluencerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'AI influencer not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateInfluencer(
    @Param('id') id: string,
    @Body() updateInfluencerDto: UpdateAIInfluencerDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.influencerService.updateInfluencer(id, updateInfluencerDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an AI influencer' })
  @ApiParam({ name: 'id', description: 'AI Influencer ID' })
  @ApiResponse({ status: 200, description: 'AI influencer deleted successfully' })
  @ApiResponse({ status: 404, description: 'AI influencer not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteInfluencer(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.influencerService.deleteInfluencer(id, user);
  }

  @Get(':id/image-prompt')
  @ApiOperation({ summary: 'Generate image prompt for AI influencer' })
  @ApiParam({ name: 'id', description: 'AI Influencer ID' })
  @ApiQuery({ 
    name: 'imageType', 
    enum: ImageType, 
    description: 'Type of image to generate prompt for' 
  })
  @ApiResponse({ status: 200, description: 'Generated image prompt' })
  @ApiResponse({ status: 404, description: 'AI influencer not found' })
  async generateImagePrompt(
    @Param('id') id: string,
    @Query('imageType') imageType: ImageType,
    @CurrentUser() user: RequestUser,
  ) {
    return this.influencerService.generateImagePrompt(id, imageType, user);
  }

  @Post(':id/generate-image')
  @ApiOperation({ summary: 'Generate an image for AI influencer' })
  @ApiParam({ name: 'id', description: 'AI Influencer ID' })
  @ApiResponse({ status: 201, description: 'Image generation started' })
  @ApiResponse({ status: 404, description: 'AI influencer not found' })
  async generateImage(
    @Param('id') id: string,
    @Body() generateImageDto: Omit<GenerateImageDto, 'influencerId'>,
    @CurrentUser() user: RequestUser,
  ) {
    return this.influencerService.generateImage(
      { ...generateImageDto, influencerId: id },
      user,
    );
  }

  @Get(':id/video-ideas')
  @ApiOperation({ summary: 'Generate video ideas for AI influencer' })
  @ApiParam({ name: 'id', description: 'AI Influencer ID' })
  @ApiResponse({
    status: 200,
    description: 'List of video ideas',
    type: [VideoIdeaDto],
  })
  @ApiResponse({ status: 404, description: 'AI influencer not found' })
  async generateVideoIdeas(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.influencerService.generateVideoIdeas(id, user);
  }

  @Post(':id/generate-video')
  @ApiOperation({ summary: 'Generate a video for AI influencer' })
  @ApiParam({ name: 'id', description: 'AI Influencer ID' })
  @ApiResponse({ status: 201, description: 'Video generation started' })
  @ApiResponse({ status: 404, description: 'AI influencer not found' })
  async generateVideo(
    @Param('id') id: string,
    @Body() generateVideoDto: Omit<GenerateVideoDto, 'influencerId'>,
    @CurrentUser() user: RequestUser,
  ) {
    return this.influencerService.generateVideo(
      { ...generateVideoDto, influencerId: id },
      user,
    );
  }

  @Get('video/:videoId/status')
  @ApiOperation({ summary: 'Get video generation status' })
  @ApiParam({ name: 'videoId', description: 'Video ID' })
  @ApiResponse({ status: 200, description: 'Video status information' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async getVideoStatus(
    @Param('videoId') videoId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.influencerService.getVideoStatus(videoId, user);
  }

  @Get('video/:videoId/stream')
  @ApiOperation({ summary: 'Stream video generation progress' })
  @ApiParam({ name: 'videoId', description: 'Video ID' })
  @ApiResponse({ status: 200, description: 'Server-sent events stream' })
  async streamVideoProgress(
    @Param('videoId') videoId: string,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ) {
    return this.influencerService.streamVideoProgress(videoId, user, res);
  }
}
