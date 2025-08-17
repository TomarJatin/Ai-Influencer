import { ApiClient } from '@/lib/api-client';
import { 
  AIInfluencer, 
  CreateAIInfluencerDto, 
  UpdateAIInfluencerDto,
  ImageGenerationRequest,
  VideoGenerationRequest,
  VideoIdea,
  GenerationProgress,
  InfluencerVideo
} from '@/types';

export class InfluencerService {
  /**
   * Create a new AI influencer
   */
  static async createInfluencer(data: CreateAIInfluencerDto) {
    return await ApiClient.post<AIInfluencer>('/api/influencers', data);
  }

  /**
   * Get all AI influencers for the current user
   */
  static async getInfluencers() {
    return await ApiClient.get<AIInfluencer[]>('/api/influencers');
  }

  /**
   * Get a specific AI influencer by ID
   */
  static async getInfluencer(id: string) {
    return await ApiClient.get<AIInfluencer>(`/api/influencers/${id}`);
  }

  /**
   * Update an AI influencer
   */
  static async updateInfluencer(id: string, data: UpdateAIInfluencerDto) {
    return await ApiClient.put<AIInfluencer>(`/api/influencers/${id}`, data);
  }

  /**
   * Delete an AI influencer
   */
  static async deleteInfluencer(id: string) {
    return await ApiClient.delete<{ success: boolean; message: string }>(`/api/influencers/${id}`);
  }

  /**
   * Generate image prompt for AI influencer
   */
  static async generateImagePrompt(influencerId: string, imageType: string) {
    return await ApiClient.get<{
      prompt: string;
      influencer: { id: string; name: string };
      imageType: string;
    }>(`/api/influencers/${influencerId}/image-prompt?imageType=${imageType}`);
  }

  /**
   * Generate an image for AI influencer
   */
  static async generateImage(request: ImageGenerationRequest) {
    return await ApiClient.post<{
      id: string;
      imageUrl: string;
      prompt: string;
      imageType: string;
    }>(`/api/influencers/${request.influencerId}/generate-image`, {
      imageType: request.imageType,
      customPrompt: request.customPrompt,
      isReference: false,
    });
  }

  /**
   * Generate video ideas for AI influencer
   */
  static async generateVideoIdeas(influencerId: string) {
    return await ApiClient.get<VideoIdea[]>(`/api/influencers/${influencerId}/video-ideas`);
  }

  /**
   * Generate a video for AI influencer
   */
  static async generateVideo(request: VideoGenerationRequest) {
    return await ApiClient.post<InfluencerVideo>(`/api/influencers/${request.influencerId}/generate-video`, {
      title: request.title,
      description: request.description,
      scenario: request.scenario,
      customPrompt: request.customPrompt,
    });
  }

  /**
   * Get video generation status
   */
  static async getVideoStatus(videoId: string) {
    return await ApiClient.get<InfluencerVideo>(`/api/influencers/video/${videoId}/status`);
  }

  /**
   * Stream video generation progress (Server-Sent Events)
   */
  static async streamVideoProgress(videoId: string, onProgress: (progress: GenerationProgress) => void) {
    const eventSource = new EventSource(`/api/influencers/video/${videoId}/stream`);
    
    eventSource.onmessage = (event) => {
      try {
        const progress: GenerationProgress = JSON.parse(event.data);
        onProgress(progress);
        
        if (progress.isComplete || progress.error) {
          eventSource.close();
        }
      } catch (error) {
        console.error('Error parsing progress data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
      onProgress({
        step: 'Error',
        progress: 0,
        message: 'Connection error occurred',
        isComplete: true,
        error: 'Connection failed',
      });
    };

    return eventSource;
  }

  /**
   * Poll video status until completion
   */
  static async pollVideoStatus(
    videoId: string, 
    onProgress: (video: InfluencerVideo) => void,
    intervalMs: number = 2000
  ): Promise<InfluencerVideo> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const response = await this.getVideoStatus(videoId);
          
          if (response.data) {
            onProgress(response.data);
            
            if (response.data.status === 'COMPLETED') {
              resolve(response.data);
            } else if (response.data.status === 'FAILED') {
              reject(new Error('Video generation failed'));
            } else {
              // Continue polling
              setTimeout(poll, intervalMs);
            }
          } else {
            reject(new Error(response.error?.message || 'Failed to get video status'));
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  /**
   * Create influencer from default template
   */
  static async createFromDefault(defaultInfluencer: CreateAIInfluencerDto, customName?: string) {
    const influencerData = {
      ...defaultInfluencer,
      ...(customName && { name: customName }),
      isDefault: false, // User's copy won't be marked as default
    };

    return await this.createInfluencer(influencerData);
  }

  /**
   * Duplicate an existing influencer
   */
  static async duplicateInfluencer(sourceId: string, newName: string) {
    const sourceResponse = await this.getInfluencer(sourceId);
    
    if (!sourceResponse.data) {
      throw new Error('Source influencer not found');
    }

    const { id, userId, createdAt, updatedAt, images, videos, ...influencerData } = sourceResponse.data;
    
    return await this.createInfluencer({
      ...influencerData,
      name: newName,
    });
  }

  /**
   * Get influencer statistics
   */
  static async getInfluencerStats(influencerId: string) {
    const response = await this.getInfluencer(influencerId);
    
    if (!response.data) {
      throw new Error('Influencer not found');
    }

    const influencer = response.data;
    
    return {
      totalImages: influencer.images?.length || 0,
      totalVideos: influencer.videos?.length || 0,
      referenceImages: influencer.images?.filter(img => img.isReference).length || 0,
      completedVideos: influencer.videos?.filter(video => video.status === 'COMPLETED').length || 0,
      pendingVideos: influencer.videos?.filter(video => video.status === 'PENDING' || video.status === 'GENERATING').length || 0,
      failedVideos: influencer.videos?.filter(video => video.status === 'FAILED').length || 0,
    };
  }

  /**
   * Validate influencer data before creation/update
   */
  static validateInfluencerData(data: CreateAIInfluencerDto | UpdateAIInfluencerDto): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check required fields for creation
    if ('name' in data && !data.name?.trim()) {
      errors.push('Name is required');
    }

    // Check name length
    if (data.name && typeof data.name === 'string' && data.name.length > 100) {
      errors.push('Name must be less than 100 characters');
    }

    // Check description length
    if (data.description && typeof data.description === 'string' && data.description.length > 500) {
      errors.push('Description must be less than 500 characters');
    }

    // Check age range
    if (data.age && typeof data.age === 'number' && (data.age < 18 || data.age > 50)) {
      errors.push('Age must be between 18 and 50');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format influencer data for display
   */
  static formatInfluencerForDisplay(influencer: AIInfluencer) {
    return {
      ...influencer,
      displayAge: influencer.age ? `${influencer.age} years old` : 'Age not specified',
      displayEthnicity: influencer.primaryEthnicity || 'Not specified',
      displayBuild: influencer.height && influencer.overallBuild 
        ? `${influencer.height}, ${influencer.overallBuild}` 
        : 'Build not specified',
      displayStyle: influencer.personalityArchetype && influencer.styleAesthetic
        ? `${influencer.personalityArchetype}, ${influencer.styleAesthetic}`
        : 'Style not specified',
      keyFeaturesList: influencer.keyFeatures?.split(',').map(f => f.trim()) || [],
      createdDate: new Date(influencer.createdAt).toLocaleDateString(),
      updatedDate: new Date(influencer.updatedAt).toLocaleDateString(),
    };
  }
}
