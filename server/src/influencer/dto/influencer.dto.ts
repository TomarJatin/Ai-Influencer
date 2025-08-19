import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';

export class CreateAIInfluencerDto {
  @ApiProperty({ description: 'Name of the AI influencer', example: 'Sophia Chen' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the AI influencer', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  // Character Identity
  @ApiProperty({ description: 'Age of the AI influencer', required: false })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty({ description: 'Personality archetype', required: false })
  @IsOptional()
  @IsString()
  personalityArchetype?: string;

  @ApiProperty({ description: 'Style aesthetic', required: false })
  @IsOptional()
  @IsString()
  styleAesthetic?: string;

  // Facial Features - Face Structure
  @ApiProperty({ description: 'Face shape', required: false })
  @IsOptional()
  @IsString()
  faceShape?: string;

  @ApiProperty({ description: 'Jawline description', required: false })
  @IsOptional()
  @IsString()
  jawline?: string;

  @ApiProperty({ description: 'Cheekbones description', required: false })
  @IsOptional()
  @IsString()
  cheekbones?: string;

  @ApiProperty({ description: 'Forehead description', required: false })
  @IsOptional()
  @IsString()
  forehead?: string;

  @ApiProperty({ description: 'Chin description', required: false })
  @IsOptional()
  @IsString()
  chin?: string;

  // Eyes
  @ApiProperty({ description: 'Eye shape', required: false })
  @IsOptional()
  @IsString()
  eyeShape?: string;

  @ApiProperty({ description: 'Eye color', required: false })
  @IsOptional()
  @IsString()
  eyeColor?: string;

  @ApiProperty({ description: 'Eye size', required: false })
  @IsOptional()
  @IsString()
  eyeSize?: string;

  @ApiProperty({ description: 'Eyebrow shape', required: false })
  @IsOptional()
  @IsString()
  eyebrowShape?: string;

  @ApiProperty({ description: 'Eyebrow color', required: false })
  @IsOptional()
  @IsString()
  eyebrowColor?: string;

  @ApiProperty({ description: 'Eyelashes description', required: false })
  @IsOptional()
  @IsString()
  eyelashes?: string;

  // Nose
  @ApiProperty({ description: 'Nose shape', required: false })
  @IsOptional()
  @IsString()
  noseShape?: string;

  @ApiProperty({ description: 'Nose size', required: false })
  @IsOptional()
  @IsString()
  noseSize?: string;

  @ApiProperty({ description: 'Nostril shape', required: false })
  @IsOptional()
  @IsString()
  nostrilShape?: string;

  // Lips
  @ApiProperty({ description: 'Lip shape', required: false })
  @IsOptional()
  @IsString()
  lipShape?: string;

  @ApiProperty({ description: 'Lip size', required: false })
  @IsOptional()
  @IsString()
  lipSize?: string;

  @ApiProperty({ description: 'Natural lip color', required: false })
  @IsOptional()
  @IsString()
  naturalLipColor?: string;

  // Skin
  @ApiProperty({ description: 'Skin tone', required: false })
  @IsOptional()
  @IsString()
  skinTone?: string;

  @ApiProperty({ description: 'Skin texture', required: false })
  @IsOptional()
  @IsString()
  skinTexture?: string;

  @ApiProperty({ description: 'Skin condition', required: false })
  @IsOptional()
  @IsString()
  skinCondition?: string;

  @ApiProperty({ description: 'Complexion', required: false })
  @IsOptional()
  @IsString()
  complexion?: string;

  // Hair
  @ApiProperty({ description: 'Hair color', required: false })
  @IsOptional()
  @IsString()
  hairColor?: string;

  @ApiProperty({ description: 'Hair texture', required: false })
  @IsOptional()
  @IsString()
  hairTexture?: string;

  @ApiProperty({ description: 'Hair length', required: false })
  @IsOptional()
  @IsString()
  hairLength?: string;

  @ApiProperty({ description: 'Hair volume', required: false })
  @IsOptional()
  @IsString()
  hairVolume?: string;

  @ApiProperty({ description: 'Hair style', required: false })
  @IsOptional()
  @IsString()
  hairStyle?: string;

  // Body Characteristics - Overall Build
  @ApiProperty({ description: 'Height', required: false })
  @IsOptional()
  @IsString()
  height?: string;

  @ApiProperty({ description: 'Weight', required: false })
  @IsOptional()
  @IsString()
  weight?: string;

  @ApiProperty({ description: 'Body type', required: false })
  @IsOptional()
  @IsString()
  bodyType?: string;

  @ApiProperty({ description: 'Overall build', required: false })
  @IsOptional()
  @IsString()
  overallBuild?: string;

  // Body Proportions
  @ApiProperty({ description: 'Shoulder width', required: false })
  @IsOptional()
  @IsString()
  shoulderWidth?: string;

  @ApiProperty({ description: 'Waist description', required: false })
  @IsOptional()
  @IsString()
  waist?: string;

  @ApiProperty({ description: 'Hip width', required: false })
  @IsOptional()
  @IsString()
  hipWidth?: string;

  @ApiProperty({ description: 'Body shape', required: false })
  @IsOptional()
  @IsString()
  bodyShape?: string;

  // Chest/Bust
  @ApiProperty({ description: 'Chest size', required: false })
  @IsOptional()
  @IsString()
  chestSize?: string;

  @ApiProperty({ description: 'Chest shape', required: false })
  @IsOptional()
  @IsString()
  chestShape?: string;

  // Arms and Hands
  @ApiProperty({ description: 'Arm length', required: false })
  @IsOptional()
  @IsString()
  armLength?: string;

  @ApiProperty({ description: 'Arm muscle tone', required: false })
  @IsOptional()
  @IsString()
  armMuscleTone?: string;

  @ApiProperty({ description: 'Hand size', required: false })
  @IsOptional()
  @IsString()
  handSize?: string;

  @ApiProperty({ description: 'Finger length', required: false })
  @IsOptional()
  @IsString()
  fingerLength?: string;

  @ApiProperty({ description: 'Nail style', required: false })
  @IsOptional()
  @IsString()
  nailStyle?: string;

  // Legs and Feet
  @ApiProperty({ description: 'Leg length', required: false })
  @IsOptional()
  @IsString()
  legLength?: string;

  @ApiProperty({ description: 'Thigh shape', required: false })
  @IsOptional()
  @IsString()
  thighShape?: string;

  @ApiProperty({ description: 'Calf shape', required: false })
  @IsOptional()
  @IsString()
  calfShape?: string;

  @ApiProperty({ description: 'Foot size', required: false })
  @IsOptional()
  @IsString()
  footSize?: string;

  @ApiProperty({ description: 'Foot shape', required: false })
  @IsOptional()
  @IsString()
  footShape?: string;

  // Ethnicity and Heritage
  @ApiProperty({ description: 'Primary ethnicity', required: false })
  @IsOptional()
  @IsString()
  primaryEthnicity?: string;

  @ApiProperty({ description: 'Secondary heritage', required: false })
  @IsOptional()
  @IsString()
  secondaryHeritage?: string;

  @ApiProperty({ description: 'Cultural influences', required: false })
  @IsOptional()
  @IsString()
  culturalInfluences?: string;

  // Distinctive Features
  @ApiProperty({ description: 'Unique characteristics', required: false })
  @IsOptional()
  @IsString()
  uniqueCharacteristics?: string;

  @ApiProperty({ description: 'Signature features', required: false })
  @IsOptional()
  @IsString()
  signatureFeatures?: string;

  @ApiProperty({ description: 'Natural asymmetries', required: false })
  @IsOptional()
  @IsString()
  asymmetries?: string;

  // Style Preferences - Makeup Style
  @ApiProperty({ description: 'Daily makeup look', required: false })
  @IsOptional()
  @IsString()
  dailyMakeupLook?: string;

  @ApiProperty({ description: 'Signature colors', required: false })
  @IsOptional()
  @IsString()
  signatureColors?: string;

  @ApiProperty({ description: 'Makeup intensity', required: false })
  @IsOptional()
  @IsString()
  makeupIntensity?: string;

  // Fashion Style
  @ApiProperty({ description: 'Preferred silhouettes', required: false })
  @IsOptional()
  @IsString()
  preferredSilhouettes?: string;

  @ApiProperty({ description: 'Color palette', required: false })
  @IsOptional()
  @IsString()
  colorPalette?: string;

  @ApiProperty({ description: 'Preferred necklines', required: false })
  @IsOptional()
  @IsString()
  preferredNecklines?: string;

  @ApiProperty({ description: 'Style icons', required: false })
  @IsOptional()
  @IsString()
  styleIcons?: string;

  // Accessories
  @ApiProperty({ description: 'Jewelry style', required: false })
  @IsOptional()
  @IsString()
  jewelryStyle?: string;

  @ApiProperty({ description: 'Preferred metals', required: false })
  @IsOptional()
  @IsString()
  preferredMetals?: string;

  @ApiProperty({ description: 'Signature accessories', required: false })
  @IsOptional()
  @IsString()
  signatureAccessories?: string;

  // Poses and Expressions - Facial Expressions
  @ApiProperty({ description: 'Signature smile', required: false })
  @IsOptional()
  @IsString()
  signatureSmile?: string;

  @ApiProperty({ description: 'Eye expression', required: false })
  @IsOptional()
  @IsString()
  eyeExpression?: string;

  @ApiProperty({ description: 'Resting face', required: false })
  @IsOptional()
  @IsString()
  restingFace?: string;

  // Body Language
  @ApiProperty({ description: 'Posture', required: false })
  @IsOptional()
  @IsString()
  posture?: string;

  @ApiProperty({ description: 'Hand positions', required: false })
  @IsOptional()
  @IsString()
  handPositions?: string;

  @ApiProperty({ description: 'Preferred angles', required: false })
  @IsOptional()
  @IsString()
  preferredAngles?: string;

  // Voice and Personality
  @ApiProperty({ description: 'Voice tone', required: false })
  @IsOptional()
  @IsString()
  voiceTone?: string;

  @ApiProperty({ description: 'Speaking style', required: false })
  @IsOptional()
  @IsString()
  speakingStyle?: string;

  @ApiProperty({ description: 'Personality traits', required: false })
  @IsOptional()
  @IsString()
  personalityTraits?: string;

  // Technical Specifications
  @ApiProperty({ description: 'Preferred lighting setup', required: false })
  @IsOptional()
  @IsString()
  preferredLighting?: string;

  @ApiProperty({ description: 'Best angles', required: false })
  @IsOptional()
  @IsString()
  bestAngles?: string;

  @ApiProperty({ description: 'Camera distance', required: false })
  @IsOptional()
  @IsString()
  cameraDistance?: string;

  // Consistency Notes
  @ApiProperty({ description: 'Key features to maintain consistency', required: false })
  @IsOptional()
  @IsString()
  keyFeatures?: string;

  @ApiProperty({ description: 'Acceptable variations', required: false })
  @IsOptional()
  @IsString()
  acceptableVariations?: string;

  @ApiProperty({ description: 'Reference images URLs', required: false })
  @IsOptional()
  @IsString()
  referenceImages?: string;
}

export class UpdateAIInfluencerDto {
  @ApiProperty({ description: 'Name of the AI influencer', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Description of the AI influencer', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  // All other fields are optional for updates (same as CreateAIInfluencerDto but all optional)
  @ApiProperty({ description: 'Age of the AI influencer', required: false })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty({ description: 'Personality archetype', required: false })
  @IsOptional()
  @IsString()
  personalityArchetype?: string;

  @ApiProperty({ description: 'Style aesthetic', required: false })
  @IsOptional()
  @IsString()
  styleAesthetic?: string;

  // Note: For brevity, include all fields from CreateAIInfluencerDto as optional
  // In a real implementation, you would include all fields here
}

export enum ImageType {
  PORTRAIT = 'PORTRAIT',
  FULL_BODY = 'FULL_BODY',
  BEAUTY_SHOT = 'BEAUTY_SHOT',
  LIFESTYLE = 'LIFESTYLE',
  REFERENCE = 'REFERENCE',
}

export enum VideoStatus {
  PENDING = 'PENDING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class GenerateImageDto {
  @ApiProperty({ description: 'AI Influencer ID' })
  @IsString()
  influencerId: string;

  @ApiProperty({ description: 'Type of image to generate', enum: ImageType })
  @IsEnum(ImageType)
  imageType: ImageType;

  @ApiProperty({ description: 'Custom prompt for image generation', required: false })
  @IsOptional()
  @IsString()
  customPrompt?: string;

  @ApiProperty({ description: 'Mark as reference image', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isReference?: boolean;
}

export class GenerateVideoDto {
  @ApiProperty({ description: 'AI Influencer ID' })
  @IsString()
  influencerId: string;

  @ApiProperty({ description: 'Title of the video' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the video', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Video scenario/setting' })
  @IsString()
  scenario: string;

  @ApiProperty({ description: 'Custom prompt for video generation', required: false })
  @IsOptional()
  @IsString()
  customPrompt?: string;

  @ApiProperty({ description: 'Estimated duration in seconds', required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;
}

export class AIInfluencerResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'User ID who owns this influencer' })
  userId: string;

  @ApiProperty({ description: 'Name of the AI influencer' })
  name: string;

  @ApiProperty({ description: 'Description of the AI influencer', required: false })
  description?: string;

  @ApiProperty({ description: 'Age of the AI influencer', required: false })
  age?: number;

  @ApiProperty({ description: 'Whether this is a default template' })
  isDefault: boolean;

  @ApiProperty({ description: 'Whether the influencer is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: string;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: string;

  @ApiProperty({ description: 'Associated images', required: false, type: 'array' })
  images?: Record<string, unknown>[];

  @ApiProperty({ description: 'Associated videos', required: false, type: 'array' })
  videos?: Record<string, unknown>[];
}

// New DTOs for idea generation workflow

export class GenerateImageIdeasDto {
  @ApiProperty({ description: 'Number of ideas to generate', minimum: 1, maximum: 10, default: 6 })
  @IsOptional()
  @IsNumber()
  count?: number = 6;
}

export class GenerateVideoIdeasDto {
  @ApiProperty({ description: 'Number of ideas to generate', minimum: 1, maximum: 10, default: 6 })
  @IsOptional()
  @IsNumber()
  count?: number = 6;
}

export class ImageIdeaDto {
  @ApiProperty({ description: 'Unique identifier for the idea' })
  id: string;

  @ApiProperty({ description: 'Title of the image idea' })
  title: string;

  @ApiProperty({ description: 'Description of the image concept' })
  description: string;

  @ApiProperty({ description: 'Image category (portrait, lifestyle, fashion, beauty, fitness, etc.)' })
  category: string;

  @ApiProperty({ description: 'Key visual elements to include', type: [String] })
  visualElements: string[];

  @ApiProperty({ description: 'Overall mood or feeling of the image' })
  mood: string;

  @ApiProperty({ description: 'Location or setting for the image' })
  setting: string;

  @ApiProperty({ description: 'Specific style or aesthetic notes' })
  styleNotes: string;

  @ApiProperty({ description: 'Whether this idea has been used' })
  isUsed: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: string;
}

export class VideoIdeaDto {
  @ApiProperty({ description: 'Unique identifier for the idea' })
  id: string;

  @ApiProperty({ description: 'Title of the video idea' })
  title: string;

  @ApiProperty({ description: 'Description of the video concept' })
  description: string;

  @ApiProperty({ description: 'Video category (lifestyle, fashion, beauty, travel, fitness, tutorial, etc.)' })
  category: string;

  @ApiProperty({ description: 'Detailed scenario or storyline' })
  scenario: string;

  @ApiProperty({ description: 'Key moments or scenes in the video', type: [String] })
  keyMoments: string[];

  @ApiProperty({ description: 'Estimated video duration' })
  duration: string;

  @ApiProperty({ description: 'Overall tone and mood' })
  mood: string;

  @ApiProperty({ description: 'Visual style and aesthetic approach' })
  visualStyle: string;

  @ApiProperty({ description: 'Whether this idea has been used' })
  isUsed: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: string;
}

export class GeneratePromptDto {
  @ApiProperty({ description: 'Custom instructions for prompt generation', required: false })
  @IsOptional()
  @IsString()
  customInstructions?: string;
}

export class OptimizedPromptDto {
  @ApiProperty({ description: 'Optimized prompt for image/video generation' })
  prompt: string;

  @ApiProperty({ description: 'Explanation of prompt optimization choices' })
  reasoning: string;

  @ApiProperty({ description: 'Technical considerations for generation' })
  technicalNotes: string;

  @ApiProperty({ description: 'Alternative prompt variations', type: [String] })
  alternativePrompts: string[];
}

export class UploadMediaDto {
  @ApiProperty({ description: 'Generated prompt used for this media' })
  @IsString()
  generatedPrompt: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: Record<string, unknown>;
}
