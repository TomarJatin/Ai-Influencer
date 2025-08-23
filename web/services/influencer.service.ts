import { ApiClient } from '@/lib/api-client';
import { AIInfluencer, OptimizedPrompt } from '@/types';
import {
  GenerateBaseImagePromptRequest,
  RegenerateBaseImagePromptRequest,
  GenerateBaseImageRequest,
  SaveBaseImageRequest,
  BaseImageGenerationResponse,
} from '@/types/influencer.type';

// New types for the redesigned API
export interface ImageIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  visualElements: string[];
  mood: string;
  setting: string;
  styleNotes: string;
  isUsed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VideoIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  scenario: string;
  keyMoments: string[];
  duration: string;
  mood: string;
  visualStyle: string;
  isUsed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImageIdeaDto {
  title: string;
  description: string;
  category?: string;
  setting?: string;
  mood?: string;
  styleNotes?: string;
  visualElements?: string[];
}

export interface CreateVideoIdeaDto {
  title: string;
  description: string;
  scenario: string;
  category?: string;
  duration?: string;
  mood?: string;
  visualStyle?: string;
  keyMoments?: string[];
}

export interface GenerateImageFromIdeaDto {
  imageIdeaId: string;
  imageType: 'PORTRAIT' | 'FULL_BODY' | 'BEAUTY_SHOT' | 'LIFESTYLE' | 'REFERENCE';
  customPrompt?: string;
  isReference?: boolean;
}

export interface GenerateImagePromptDto {
  imageIdeaId: string;
  imageType: string;
  customInstructions?: string;
}

export interface OptimizedPromptResponse {
  prompt: string;
  reasoning: string;
  technicalNotes: string;
  alternativePrompts: string[];
  ideaUsed: {
    id: string;
    title: string;
    category: string;
  };
}

export interface GenerateVideoFromIdeaDto {
  videoIdeaId: string;
  customPrompt?: string;
  duration?: number;
}

export interface AnalyzeImageForIdeaDto {
  analysis: string;
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedCategory: string;
  suggestedMood: string;
  suggestedSetting: string;
  suggestedStyleNotes: string;
  suggestedVisualElements: string[];
}

export interface PaginationQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isUsed?: boolean;
}

export interface PaginatedResponseDto<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class InfluencerService {
  // ============================================================================
  // BASIC INFLUENCER CRUD OPERATIONS
  // ============================================================================

  static async getInfluencers() {
    return await ApiClient.get<AIInfluencer[]>('/api/influencers');
  }

  static async getInfluencer(id: string) {
    return await ApiClient.get<AIInfluencer>(`/api/influencers/${id}`);
  }

  static async createInfluencer(data: Partial<AIInfluencer>) {
    return await ApiClient.post<AIInfluencer>('/api/influencers', data);
  }

  static async updateInfluencer(id: string, data: Partial<AIInfluencer>) {
    return await ApiClient.put<AIInfluencer>(`/api/influencers/${id}`, data);
  }

  static async deleteInfluencer(id: string) {
    return await ApiClient.delete<boolean>(`/api/influencers/${id}`);
  }

  // ============================================================================
  // IMAGE IDEA MANAGEMENT
  // ============================================================================

  static async createImageIdea(influencerId: string, data: CreateImageIdeaDto) {
    return await ApiClient.post<ImageIdea>(`/api/influencers/${influencerId}/image-ideas`, data);
  }

  static async analyzeImageForIdea(influencerId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return await ApiClient.postFormData<AnalyzeImageForIdeaDto>(
      `/api/influencers/${influencerId}/image-ideas/analyze`,
      formData
    );
  }

  static async getImageIdeas(influencerId: string, query?: PaginationQueryDto) {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.search) params.append('search', query.search);
    if (query?.category) params.append('category', query.category);
    if (typeof query?.isUsed === 'boolean') params.append('isUsed', query.isUsed.toString());

    const queryString = params.toString();
    const url = `/api/influencers/${influencerId}/image-ideas${queryString ? `?${queryString}` : ''}`;

    return await ApiClient.get<PaginatedResponseDto<ImageIdea>>(url);
  }

  static async updateImageIdea(influencerId: string, ideaId: string, data: Partial<CreateImageIdeaDto>) {
    return await ApiClient.put<ImageIdea>(`/api/influencers/${influencerId}/image-ideas/${ideaId}`, data);
  }

  static async deleteImageIdea(influencerId: string, ideaId: string) {
    return await ApiClient.delete<void>(`/api/influencers/${influencerId}/image-ideas/${ideaId}`);
  }

  static async generateImageFromIdea(influencerId: string, data: GenerateImageFromIdeaDto) {
    return await ApiClient.post<any>(`/api/influencers/${influencerId}/generate-image`, data);
  }

  static async generateImagePrompt(influencerId: string, data: GenerateImagePromptDto) {
    return await ApiClient.post<{ data: OptimizedPromptResponse }>(
      `/api/influencers/${influencerId}/generate-prompt`,
      data
    );
  }

  static async deleteImage(influencerId: string, imageId: string) {
    return await ApiClient.delete<void>(`/api/influencers/${influencerId}/images/${imageId}`);
  }

  // ============================================================================
  // VIDEO IDEA MANAGEMENT
  // ============================================================================

  static async createVideoIdea(influencerId: string, data: CreateVideoIdeaDto) {
    return await ApiClient.post<VideoIdea>(`/api/influencers/${influencerId}/video-ideas`, data);
  }

  static async getVideoIdeas(influencerId: string, query?: PaginationQueryDto) {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.search) params.append('search', query.search);
    if (query?.category) params.append('category', query.category);
    if (typeof query?.isUsed === 'boolean') params.append('isUsed', query.isUsed.toString());

    const queryString = params.toString();
    const url = `/api/influencers/${influencerId}/video-ideas${queryString ? `?${queryString}` : ''}`;

    return await ApiClient.get<PaginatedResponseDto<VideoIdea>>(url);
  }

  static async updateVideoIdea(influencerId: string, ideaId: string, data: Partial<CreateVideoIdeaDto>) {
    return await ApiClient.put<VideoIdea>(`/api/influencers/${influencerId}/video-ideas/${ideaId}`, data);
  }

  static async deleteVideoIdea(influencerId: string, ideaId: string) {
    return await ApiClient.delete<void>(`/api/influencers/${influencerId}/video-ideas/${ideaId}`);
  }

  static async generateVideoFromIdea(influencerId: string, data: GenerateVideoFromIdeaDto) {
    return await ApiClient.post<any>(`/api/influencers/${influencerId}/generate-video`, data);
  }

  static async checkVideoStatus(influencerId: string, videoId: string) {
    return await ApiClient.get<any>(`/api/influencers/${influencerId}/videos/${videoId}/status`);
  }

  static async diagnoseImageGeneration() {
    return await ApiClient.get<any>('/api/influencers/diagnose');
  }

  // ============================================================================
  // LEGACY ENDPOINTS (for backward compatibility)
  // ============================================================================

  static async generateLegacyImagePrompt(influencerId: string, imageType: string) {
    return await ApiClient.post<any>(`/api/influencers/${influencerId}/legacy/image-prompt/${imageType}`, {});
  }

  static async generateLegacyImage(influencerId: string, data: any) {
    return await ApiClient.post<any>(`/api/influencers/${influencerId}/legacy/generate-image`, data);
  }

  static async generateLegacyVideo(influencerId: string, data: any) {
    return await ApiClient.post<any>(`/api/influencers/${influencerId}/legacy/generate-video`, data);
  }

  static async getLegacyVideoIdeas(influencerId: string) {
    return await ApiClient.get<any>(`/api/influencers/${influencerId}/legacy/video-ideas`);
  }

  static async getLegacyVideoStatus(influencerId: string, videoId: string) {
    return await ApiClient.get<any>(`/api/influencers/${influencerId}/legacy/video-status/${videoId}`);
  }

  // Additional legacy methods for backward compatibility
  static async generateImage(data: any) {
    return await this.generateLegacyImage(data.influencerId, data);
  }

  static async generateVideo(data: any) {
    return await this.generateLegacyVideo(data.influencerId, data);
  }

  static async getVideoStatus(videoId: string) {
    // This is a simplified version - in reality you'd need the influencer ID
    // For now, we'll throw an error suggesting to use the new method
    throw new Error('getVideoStatus is deprecated. Use checkVideoStatus with influencerId instead.');
  }

  static async generateVideoIdeas(influencerId: string) {
    return await this.getLegacyVideoIdeas(influencerId);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

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
      referenceImages: influencer.images?.filter((img) => img.isReference).length || 0,
      completedVideos: influencer.videos?.filter((video) => video.status === 'COMPLETED').length || 0,
      pendingVideos:
        influencer.videos?.filter((video) => video.status === 'PENDING' || video.status === 'GENERATING').length || 0,
      failedVideos: influencer.videos?.filter((video) => video.status === 'FAILED').length || 0,
    };
  }

  /**
   * Create influencer from default template
   */
  static async createFromDefault(defaultInfluencer: Partial<AIInfluencer>, customName?: string) {
    const influencerData = {
      ...defaultInfluencer,
      ...(customName && { name: customName }),
      isDefault: false, // User's copy won't be marked as default
    };

    return await this.createInfluencer(influencerData);
  }

  /**
   * Format influencer data for display
   */
  static formatInfluencerForDisplay(influencer: AIInfluencer) {
    return {
      ...influencer,
      displayAge: influencer.age ? `${influencer.age} years old` : 'Age not specified',
      displayEthnicity: influencer.primaryEthnicity || 'Not specified',
      displayBuild:
        influencer.height && influencer.overallBuild
          ? `${influencer.height}, ${influencer.overallBuild}`
          : 'Build not specified',
      displayStyle:
        influencer.personalityArchetype && influencer.styleAesthetic
          ? `${influencer.personalityArchetype}, ${influencer.styleAesthetic}`
          : 'Style not specified',
      keyFeaturesList: influencer.keyFeatures?.split(',').map((f) => f.trim()) || [],
      createdDate: new Date(influencer.createdAt).toLocaleDateString(),
      updatedDate: new Date(influencer.updatedAt).toLocaleDateString(),
    };
  }

  /**
   * Poll video status until completion
   */
  static async pollVideoStatus(
    influencerId: string,
    videoId: string,
    onProgress: (video: any) => void,
    intervalMs: number = 2000
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const response = await this.checkVideoStatus(influencerId, videoId);

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

  // ============================================================================
  // BASE IMAGE MANAGEMENT METHODS
  // ============================================================================

  static async generateBaseImagePrompt(
    request: GenerateBaseImagePromptRequest
  ): Promise<{ data?: OptimizedPrompt; error?: { message: string; status: number } }> {
    return await ApiClient.post<OptimizedPrompt>(
      `/api/influencers/${request.influencerId}/base-image/generate-prompt`,
      {
        customInstructions: request.customInstructions,
      }
    );
  }

  static async regenerateBaseImagePrompt(
    request: RegenerateBaseImagePromptRequest
  ): Promise<{ data?: OptimizedPrompt; error?: { message: string; status: number } }> {
    return await ApiClient.post<OptimizedPrompt>(
      `/api/influencers/${request.influencerId}/base-image/regenerate-prompt`,
      {
        currentPrompt: request.currentPrompt,
        customInstructions: request.customInstructions,
      }
    );
  }

  static async generateBaseImage(
    request: GenerateBaseImageRequest
  ): Promise<{ data?: BaseImageGenerationResponse; error?: { message: string; status: number } }> {
    return await ApiClient.post<BaseImageGenerationResponse>(
      `/api/influencers/${request.influencerId}/base-image/generate`,
      {
        prompt: request.prompt,
        imageType: request.imageType || 'PORTRAIT',
      }
    );
  }

  static async saveBaseImage(
    request: SaveBaseImageRequest
  ): Promise<{ data?: { success: boolean; message: string }; error?: { message: string; status: number } }> {
    return await ApiClient.post<{ success: boolean; message: string }>(
      `/api/influencers/${request.influencerId}/base-image/save`,
      {
        imageUrl: request.imageUrl,
        prompt: request.prompt,
      }
    );
  }

  static async uploadBaseImage(
    influencerId: string,
    file: File
  ): Promise<{ data?: BaseImageGenerationResponse; error?: { message: string; status: number } }> {
    const formData = new FormData();
    formData.append('file', file);

    return await ApiClient.postFormData<BaseImageGenerationResponse>(
      `/api/influencers/${influencerId}/base-image/upload`,
      formData
    );
  }

  static async removeBaseImage(
    influencerId: string
  ): Promise<{ data?: { success: boolean; message: string }; error?: { message: string; status: number } }> {
    return await ApiClient.delete<{ success: boolean; message: string }>(`/api/influencers/${influencerId}/base-image`);
  }
}
