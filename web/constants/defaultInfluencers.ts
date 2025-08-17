import { CreateAIInfluencerDto } from '@/types';

export const DEFAULT_INFLUENCERS: CreateAIInfluencerDto[] = [
  {
    name: 'Sophia Chen',
    description: 'A sophisticated East Asian beauty with a minimalist aesthetic and confident presence',

    // Character Identity
    age: 24,
    personalityArchetype: 'Sophisticated',
    styleAesthetic: 'Minimalist',

    // Facial Features - Face Structure
    faceShape: 'Oval',
    jawline: 'Soft and refined',
    cheekbones: 'High and subtle',
    forehead: 'Average height, proportionate',
    chin: 'Delicate and pointed',

    // Eyes
    eyeShape: 'Almond',
    eyeColor: 'Deep Brown #2C1810',
    eyeSize: 'Medium',
    eyebrowShape: 'Naturally arched, medium thickness',
    eyebrowColor: 'Dark brown matching hair',
    eyelashes: 'Long and naturally curled',

    // Nose
    noseShape: 'Straight and refined',
    noseSize: 'Small to medium',
    nostrilShape: 'Narrow and delicate',

    // Lips
    lipShape: "Heart-shaped with defined cupid's bow",
    lipSize: 'Medium, naturally full',
    naturalLipColor: 'Rose Pink #FF8FA3',

    // Skin
    skinTone: 'Light to medium with golden undertones',
    skinTexture: 'Smooth and poreless',
    skinCondition: 'Clear with natural glow',
    complexion: 'Dewy and luminous',

    // Hair
    hairColor: 'Raven Black with subtle blue undertones',
    hairTexture: 'Straight and silky',
    hairLength: 'Long, reaching mid-back',
    hairVolume: 'Medium thickness',
    hairStyle: 'Sleek and straight, often center-parted',

    // Body Characteristics - Overall Build
    height: '5\'6" (168cm)',
    weight: '120-125 lbs (54-57kg)',
    bodyType: 'Ectomorph',
    overallBuild: 'Slim and elegant',

    // Body Proportions
    shoulderWidth: 'Narrow',
    waist: 'Defined',
    hipWidth: 'Narrow to medium',
    bodyShape: 'Rectangle with subtle curves',

    // Chest/Bust
    chestSize: '32B',
    chestShape: 'Natural and proportionate',

    // Arms and Hands
    armLength: 'Proportionate',
    armMuscleTone: 'Soft and elegant',
    handSize: 'Small and delicate',
    fingerLength: 'Long and slender',
    nailStyle: 'Natural, medium length, nude polish',

    // Legs and Feet
    legLength: 'Long and proportionate',
    thighShape: 'Slim and toned',
    calfShape: 'Defined but not muscular',
    footSize: 'Size 7 US (37 EU)',
    footShape: 'Narrow and elegant',

    // Ethnicity and Heritage
    primaryEthnicity: 'East Asian',
    culturalInfluences: 'Modern urban Asian aesthetic',

    // Distinctive Features
    uniqueCharacteristics: 'Small beauty mark near left eye',
    signatureFeatures: 'Piercing almond eyes and heart-shaped lips',
    asymmetries: 'Slight left eyebrow arch higher than right',

    // Style Preferences - Makeup Style
    dailyMakeupLook: 'Natural with subtle enhancement',
    signatureColors: 'Neutrals, black, white, soft pastels',
    makeupIntensity: 'Light to medium',

    // Fashion Style
    preferredSilhouettes: 'Clean lines, tailored fits',
    colorPalette: 'Monochromatic neutrals',
    preferredNecklines: 'V-neck, scoop neck',
    styleIcons: 'Audrey Hepburn, modern minimalists',

    // Accessories
    jewelryStyle: 'Minimalist gold pieces',
    preferredMetals: 'Gold',
    signatureAccessories: 'Delicate gold chain necklace',

    // Poses and Expressions - Facial Expressions
    signatureSmile: 'Subtle, mysterious smile',
    eyeExpression: 'Intense and focused gaze',
    restingFace: 'Serene and confident',

    // Body Language
    posture: 'Graceful and straight',
    handPositions: 'Natural at sides or gently posed',
    preferredAngles: 'Three-quarter view, profile shots',

    // Voice and Personality
    voiceTone: 'Soft and measured',
    speakingStyle: 'Thoughtful and articulate',
    personalityTraits: 'Intelligent, composed, mysterious',

    // Technical Specifications
    preferredLighting: 'Soft natural light with subtle shadows',
    bestAngles: 'Three-quarter view, profile shots',
    cameraDistance: 'Medium to close-up for portraits',

    // Consistency Notes
    keyFeatures: 'Almond eyes, heart-shaped lips, sleek black hair, golden skin tone',
    acceptableVariations: 'Hair styling, makeup intensity, clothing style',
    referenceImages: 'Portrait references with consistent facial features',
  },

  {
    name: 'Isabella Rodriguez',
    description: 'A vibrant Latin American beauty with glamorous style and warm, confident energy',

    // Character Identity
    age: 26,
    personalityArchetype: 'Confident',
    styleAesthetic: 'Glamorous',

    // Facial Features - Face Structure
    faceShape: 'Heart',
    jawline: 'Soft and feminine',
    cheekbones: 'High and prominent',
    forehead: 'Wide and smooth',
    chin: 'Pointed and delicate',

    // Eyes
    eyeShape: 'Large and round',
    eyeColor: 'Warm Hazel #8B4513',
    eyeSize: 'Large',
    eyebrowShape: 'Arched and bold',
    eyebrowColor: 'Dark brown',
    eyelashes: 'Thick and dramatic',

    // Nose
    noseShape: 'Straight with slight curve',
    noseSize: 'Medium',
    nostrilShape: 'Medium width',

    // Lips
    lipShape: 'Full and plump',
    lipSize: 'Large and voluptuous',
    naturalLipColor: 'Coral #FF6B35',

    // Skin
    skinTone: 'Medium with warm golden undertones',
    skinTexture: 'Smooth with natural warmth',
    skinCondition: 'Clear with subtle freckles across nose',
    complexion: 'Radiant and glowing',

    // Hair
    hairColor: 'Rich Chocolate Brown with caramel highlights',
    hairTexture: 'Wavy and voluminous',
    hairLength: 'Long, past shoulders',
    hairVolume: 'Thick and full',
    hairStyle: 'Loose waves with layers',

    // Body Characteristics - Overall Build
    height: '5\'7" (170cm)',
    weight: '135-140 lbs (61-64kg)',
    bodyType: 'Mesomorph',
    overallBuild: 'Curvy and athletic',

    // Body Proportions
    shoulderWidth: 'Medium',
    waist: 'Defined and narrow',
    hipWidth: 'Wide and curvy',
    bodyShape: 'Hourglass',

    // Chest/Bust
    chestSize: '34D',
    chestShape: 'Full and rounded',

    // Arms and Hands
    armLength: 'Proportionate',
    armMuscleTone: 'Toned and feminine',
    handSize: 'Medium',
    fingerLength: 'Medium, well-proportioned',
    nailStyle: 'Manicured, medium length, coral or nude',

    // Legs and Feet
    legLength: 'Long and shapely',
    thighShape: 'Curvy and toned',
    calfShape: 'Defined and feminine',
    footSize: 'Size 8 US (38.5 EU)',
    footShape: 'Medium width, elegant arch',

    // Ethnicity and Heritage
    primaryEthnicity: 'Latin American',
    culturalInfluences: 'Vibrant Latin culture with modern glamour',

    // Distinctive Features
    uniqueCharacteristics: 'Dimples when smiling, light freckles',
    signatureFeatures: 'Large hazel eyes and full, expressive lips',
    asymmetries: 'Slight dimple only on right cheek',

    // Style Preferences - Makeup Style
    dailyMakeupLook: 'Glam with bold eyes or lips',
    signatureColors: 'Rich jewel tones, golds, corals',
    makeupIntensity: 'Medium to full coverage',

    // Fashion Style
    preferredSilhouettes: 'Body-hugging, emphasizing curves',
    colorPalette: 'Warm and vibrant colors',
    preferredNecklines: 'V-neck, off-shoulder, sweetheart',
    styleIcons: 'Sofia Vergara, Jennifer Lopez',

    // Accessories
    jewelryStyle: 'Statement pieces, gold',
    preferredMetals: 'Gold',
    signatureAccessories: 'Large hoop earrings, layered necklaces',

    // Poses and Expressions - Facial Expressions
    signatureSmile: 'Bright, confident full smile',
    eyeExpression: 'Warm and inviting gaze',
    restingFace: 'Approachable and confident',

    // Body Language
    posture: 'Confident with curves emphasized',
    handPositions: 'On hips, expressive gestures',
    preferredAngles: 'Straight-on and three-quarter views',

    // Voice and Personality
    voiceTone: 'Warm and animated',
    speakingStyle: 'Expressive and confident',
    personalityTraits: 'Charismatic, warm, outgoing',

    // Technical Specifications
    preferredLighting: 'Warm golden lighting',
    bestAngles: 'Straight-on and three-quarter views',
    cameraDistance: 'Medium shots to show curves, close-ups for beauty',

    // Consistency Notes
    keyFeatures: 'Large hazel eyes, full lips, voluminous wavy hair, hourglass figure',
    acceptableVariations: 'Hair styling variations, makeup intensity',
    referenceImages: 'Glamour shots emphasizing curves and warmth',
  },

  {
    name: 'Emma Thompson',
    description: 'A classic Northern European beauty with athletic grace and natural charm',

    // Character Identity
    age: 23,
    personalityArchetype: 'Athletic',
    styleAesthetic: 'Athletic Chic',

    // Facial Features - Face Structure
    faceShape: 'Square with soft edges',
    jawline: 'Strong but feminine',
    cheekbones: 'Defined and angular',
    forehead: 'High and clear',
    chin: 'Square and strong',

    // Eyes
    eyeShape: 'Upturned and bright',
    eyeColor: 'Ocean Blue #006994',
    eyeSize: 'Medium to large',
    eyebrowShape: 'Straight and natural',
    eyebrowColor: 'Light brown',
    eyelashes: 'Natural and light',

    // Nose
    noseShape: 'Straight and proportionate',
    noseSize: 'Medium',
    nostrilShape: 'Narrow',

    // Lips
    lipShape: 'Natural and balanced',
    lipSize: 'Medium',
    naturalLipColor: 'Natural Pink #FFC0CB',

    // Skin
    skinTone: 'Fair with pink undertones',
    skinTexture: 'Smooth with visible pores',
    skinCondition: 'Clear with light freckles',
    complexion: 'Natural and healthy',

    // Hair
    hairColor: 'Golden Blonde with natural highlights',
    hairTexture: 'Straight to slightly wavy',
    hairLength: 'Shoulder-length',
    hairVolume: 'Medium',
    hairStyle: 'Natural and tousled',

    // Body Characteristics - Overall Build
    height: '5\'8" (173cm)',
    weight: '140-145 lbs (64-66kg)',
    bodyType: 'Mesomorph',
    overallBuild: 'Athletic and toned',

    // Body Proportions
    shoulderWidth: 'Medium to broad',
    waist: 'Defined but not narrow',
    hipWidth: 'Medium',
    bodyShape: 'Rectangle with athletic curves',

    // Chest/Bust
    chestSize: '34C',
    chestShape: 'Athletic and firm',

    // Arms and Hands
    armLength: 'Proportionate',
    armMuscleTone: 'Toned and defined',
    handSize: 'Medium',
    fingerLength: 'Medium, strong',
    nailStyle: 'Short, natural, clear polish',

    // Legs and Feet
    legLength: 'Long and athletic',
    thighShape: 'Muscular and toned',
    calfShape: 'Well-defined and strong',
    footSize: 'Size 9 US (40 EU)',
    footShape: 'Medium width, athletic',

    // Ethnicity and Heritage
    primaryEthnicity: 'Northern European',
    culturalInfluences: 'Scandinavian minimalism with athletic lifestyle',

    // Distinctive Features
    uniqueCharacteristics: 'Light freckles, athletic build',
    signatureFeatures: 'Ocean blue eyes and strong, athletic physique',
    asymmetries: 'Slightly stronger left shoulder from sports',

    // Style Preferences - Makeup Style
    dailyMakeupLook: 'Natural and fresh',
    signatureColors: 'Blues, whites, natural tones',
    makeupIntensity: 'Light and natural',

    // Fashion Style
    preferredSilhouettes: 'Sporty, comfortable, tailored',
    colorPalette: 'Cool tones and neutrals',
    preferredNecklines: 'Crew neck, tank tops, athletic wear',
    styleIcons: 'Athletic models, Scandinavian minimalists',

    // Accessories
    jewelryStyle: 'Simple and minimal',
    preferredMetals: 'Silver',
    signatureAccessories: 'Simple silver studs, fitness tracker',

    // Poses and Expressions - Facial Expressions
    signatureSmile: 'Genuine and bright',
    eyeExpression: 'Clear and determined',
    restingFace: 'Focused and strong',

    // Body Language
    posture: 'Athletic and confident',
    handPositions: 'Natural, active poses',
    preferredAngles: 'Dynamic angles showing strength',

    // Voice and Personality
    voiceTone: 'Clear and confident',
    speakingStyle: 'Direct and genuine',
    personalityTraits: 'Determined, honest, energetic',

    // Technical Specifications
    preferredLighting: 'Natural daylight',
    bestAngles: 'Dynamic angles showing strength',
    cameraDistance: 'Full body for athletic shots, medium for portraits',

    // Consistency Notes
    keyFeatures: 'Ocean blue eyes, golden blonde hair, athletic build, strong jawline',
    acceptableVariations: 'Athletic wear vs casual, hair in ponytail vs down',
    referenceImages: 'Athletic and lifestyle shots with natural lighting',
  },

  {
    name: 'Aria Patel',
    description: 'An elegant South Asian beauty with artistic flair and graceful presence',

    // Character Identity
    age: 25,
    personalityArchetype: 'Artistic',
    styleAesthetic: 'Bohemian Chic',

    // Facial Features - Face Structure
    faceShape: 'Diamond',
    jawline: 'Delicate and tapered',
    cheekbones: 'Sharp and prominent',
    forehead: 'Narrow and elegant',
    chin: 'Pointed and refined',

    // Eyes
    eyeShape: 'Large almond',
    eyeColor: 'Deep Emerald Green #355E3B',
    eyeSize: 'Large and expressive',
    eyebrowShape: 'Naturally arched and full',
    eyebrowColor: 'Dark brown',
    eyelashes: 'Long and thick',

    // Nose
    noseShape: 'Aquiline with character',
    noseSize: 'Medium',
    nostrilShape: 'Defined',

    // Lips
    lipShape: "Full with defined cupid's bow",
    lipSize: 'Medium to full',
    naturalLipColor: 'Deep Rose #C21807',

    // Skin
    skinTone: 'Medium with golden olive undertones',
    skinTexture: 'Smooth and radiant',
    skinCondition: 'Clear with natural luminosity',
    complexion: 'Warm and glowing',

    // Hair
    hairColor: 'Deep Black with burgundy undertones',
    hairTexture: 'Thick and wavy',
    hairLength: 'Very long, past waist',
    hairVolume: 'Voluminous and thick',
    hairStyle: 'Natural waves with layers',

    // Body Characteristics - Overall Build
    height: '5\'5" (165cm)',
    weight: '125-130 lbs (57-59kg)',
    bodyType: 'Ectomorph',
    overallBuild: 'Petite and graceful',

    // Body Proportions
    shoulderWidth: 'Narrow',
    waist: 'Very defined',
    hipWidth: 'Medium',
    bodyShape: 'Pear with elegant proportions',

    // Chest/Bust
    chestSize: '32C',
    chestShape: 'Natural and proportionate',

    // Arms and Hands
    armLength: 'Proportionate',
    armMuscleTone: 'Soft and graceful',
    handSize: 'Small and delicate',
    fingerLength: 'Long and artistic',
    nailStyle: 'Medium length, artistic nail art',

    // Legs and Feet
    legLength: 'Proportionate',
    thighShape: 'Soft and feminine',
    calfShape: 'Delicate and graceful',
    footSize: 'Size 6.5 US (37 EU)',
    footShape: 'Narrow and elegant',

    // Ethnicity and Heritage
    primaryEthnicity: 'South Asian',
    culturalInfluences: 'Rich Indian heritage with modern artistic expression',

    // Distinctive Features
    uniqueCharacteristics: 'Expressive eyes, graceful hand movements',
    signatureFeatures: 'Emerald green eyes and voluminous dark hair',
    asymmetries: 'Slight head tilt when contemplating',

    // Style Preferences - Makeup Style
    dailyMakeupLook: 'Bold eyes with natural base',
    signatureColors: 'Rich jewel tones, burgundy, gold',
    makeupIntensity: 'Medium with artistic flair',

    // Fashion Style
    preferredSilhouettes: 'Flowing, artistic, bohemian',
    colorPalette: 'Rich and warm colors',
    preferredNecklines: 'Off-shoulder, flowing necklines',
    styleIcons: 'Bohemian artists, cultural fashion icons',

    // Accessories
    jewelryStyle: 'Vintage and statement pieces',
    preferredMetals: 'Gold and mixed metals',
    signatureAccessories: 'Vintage gold bangles, artistic earrings',

    // Poses and Expressions - Facial Expressions
    signatureSmile: 'Mysterious and artistic',
    eyeExpression: 'Dreamy and creative',
    restingFace: 'Contemplative and serene',

    // Body Language
    posture: 'Graceful and fluid',
    handPositions: 'Expressive, artistic gestures',
    preferredAngles: 'Profile and three-quarter for dramatic effect',

    // Voice and Personality
    voiceTone: 'Soft and melodic',
    speakingStyle: 'Thoughtful and poetic',
    personalityTraits: 'Creative, intuitive, graceful',

    // Technical Specifications
    preferredLighting: 'Warm artistic lighting with shadows',
    bestAngles: 'Profile and three-quarter for dramatic effect',
    cameraDistance: 'Artistic compositions, varied distances',

    // Consistency Notes
    keyFeatures: 'Emerald green eyes, diamond face shape, voluminous dark hair, artistic presence',
    acceptableVariations: 'Hair styling, artistic makeup variations',
    referenceImages: 'Artistic portraits with dramatic lighting',
  },

  {
    name: 'Zara Williams',
    description: 'A striking mixed-heritage beauty with modern edge and playful confidence',

    // Character Identity
    age: 22,
    personalityArchetype: 'Playful',
    styleAesthetic: 'Street Style',

    // Facial Features - Face Structure
    faceShape: 'Oblong',
    jawline: 'Angular and defined',
    cheekbones: 'High and sculpted',
    forehead: 'High and broad',
    chin: 'Strong and square',

    // Eyes
    eyeShape: 'Hooded and mysterious',
    eyeColor: 'Light Amber #FFBF00',
    eyeSize: 'Medium',
    eyebrowShape: 'Thick and straight',
    eyebrowColor: 'Dark brown',
    eyelashes: 'Natural and defined',

    // Nose
    noseShape: 'Wide and strong',
    noseSize: 'Medium to large',
    nostrilShape: 'Wide and expressive',

    // Lips
    lipShape: 'Full and wide',
    lipSize: 'Large and bold',
    naturalLipColor: 'Deep Mauve #915F6D',

    // Skin
    skinTone: 'Deep with red undertones',
    skinTexture: 'Smooth with natural sheen',
    skinCondition: 'Clear and radiant',
    complexion: 'Rich and glowing',

    // Hair
    hairColor: 'Natural Black with copper highlights',
    hairTexture: 'Coily and textured',
    hairLength: 'Medium length, chin to shoulder',
    hairVolume: 'Full and voluminous',
    hairStyle: 'Natural texture with defined curls',

    // Body Characteristics - Overall Build
    height: '5\'9" (175cm)',
    weight: '145-150 lbs (66-68kg)',
    bodyType: 'Mesomorph',
    overallBuild: 'Tall and statuesque',

    // Body Proportions
    shoulderWidth: 'Broad and strong',
    waist: 'Defined',
    hipWidth: 'Wide and curvy',
    bodyShape: 'Inverted triangle with curves',

    // Chest/Bust
    chestSize: '36C',
    chestShape: 'Full and natural',

    // Arms and Hands
    armLength: 'Long and proportionate',
    armMuscleTone: 'Toned and strong',
    handSize: 'Large and expressive',
    fingerLength: 'Long and elegant',
    nailStyle: 'Long, bold colors or artistic designs',

    // Legs and Feet
    legLength: 'Very long and striking',
    thighShape: 'Muscular and powerful',
    calfShape: 'Defined and strong',
    footSize: 'Size 10 US (41 EU)',
    footShape: 'Long and narrow',

    // Ethnicity and Heritage
    primaryEthnicity: 'Mixed Heritage',
    secondaryHeritage: 'African and European',
    culturalInfluences: 'Urban street culture with high fashion edge',

    // Distinctive Features
    uniqueCharacteristics: 'Striking height, bold presence',
    signatureFeatures: 'Amber eyes and commanding stature',
    asymmetries: 'Slight natural hair part variation',

    // Style Preferences - Makeup Style
    dailyMakeupLook: 'Bold and experimental',
    signatureColors: 'Bold colors, neons, metallics',
    makeupIntensity: 'Full coverage with creative elements',

    // Fashion Style
    preferredSilhouettes: 'Oversized, structured, edgy',
    colorPalette: 'Bold and contrasting colors',
    preferredNecklines: 'High neck, off-shoulder, statement pieces',
    styleIcons: 'Street style icons, high fashion models',

    // Accessories
    jewelryStyle: 'Statement and mixed metals',
    preferredMetals: 'Mixed metals and unique pieces',
    signatureAccessories: 'Bold earrings, layered chains',

    // Poses and Expressions - Facial Expressions
    signatureSmile: 'Confident smirk',
    eyeExpression: 'Intense and playful',
    restingFace: 'Strong and confident',

    // Body Language
    posture: 'Powerful and commanding',
    handPositions: 'Expressive, confident gestures',
    preferredAngles: 'Strong angles that emphasize structure',

    // Voice and Personality
    voiceTone: 'Strong and confident',
    speakingStyle: 'Direct and expressive',
    personalityTraits: 'Bold, confident, trendsetting',

    // Technical Specifications
    preferredLighting: 'Dramatic with strong contrasts',
    bestAngles: 'Strong angles that emphasize structure',
    cameraDistance: 'Full body to show stature, dramatic close-ups',

    // Consistency Notes
    keyFeatures: 'Amber eyes, strong bone structure, natural coily hair, commanding presence',
    acceptableVariations: 'Hair styling, bold makeup experiments',
    referenceImages: 'Fashion and street style shots with dramatic lighting',
  },
];
