export interface AIInfluencer {
  id: string;
  userId: string;
  name: string;
  description?: string;

  // Character Identity
  age?: number;
  personalityArchetype?: string;
  styleAesthetic?: string;

  // Facial Features - Face Structure
  faceShape?: string;
  jawline?: string;
  cheekbones?: string;
  forehead?: string;
  chin?: string;

  // Eyes
  eyeShape?: string;
  eyeColor?: string;
  eyeSize?: string;
  eyebrowShape?: string;
  eyebrowColor?: string;
  eyelashes?: string;

  // Nose
  noseShape?: string;
  noseSize?: string;
  nostrilShape?: string;

  // Lips
  lipShape?: string;
  lipSize?: string;
  naturalLipColor?: string;

  // Skin
  skinTone?: string;
  skinTexture?: string;
  skinCondition?: string;
  complexion?: string;

  // Hair
  hairColor?: string;
  hairTexture?: string;
  hairLength?: string;
  hairVolume?: string;
  hairStyle?: string;

  // Body Characteristics - Overall Build
  height?: string;
  weight?: string;
  bodyType?: string;
  overallBuild?: string;

  // Body Proportions
  shoulderWidth?: string;
  waist?: string;
  hipWidth?: string;
  bodyShape?: string;

  // Chest/Bust
  chestSize?: string;
  chestShape?: string;

  // Arms and Hands
  armLength?: string;
  armMuscleTone?: string;
  handSize?: string;
  fingerLength?: string;
  nailStyle?: string;

  // Legs and Feet
  legLength?: string;
  thighShape?: string;
  calfShape?: string;
  footSize?: string;
  footShape?: string;

  // Ethnicity and Heritage
  primaryEthnicity?: string;
  secondaryHeritage?: string;
  culturalInfluences?: string;

  // Distinctive Features
  uniqueCharacteristics?: string;
  signatureFeatures?: string;
  asymmetries?: string;

  // Style Preferences - Makeup Style
  dailyMakeupLook?: string;
  signatureColors?: string;
  makeupIntensity?: string;

  // Fashion Style
  preferredSilhouettes?: string;
  colorPalette?: string;
  preferredNecklines?: string;
  styleIcons?: string;

  // Accessories
  jewelryStyle?: string;
  preferredMetals?: string;
  signatureAccessories?: string;

  // Poses and Expressions - Facial Expressions
  signatureSmile?: string;
  eyeExpression?: string;
  restingFace?: string;

  // Body Language
  posture?: string;
  handPositions?: string;
  preferredAngles?: string;

  // Voice and Personality
  voiceTone?: string;
  speakingStyle?: string;
  personalityTraits?: string;

  // Technical Specifications
  preferredLighting?: string;
  bestAngles?: string;
  cameraDistance?: string;

  // Consistency Notes
  keyFeatures?: string;
  acceptableVariations?: string;
  referenceImages?: string;

  // Base Image for Face Consistency
  baseImageUrl?: string;
  baseImagePrompt?: string;

  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  images?: InfluencerImage[];
  videos?: InfluencerVideo[];
  imageIdeas?: ImageIdea[];
  videoIdeas?: VideoIdea[];
}

export interface InfluencerImage {
  id: string;
  influencerId: string;
  imageIdeaId?: string;
  imageUrl: string;
  imageType: 'PORTRAIT' | 'FULL_BODY' | 'BEAUTY_SHOT' | 'LIFESTYLE' | 'REFERENCE';
  prompt?: string;
  isReference: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface InfluencerVideo {
  id: string;
  influencerId: string;
  videoIdeaId?: string;
  title: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  prompt: string;
  scenario?: string;
  duration?: number;
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAIInfluencerDto {
  name: string;
  description?: string;

  // Character Identity
  age?: number;
  personalityArchetype?: string;
  styleAesthetic?: string;

  // Facial Features - Face Structure
  faceShape?: string;
  jawline?: string;
  cheekbones?: string;
  forehead?: string;
  chin?: string;

  // Eyes
  eyeShape?: string;
  eyeColor?: string;
  eyeSize?: string;
  eyebrowShape?: string;
  eyebrowColor?: string;
  eyelashes?: string;

  // Nose
  noseShape?: string;
  noseSize?: string;
  nostrilShape?: string;

  // Lips
  lipShape?: string;
  lipSize?: string;
  naturalLipColor?: string;

  // Skin
  skinTone?: string;
  skinTexture?: string;
  skinCondition?: string;
  complexion?: string;

  // Hair
  hairColor?: string;
  hairTexture?: string;
  hairLength?: string;
  hairVolume?: string;
  hairStyle?: string;

  // Body Characteristics - Overall Build
  height?: string;
  weight?: string;
  bodyType?: string;
  overallBuild?: string;

  // Body Proportions
  shoulderWidth?: string;
  waist?: string;
  hipWidth?: string;
  bodyShape?: string;

  // Chest/Bust
  chestSize?: string;
  chestShape?: string;

  // Arms and Hands
  armLength?: string;
  armMuscleTone?: string;
  handSize?: string;
  fingerLength?: string;
  nailStyle?: string;

  // Legs and Feet
  legLength?: string;
  thighShape?: string;
  calfShape?: string;
  footSize?: string;
  footShape?: string;

  // Ethnicity and Heritage
  primaryEthnicity?: string;
  secondaryHeritage?: string;
  culturalInfluences?: string;

  // Distinctive Features
  uniqueCharacteristics?: string;
  signatureFeatures?: string;
  asymmetries?: string;

  // Style Preferences - Makeup Style
  dailyMakeupLook?: string;
  signatureColors?: string;
  makeupIntensity?: string;

  // Fashion Style
  preferredSilhouettes?: string;
  colorPalette?: string;
  preferredNecklines?: string;
  styleIcons?: string;

  // Accessories
  jewelryStyle?: string;
  preferredMetals?: string;
  signatureAccessories?: string;

  // Poses and Expressions - Facial Expressions
  signatureSmile?: string;
  eyeExpression?: string;
  restingFace?: string;

  // Body Language
  posture?: string;
  handPositions?: string;
  preferredAngles?: string;

  // Voice and Personality
  voiceTone?: string;
  speakingStyle?: string;
  personalityTraits?: string;

  // Technical Specifications
  preferredLighting?: string;
  bestAngles?: string;
  cameraDistance?: string;

  // Consistency Notes
  keyFeatures?: string;
  acceptableVariations?: string;
  referenceImages?: string;
}

export interface UpdateAIInfluencerDto {
  name?: string;
  description?: string;

  // Character Identity
  age?: number;
  personalityArchetype?: string;
  styleAesthetic?: string;

  // Facial Features - Face Structure
  faceShape?: string;
  jawline?: string;
  cheekbones?: string;
  forehead?: string;
  chin?: string;

  // Eyes
  eyeShape?: string;
  eyeColor?: string;
  eyeSize?: string;
  eyebrowShape?: string;
  eyebrowColor?: string;
  eyelashes?: string;

  // Nose
  noseShape?: string;
  noseSize?: string;
  nostrilShape?: string;

  // Lips
  lipShape?: string;
  lipSize?: string;
  naturalLipColor?: string;

  // Skin
  skinTone?: string;
  skinTexture?: string;
  skinCondition?: string;
  complexion?: string;

  // Hair
  hairColor?: string;
  hairTexture?: string;
  hairLength?: string;
  hairVolume?: string;
  hairStyle?: string;

  // Body Characteristics - Overall Build
  height?: string;
  weight?: string;
  bodyType?: string;
  overallBuild?: string;

  // Body Proportions
  shoulderWidth?: string;
  waist?: string;
  hipWidth?: string;
  bodyShape?: string;

  // Chest/Bust
  chestSize?: string;
  chestShape?: string;

  // Arms and Hands
  armLength?: string;
  armMuscleTone?: string;
  handSize?: string;
  fingerLength?: string;
  nailStyle?: string;

  // Legs and Feet
  legLength?: string;
  thighShape?: string;
  calfShape?: string;
  footSize?: string;
  footShape?: string;

  // Ethnicity and Heritage
  primaryEthnicity?: string;
  secondaryHeritage?: string;
  culturalInfluences?: string;

  // Distinctive Features
  uniqueCharacteristics?: string;
  signatureFeatures?: string;
  asymmetries?: string;

  // Style Preferences - Makeup Style
  dailyMakeupLook?: string;
  signatureColors?: string;
  makeupIntensity?: string;

  // Fashion Style
  preferredSilhouettes?: string;
  colorPalette?: string;
  preferredNecklines?: string;
  styleIcons?: string;

  // Accessories
  jewelryStyle?: string;
  preferredMetals?: string;
  signatureAccessories?: string;

  // Poses and Expressions - Facial Expressions
  signatureSmile?: string;
  eyeExpression?: string;
  restingFace?: string;

  // Body Language
  posture?: string;
  handPositions?: string;
  preferredAngles?: string;

  // Voice and Personality
  voiceTone?: string;
  speakingStyle?: string;
  personalityTraits?: string;

  // Technical Specifications
  preferredLighting?: string;
  bestAngles?: string;
  cameraDistance?: string;

  // Consistency Notes
  keyFeatures?: string;
  acceptableVariations?: string;
  referenceImages?: string;
}

export interface ImageGenerationRequest {
  influencerId: string;
  imageType: 'PORTRAIT' | 'FULL_BODY' | 'BEAUTY_SHOT' | 'LIFESTYLE' | 'REFERENCE';
  prompt?: string;
  customPrompt?: string;
}

export interface VideoGenerationRequest {
  influencerId: string;
  title: string;
  description?: string;
  scenario: string;
  customPrompt?: string;
}

// ============================================================================
// NEW IDEA GENERATION WORKFLOW TYPES
// ============================================================================

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
}

export interface OptimizedPrompt {
  prompt: string;
  reasoning: string;
  technicalNotes: string;
  alternativePrompts: string[];
}

export interface GenerateImageIdeasRequest {
  count?: number;
}

export interface GenerateVideoIdeasRequest {
  count?: number;
}

export interface GeneratePromptRequest {
  customInstructions?: string;
}

export interface UploadMediaRequest {
  generatedPrompt: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// LEGACY TYPES (Deprecated but kept for backward compatibility)
// ============================================================================

export interface GenerationProgress {
  step: string;
  progress: number;
  message: string;
  isComplete: boolean;
  error?: string;
}

// Legacy VideoIdea interface for backward compatibility
export interface LegacyVideoIdea {
  id: string;
  title: string;
  description: string;
  scenario: string;
  estimatedDuration: number;
  category: 'lifestyle' | 'fashion' | 'fitness' | 'beauty' | 'dance' | 'travel' | 'cooking';
}

// ============================================================================
// BASE IMAGE MANAGEMENT TYPES
// ============================================================================

export interface GenerateBaseImagePromptRequest {
  influencerId: string;
  customInstructions?: string;
}

export interface RegenerateBaseImagePromptRequest {
  influencerId: string;
  currentPrompt: string;
  customInstructions: string;
}

export interface GenerateBaseImageRequest {
  influencerId: string;
  prompt: string;
  imageType?: 'PORTRAIT' | 'FULL_BODY' | 'BEAUTY_SHOT' | 'LIFESTYLE' | 'REFERENCE';
}

export interface SaveBaseImageRequest {
  influencerId: string;
  imageUrl: string;
  prompt: string;
}

export interface BaseImageGenerationResponse {
  imageUrl: string;
  metadata: Record<string, unknown>;
}
