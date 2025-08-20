import { Injectable, Logger } from '@nestjs/common';
import { generateObject, generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { config } from './config';
import { z } from 'zod';
import { S3Service } from './s3.service';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Simplified schemas for structured data generation
const ImageIdeaItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  visualElements: z.array(z.string()),
  mood: z.string(),
  setting: z.string(),
  styleNotes: z.string(),
});

export const ImageIdeaSchema = z.object({
  ideas: z.array(ImageIdeaItemSchema),
});

const VideoIdeaItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  scenario: z.string(),
  keyMoments: z.array(z.string()),
  duration: z.string(),
  mood: z.string(),
  visualStyle: z.string(),
});

export const VideoIdeaSchema = z.object({
  ideas: z.array(VideoIdeaItemSchema),
});

export const OptimizedPromptSchema = z.object({
  prompt: z.string(),
  reasoning: z.string(),
  technicalNotes: z.string(),
  alternativePrompts: z.array(z.string()),
});

const ImageAnalysisSchema = z.object({
  analysis: z.string(),
  suggestedTitle: z.string(),
  suggestedDescription: z.string(),
  suggestedCategory: z.string(),
  suggestedMood: z.string(),
  suggestedSetting: z.string(),
  suggestedStyleNotes: z.string(),
  suggestedVisualElements: z.array(z.string()),
});

export type ImageIdea = z.infer<typeof ImageIdeaSchema>['ideas'][0];
export type VideoIdea = z.infer<typeof VideoIdeaSchema>['ideas'][0];
export type OptimizedPrompt = z.infer<typeof OptimizedPromptSchema>;
export type ImageAnalysis = z.infer<typeof ImageAnalysisSchema>;

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private readonly model;

  constructor(private readonly s3Service: S3Service) {
    // Create Google AI provider with API key
    const google = createGoogleGenerativeAI({
      apiKey: config.llm.geminiApiKey,
    });

    // Use Google's Gemini model via Vercel AI SDK
    this.model = google('gemini-1.5-pro');
  }

  /**
   * Generate image ideas for an AI influencer
   */
  async generateImageIdeas(
    influencerData: Record<string, unknown>,
    count: number = 6,
    usedIdeaIds: string[] = [],
  ): Promise<ImageIdea[]> {
    try {
      this.logger.log(`Generating ${count} image ideas for influencer`);

      const usedIdeasContext =
        usedIdeaIds.length > 0
          ? `\n\nIMPORTANT: Avoid generating ideas similar to these already used concepts (IDs: ${usedIdeaIds.join(', ')}). Create fresh, unique ideas.`
          : '';

      const prompt = `
Generate ${count} creative and visually compelling image ideas for an AI influencer with the following characteristics:

INFLUENCER PROFILE:
- Name: ${influencerData.name || 'AI Influencer'}
- Personality: ${influencerData.personalityArchetype || 'Not specified'}
- Style Aesthetic: ${influencerData.styleAesthetic || 'Not specified'}
- Age: ${influencerData.age || 'Not specified'}
- Ethnicity: ${influencerData.primaryEthnicity || 'Not specified'}
- Height: ${influencerData.height || 'Not specified'}
- Body Type: ${influencerData.bodyType || 'Not specified'}
- Hair Color: ${influencerData.hairColor || 'Not specified'}
- Eye Color: ${influencerData.eyeColor || 'Not specified'}
- Key Features: ${influencerData.keyFeatures || 'Not specified'}
- Style Icons: ${influencerData.styleIcons || 'Not specified'}
- Personality Traits: ${influencerData.personalityTraits || 'Not specified'}${usedIdeasContext}

REQUIREMENTS:
1. Each idea should be authentic to the influencer's characteristics
2. Include diverse image types: portraits, lifestyle shots, fashion looks, candid moments
3. Consider different settings: indoor, outdoor, studio, natural environments
4. Vary the moods: professional, casual, artistic, playful, elegant
5. Each idea should have strong visual potential for AI image generation
6. Make each ID unique using format: img_[category]_[number] (e.g., img_portrait_001)

Generate exactly ${count} unique and inspiring image ideas that would showcase this influencer's personality and style.
      `;

      const result = await generateObject({
        model: this.model,
        schema: ImageIdeaSchema as any,
        prompt,
      });

      this.logger.log(`Successfully generated ${result.object.ideas.length} image ideas`);
      return result.object.ideas;
    } catch (error) {
      this.logger.error(`Failed to generate image ideas: ${error.message}`, error);
      throw new Error('Failed to generate image ideas');
    }
  }

  /**
   * Generate video ideas for an AI influencer
   */
  async generateVideoIdeas(
    influencerData: Record<string, unknown>,
    count: number = 6,
    usedIdeaIds: string[] = [],
  ): Promise<VideoIdea[]> {
    try {
      this.logger.log(`Generating ${count} video ideas for influencer`);

      const usedIdeasContext =
        usedIdeaIds.length > 0
          ? `\n\nIMPORTANT: Avoid generating ideas similar to these already used concepts (IDs: ${usedIdeaIds.join(', ')}). Create fresh, unique ideas.`
          : '';

      const prompt = `
Generate ${count} engaging and creative video ideas for an AI influencer with the following characteristics:

INFLUENCER PROFILE:
- Name: ${influencerData.name || 'AI Influencer'}
- Personality: ${influencerData.personalityArchetype || 'Not specified'}
- Style Aesthetic: ${influencerData.styleAesthetic || 'Not specified'}
- Age: ${influencerData.age || 'Not specified'}
- Ethnicity: ${influencerData.primaryEthnicity || 'Not specified'}
- Height: ${influencerData.height || 'Not specified'}
- Body Type: ${influencerData.bodyType || 'Not specified'}
- Hair Color: ${influencerData.hairColor || 'Not specified'}
- Eye Color: ${influencerData.eyeColor || 'Not specified'}
- Key Features: ${influencerData.keyFeatures || 'Not specified'}
- Style Icons: ${influencerData.styleIcons || 'Not specified'}
- Personality Traits: ${influencerData.personalityTraits || 'Not specified'}${usedIdeasContext}

REQUIREMENTS:
1. Each video should be authentic to the influencer's personality and style
2. Include diverse content types: tutorials, lifestyle vlogs, fashion content, day-in-the-life
3. Consider different formats: short-form content, longer narratives, educational pieces
4. Vary the settings and scenarios for visual interest
5. Each idea should be feasible for AI video generation
6. Include clear storylines and key moments
7. Make each ID unique using format: vid_[category]_[number] (e.g., vid_lifestyle_001)

Generate exactly ${count} unique and compelling video ideas that would engage the target audience.
      `;

      const result = await generateObject({
        model: this.model,
        schema: VideoIdeaSchema as any,
        prompt,
      });

      this.logger.log(`Successfully generated ${result.object.ideas.length} video ideas`);
      return result.object.ideas;
    } catch (error) {
      this.logger.error(`Failed to generate video ideas: ${error.message}`, error);
      throw new Error('Failed to generate video ideas');
    }
  }

  /**
   * Generate optimized prompt for image generation based on selected idea
   */
  async generateImagePrompt(
    influencerData: Record<string, unknown>,
    imageIdea: ImageIdea,
    customInstructions?: string,
  ): Promise<OptimizedPrompt> {
    try {
      this.logger.log(`Generating optimized image prompt for idea: ${imageIdea.title}`);

      const customContext = customInstructions ? `\n\nCUSTOM INSTRUCTIONS: ${customInstructions}` : '';

      const prompt = `
You are an expert prompt engineer specializing in AI image generation. Create an optimized prompt for generating a high-quality image based on the following:

INFLUENCER CHARACTERISTICS:
- Name: ${influencerData.name || 'AI Influencer'}
- Personality: ${influencerData.personalityArchetype || 'Not specified'}
- Style: ${influencerData.styleAesthetic || 'Not specified'}
- Age: ${influencerData.age || 'Not specified'}
- Ethnicity: ${influencerData.primaryEthnicity || 'Not specified'}
- Height: ${influencerData.height || 'Not specified'}
- Body Type: ${influencerData.bodyType || 'Not specified'}
- Hair: ${influencerData.hairColor || 'Not specified'}
- Eyes: ${influencerData.eyeColor || 'Not specified'}
- Key Features: ${influencerData.keyFeatures || 'Not specified'}

SELECTED IMAGE IDEA:
- Title: ${imageIdea.title}
- Description: ${imageIdea.description}
- Category: ${imageIdea.category}
- Visual Elements: ${imageIdea.visualElements.join(', ')}
- Mood: ${imageIdea.mood}
- Setting: ${imageIdea.setting}
- Style Notes: ${imageIdea.styleNotes}${customContext}

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

      const result = await generateObject({
        model: this.model,
        schema: OptimizedPromptSchema as any,
        prompt,
      });

      this.logger.log(`Successfully generated optimized image prompt`);
      return result.object;
    } catch (error) {
      this.logger.error(`Failed to generate image prompt: ${error.message}`, error);
      throw new Error('Failed to generate optimized image prompt');
    }
  }

  /**
   * Generate optimized prompt for video generation based on selected idea
   */
  async generateVideoPrompt(
    influencerData: Record<string, unknown>,
    videoIdea: VideoIdea,
    customInstructions?: string,
  ): Promise<OptimizedPrompt> {
    try {
      this.logger.log(`Generating optimized video prompt for idea: ${videoIdea.title}`);

      const customContext = customInstructions ? `\n\nCUSTOM INSTRUCTIONS: ${customInstructions}` : '';

      const prompt = `
You are an expert prompt engineer specializing in AI video generation. Create an optimized prompt for generating a high-quality video based on the following:

INFLUENCER CHARACTERISTICS:
- Name: ${influencerData.name || 'AI Influencer'}
- Personality: ${influencerData.personalityArchetype || 'Not specified'}
- Style: ${influencerData.styleAesthetic || 'Not specified'}
- Age: ${influencerData.age || 'Not specified'}
- Ethnicity: ${influencerData.primaryEthnicity || 'Not specified'}
- Height: ${influencerData.height || 'Not specified'}
- Body Type: ${influencerData.bodyType || 'Not specified'}
- Hair: ${influencerData.hairColor || 'Not specified'}
- Eyes: ${influencerData.eyeColor || 'Not specified'}
- Key Features: ${influencerData.keyFeatures || 'Not specified'}

SELECTED VIDEO IDEA:
- Title: ${videoIdea.title}
- Description: ${videoIdea.description}
- Category: ${videoIdea.category}
- Scenario: ${videoIdea.scenario}
- Key Moments: ${videoIdea.keyMoments.join(', ')}
- Duration: ${videoIdea.duration}
- Mood: ${videoIdea.mood}
- Visual Style: ${videoIdea.visualStyle}${customContext}

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

      const result = await generateObject({
        model: this.model,
        schema: OptimizedPromptSchema as any,
        prompt,
      });

      this.logger.log(`Successfully generated optimized video prompt`);
      return result.object;
    } catch (error) {
      this.logger.error(`Failed to generate video prompt: ${error.message}`, error);
      throw new Error('Failed to generate optimized video prompt');
    }
  }

  /**
   * Upload file to S3 and return URL
   */
  async uploadFile(file: Express.Multer.File, type: 'image' | 'video'): Promise<{ key: string; url: string }> {
    try {
      const fileExtension = file.originalname.split('.').pop() || 'bin';
      const filename = `${type}s/${uuidv4()}.${fileExtension}`;

      this.logger.log(`Uploading ${type} file: ${filename}`);

      const result = await this.s3Service.uploadFile(file, filename);

      this.logger.log(`Successfully uploaded ${type} to S3: ${result.url}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to upload ${type} file: ${error.message}`, error);
      throw new Error(`Failed to upload ${type} file`);
    }
  }

  /**
   * Generate general text using AI
   */
  async generateText(prompt: string): Promise<string> {
    try {
      const result = await generateText({
        model: this.model,
        prompt,
      });

      return result.text;
    } catch (error) {
      this.logger.error(`Failed to generate text: ${error.message}`, error);
      throw new Error('Failed to generate text');
    }
  }

  /**
   * Generate structured object using AI
   */
  async generateObject<T>(prompt: string, schema: any): Promise<T> {
    try {
      const result = await generateObject({
        model: this.model,
        schema,
        prompt,
      });

      return result.object;
    } catch (error) {
      this.logger.error(`Failed to generate object: ${error.message}`, error);
      throw new Error('Failed to generate structured data');
    }
  }

  /**
   * Analyze an uploaded image to suggest idea details
   */
  async analyzeImageForIdea(imageBuffer: Buffer, mimeType: string): Promise<ImageAnalysis> {
    try {
      this.logger.log('Analyzing uploaded image for idea generation');

      // Convert buffer to base64
      const base64Image = imageBuffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      const prompt = `
Analyze this image and suggest details for creating an AI influencer image idea based on what you see.

Please analyze the following aspects:
1. Overall composition and style
2. Lighting and mood
3. Setting/environment
4. Visual elements present
5. Aesthetic style and mood
6. Potential category (portrait, lifestyle, fashion, beauty, fitness, etc.)

Based on your analysis, suggest:
- A catchy title for this image idea
- A detailed description of the concept
- The most appropriate category
- The mood/feeling it conveys
- The setting/location type
- Style notes that capture the aesthetic
- Key visual elements that make it appealing

Make your suggestions specific and actionable for AI image generation.
      `;

      const result = await generateObject({
        model: this.model,
        schema: ImageAnalysisSchema as any,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image', image: dataUrl },
            ],
          },
        ],
      });

      this.logger.log('Successfully analyzed image for idea generation');
      return result.object;
    } catch (error) {
      this.logger.error(`Failed to analyze image: ${error.message}`, error);
      throw new Error('Failed to analyze image for idea generation');
    }
  }

  /**
   * Generate image using Google's Imagen model
   */
  async generateImageWithGemini(
    prompt: string,
    imageType: string = 'LIFESTYLE',
    aspectRatio: string = '1:1',
  ): Promise<{ imageUrl: string; metadata: Record<string, unknown> }> {
    try {
      this.logger.log(`Generating image with Gemini Imagen: ${imageType}`);

      // Use Google's Imagen API via Vertex AI
      const response = await axios.post(
        `https://us-central1-aiplatform.googleapis.com/v1/projects/${config.gcp.projectId}/locations/us-central1/publishers/google/models/imagegeneration@006:predict`,
        {
          instances: [
            {
              prompt: prompt,
              aspectRatio: aspectRatio,
              negativePrompt: 'blurry, low quality, distorted, watermark, text, signature',
              guidanceScale: 7.5,
              outputOptions: {
                mimeType: 'image/jpeg',
              },
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${await this.getGoogleAccessToken()}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.data.predictions || response.data.predictions.length === 0) {
        throw new Error('No image generated from Imagen API');
      }

      const prediction = response.data.predictions[0];

      // Upload the generated image to S3
      const imageBuffer = Buffer.from(prediction.bytesBase64Encoded, 'base64');
      const filename = `generated-images/${uuidv4()}.jpg`;

      const uploadResult = await this.s3Service.uploadBuffer(imageBuffer, filename, 'image/jpeg');

      this.logger.log(`Successfully generated and uploaded image: ${uploadResult.url}`);

      return {
        imageUrl: uploadResult.url,
        metadata: {
          model: 'imagen-2.0',
          prompt: prompt,
          imageType: imageType,
          aspectRatio: aspectRatio,
          generatedAt: new Date().toISOString(),
          s3Key: uploadResult.key,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to generate image with Gemini: ${error.message}`, error);
      throw new Error('Failed to generate image with Gemini Imagen');
    }
  }

  /**
   * Generate video using Google's Veo3 model
   */
  async generateVideoWithVeo3(
    prompt: string,
    duration: number = 5,
  ): Promise<{ videoId: string; status: string; metadata: Record<string, unknown> }> {
    try {
      this.logger.log(`Generating video with Veo3, duration: ${duration}s`);

      // Use Google's Veo3 API via Vertex AI
      const response = await axios.post(
        `https://us-central1-aiplatform.googleapis.com/v1/projects/${config.gcp.projectId}/locations/us-central1/publishers/google/models/veo-3:predict`,
        {
          instances: [
            {
              prompt: prompt,
              duration: duration,
              resolution: '1280x720',
              frameRate: 24,
              outputOptions: {
                mimeType: 'video/mp4',
              },
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${await this.getGoogleAccessToken()}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.data.predictions || response.data.predictions.length === 0) {
        throw new Error('No video generation job started');
      }

      const prediction = response.data.predictions[0];
      const videoId = prediction.operationId || uuidv4();

      this.logger.log(`Successfully started video generation with ID: ${videoId}`);

      return {
        videoId,
        status: 'GENERATING',
        metadata: {
          model: 'veo-3',
          prompt: prompt,
          duration: duration,
          resolution: '1280x720',
          frameRate: 24,
          generatedAt: new Date().toISOString(),
          operationId: prediction.operationId,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to generate video with Veo3: ${error.message}`, error);
      throw new Error('Failed to generate video with Veo3');
    }
  }

  /**
   * Check video generation status and retrieve result
   */
  async checkVideoStatus(
    videoId: string,
    operationId: string,
  ): Promise<{
    status: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    metadata?: Record<string, unknown>;
  }> {
    try {
      this.logger.log(`Checking video generation status for ID: ${videoId}`);

      const response = await axios.get(
        `https://us-central1-aiplatform.googleapis.com/v1/projects/${config.gcp.projectId}/locations/us-central1/operations/${operationId}`,
        {
          headers: {
            Authorization: `Bearer ${await this.getGoogleAccessToken()}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const operation = response.data;

      if (!operation.done) {
        return { status: 'GENERATING' };
      }

      if (operation.error) {
        this.logger.error(`Video generation failed: ${JSON.stringify(operation.error)}`);
        return { status: 'FAILED' };
      }

      // Extract video data from response
      const result = operation.response;
      if (!result.bytesBase64Encoded) {
        throw new Error('No video data in completed operation');
      }

      // Upload the generated video to S3
      const videoBuffer = Buffer.from(result.bytesBase64Encoded, 'base64');
      const filename = `generated-videos/${videoId}.mp4`;

      const uploadResult = await this.s3Service.uploadBuffer(videoBuffer, filename, 'video/mp4');

      // Generate thumbnail (optional - could be done later)
      const thumbnailUrl = await this.generateVideoThumbnail(uploadResult.url);

      this.logger.log(`Successfully completed video generation: ${uploadResult.url}`);

      return {
        status: 'COMPLETED',
        videoUrl: uploadResult.url,
        thumbnailUrl,
        metadata: {
          s3Key: uploadResult.key,
          completedAt: new Date().toISOString(),
          duration: result.duration || 5,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to check video status: ${error.message}`, error);
      return { status: 'FAILED' };
    }
  }

  /**
   * Generate video thumbnail (placeholder implementation)
   */
  private async generateVideoThumbnail(videoUrl: string): Promise<string> {
    // This is a placeholder - in a real implementation, you'd use a video processing service
    // to extract a frame from the video and create a thumbnail
    this.logger.log(`Generating thumbnail for video: ${videoUrl}`);

    // For now, return a placeholder thumbnail URL
    // In production, you'd use services like AWS MediaConvert, FFmpeg, etc.
    return videoUrl.replace('.mp4', '_thumbnail.jpg');
  }

  /**
   * Get Google Cloud access token
   */
  private async getGoogleAccessToken(): Promise<string> {
    try {
      // In production, use Google Cloud SDK or service account credentials
      // This is a simplified version - you should use proper authentication

      if (config.gcp.serviceAccountKey) {
        // Use service account key for authentication
        const { GoogleAuth } = require('google-auth-library');
        const auth = new GoogleAuth({
          keyFile: config.gcp.serviceAccountKey,
          scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });

        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        return accessToken.token;
      }

      throw new Error('No Google Cloud authentication configured');
    } catch (error) {
      this.logger.error(`Failed to get Google access token: ${error.message}`, error);
      throw new Error('Failed to authenticate with Google Cloud');
    }
  }
}
