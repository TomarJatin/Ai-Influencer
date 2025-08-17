// Central configuration for all influencer form options

export const PERSONALITY_ARCHETYPES = [
  'Confident',
  'Playful',
  'Sophisticated',
  'Athletic',
  'Artistic',
  'Mysterious',
  'Elegant',
  'Adventurous',
  'Intellectual',
  'Rebellious',
] as const;

export const STYLE_AESTHETICS = [
  'Minimalist',
  'Glamorous',
  'Street Style',
  'Bohemian',
  'Athletic',
  'Vintage',
  'Gothic',
  'Preppy',
  'Romantic',
  'Edgy',
] as const;

export const ETHNICITIES = [
  'East Asian',
  'South Asian',
  'Southeast Asian',
  'Northern European',
  'Southern European',
  'Eastern European',
  'West African',
  'East African',
  'North African',
  'Latin American',
  'Middle Eastern',
  'Mixed Heritage',
  'Indigenous',
  'Caribbean',
  'Pacific Islander',
] as const;

export const FACE_SHAPES = [
  'Oval',
  'Round',
  'Square',
  'Heart',
  'Diamond',
  'Oblong',
  'Triangle',
  'Rectangle',
] as const;

export const JAWLINE_TYPES = [
  'Soft and refined',
  'Sharp and angular',
  'Strong and defined',
  'Delicate and feminine',
  'Square and prominent',
  'Rounded and gentle',
] as const;

export const CHEEKBONE_TYPES = [
  'High and prominent',
  'Subtle and soft',
  'Sharp and defined',
  'Rounded and full',
  'Low and wide',
  'Angular and sculpted',
] as const;

export const FOREHEAD_TYPES = [
  'Average height',
  'High and broad',
  'Low and narrow',
  'Wide and smooth',
  'Narrow and elegant',
  'Proportionate',
] as const;

export const CHIN_TYPES = [
  'Delicate and pointed',
  'Strong and square',
  'Rounded and soft',
  'Cleft chin',
  'Double chin',
  'Prominent and defined',
] as const;

export const EYE_SHAPES = [
  'Almond',
  'Round',
  'Hooded',
  'Monolid',
  'Upturned',
  'Downturned',
  'Deep-set',
  'Prominent',
] as const;

export const EYE_COLORS = [
  { name: 'Deep Brown', value: '#2C1810' },
  { name: 'Light Brown', value: '#8B4513' },
  { name: 'Hazel', value: '#8E7618' },
  { name: 'Green', value: '#355E3B' },
  { name: 'Blue', value: '#006994' },
  { name: 'Gray', value: '#708090' },
  { name: 'Amber', value: '#FFBF00' },
  { name: 'Violet', value: '#8B00FF' },
] as const;

export const EYE_SIZES = ['Small', 'Medium', 'Large'] as const;

export const EYEBROW_SHAPES = [
  'Naturally arched',
  'Straight and thick',
  'High arch',
  'Soft arch',
  'Angular and bold',
  'Thin and refined',
] as const;

export const EYELASH_TYPES = [
  'Long and curled',
  'Natural and medium',
  'Thick and dramatic',
  'Short and sparse',
  'Voluminous',
  'Fine and delicate',
] as const;

export const NOSE_SHAPES = [
  'Straight and refined',
  'Roman nose',
  'Button nose',
  'Aquiline',
  'Snub nose',
  'Wide nose',
  'Narrow nose',
] as const;

export const NOSE_SIZES = ['Small', 'Medium', 'Large'] as const;

export const NOSTRIL_SHAPES = [
  'Narrow and delicate',
  'Wide and flared',
  'Medium width',
  'Round',
  'Oval',
  'Defined',
] as const;

export const LIP_SHAPES = [
  'Heart-shaped with cupid\'s bow',
  'Full and plump',
  'Natural and balanced',
  'Thin and refined',
  'Wide and bold',
  'Asymmetrical',
] as const;

export const LIP_SIZES = ['Small', 'Medium', 'Large', 'Extra full'] as const;

export const LIP_COLORS = [
  { name: 'Rose Pink', value: '#FF8FA3' },
  { name: 'Coral', value: '#FF6B35' },
  { name: 'Natural Pink', value: '#FFC0CB' },
  { name: 'Deep Rose', value: '#C21807' },
  { name: 'Mauve', value: '#915F6D' },
  { name: 'Berry', value: '#8B0000' },
  { name: 'Nude', value: '#DEB887' },
] as const;

export const SKIN_TONES = [
  'Fair with pink undertones',
  'Fair with yellow undertones',
  'Light with golden undertones',
  'Medium with warm undertones',
  'Medium with olive undertones',
  'Deep with red undertones',
  'Deep with golden undertones',
  'Very deep with cool undertones',
] as const;

export const SKIN_TEXTURES = [
  'Smooth and poreless',
  'Natural with visible pores',
  'Textured',
  'Matte finish',
  'Naturally oily',
  'Dry and smooth',
] as const;

export const SKIN_CONDITIONS = [
  'Clear and flawless',
  'Clear with natural glow',
  'Light freckles',
  'Beauty marks',
  'Natural blemishes',
  'Dimples',
] as const;

export const COMPLEXIONS = [
  'Matte',
  'Dewy',
  'Natural Glow',
  'Luminous',
  'Radiant',
  'Satin finish',
] as const;

export const HAIR_COLORS = [
  { name: 'Raven Black', value: '#000000' },
  { name: 'Dark Brown', value: '#3C2415' },
  { name: 'Chocolate Brown', value: '#7B3F00' },
  { name: 'Light Brown', value: '#964B00' },
  { name: 'Golden Blonde', value: '#FFD700' },
  { name: 'Platinum Blonde', value: '#E5E4E2' },
  { name: 'Strawberry Blonde', value: '#FF8C69' },
  { name: 'Auburn', value: '#A52A2A' },
  { name: 'Copper Red', value: '#B87333' },
  { name: 'Silver Gray', value: '#C0C0C0' },
] as const;

export const HAIR_TEXTURES = ['Straight', 'Wavy', 'Curly', 'Coily'] as const;

export const HAIR_LENGTHS = [
  'Pixie cut',
  'Short bob',
  'Long bob (lob)',
  'Shoulder-length',
  'Mid-back length',
  'Waist length',
  'Hip length',
] as const;

export const HAIR_VOLUMES = [
  'Fine and thin',
  'Medium density',
  'Thick and full',
  'Voluminous',
  'Very thick',
] as const;

export const HAIR_STYLES = [
  'Sleek and straight',
  'Natural texture',
  'Layered cut',
  'Blunt cut',
  'Tousled waves',
  'Defined curls',
  'Beach waves',
] as const;

export const HEIGHTS = [
  '4\'10" (147cm)',
  '4\'11" (150cm)',
  '5\'0" (152cm)',
  '5\'1" (155cm)',
  '5\'2" (157cm)',
  '5\'3" (160cm)',
  '5\'4" (163cm)',
  '5\'5" (165cm)',
  '5\'6" (168cm)',
  '5\'7" (170cm)',
  '5\'8" (173cm)',
  '5\'9" (175cm)',
  '5\'10" (178cm)',
  '5\'11" (180cm)',
  '6\'0" (183cm)',
  '6\'1" (185cm)',
] as const;

export const WEIGHT_RANGES = [
  '90-100 lbs (41-45kg)',
  '100-110 lbs (45-50kg)',
  '110-120 lbs (50-54kg)',
  '120-130 lbs (54-59kg)',
  '130-140 lbs (59-64kg)',
  '140-150 lbs (64-68kg)',
  '150-160 lbs (68-73kg)',
  '160-170 lbs (73-77kg)',
  '170-180 lbs (77-82kg)',
  '180-190 lbs (82-86kg)',
] as const;

export const BODY_TYPES = ['Ectomorph', 'Mesomorph', 'Endomorph'] as const;

export const OVERALL_BUILDS = [
  'Petite and delicate',
  'Slim and elegant',
  'Athletic and toned',
  'Curvy and feminine',
  'Tall and statuesque',
  'Strong and muscular',
  'Soft and rounded',
] as const;

export const SHOULDER_WIDTHS = [
  'Narrow',
  'Medium',
  'Broad',
  'Extra broad',
] as const;

export const WAIST_TYPES = [
  'Very defined',
  'Defined',
  'Natural',
  'Straight',
  'Wide',
] as const;

export const HIP_WIDTHS = [
  'Narrow',
  'Medium',
  'Wide',
  'Very wide',
  'Curvy',
] as const;

export const BODY_SHAPES = [
  'Hourglass',
  'Pear',
  'Apple',
  'Rectangle',
  'Inverted Triangle',
  'Athletic',
] as const;

export const CHEST_SIZES = [
  '30A', '30B', '30C', '30D', '30DD',
  '32A', '32B', '32C', '32D', '32DD', '32DDD',
  '34A', '34B', '34C', '34D', '34DD', '34DDD',
  '36A', '36B', '36C', '36D', '36DD', '36DDD',
  '38B', '38C', '38D', '38DD', '38DDD',
  '40C', '40D', '40DD', '40DDD',
] as const;

export const CHEST_SHAPES = [
  'Natural and proportionate',
  'Round and full',
  'Teardrop shaped',
  'Athletic and firm',
  'Wide set',
  'Close set',
] as const;

export const ARM_LENGTHS = [
  'Short',
  'Proportionate',
  'Long',
] as const;

export const ARM_MUSCLE_TONES = [
  'Soft and feminine',
  'Lightly toned',
  'Well-defined',
  'Athletic and strong',
  'Very muscular',
] as const;

export const HAND_SIZES = [
  'Small and delicate',
  'Medium',
  'Large',
  'Long and elegant',
] as const;

export const FINGER_LENGTHS = [
  'Short',
  'Medium',
  'Long and slender',
  'Long and strong',
] as const;

export const NAIL_STYLES = [
  'Natural short',
  'Medium length natural',
  'Long natural',
  'Short manicured',
  'Medium manicured',
  'Long manicured',
  'Artistic nail art',
] as const;

export const LEG_LENGTHS = [
  'Short',
  'Proportionate',
  'Long',
  'Very long',
] as const;

export const THIGH_SHAPES = [
  'Slim',
  'Athletic',
  'Curvy',
  'Muscular',
  'Full',
] as const;

export const CALF_SHAPES = [
  'Slim',
  'Defined',
  'Muscular',
  'Soft',
  'Athletic',
] as const;

export const FOOT_SIZES = [
  'Size 5 US (35 EU)',
  'Size 5.5 US (35.5 EU)',
  'Size 6 US (36 EU)',
  'Size 6.5 US (37 EU)',
  'Size 7 US (37.5 EU)',
  'Size 7.5 US (38 EU)',
  'Size 8 US (38.5 EU)',
  'Size 8.5 US (39 EU)',
  'Size 9 US (40 EU)',
  'Size 9.5 US (40.5 EU)',
  'Size 10 US (41 EU)',
  'Size 10.5 US (41.5 EU)',
  'Size 11 US (42 EU)',
] as const;

export const FOOT_SHAPES = [
  'Narrow',
  'Medium width',
  'Wide',
  'High arch',
  'Flat feet',
  'Athletic',
] as const;

export const UNIQUE_CHARACTERISTICS = [
  'Small beauty mark',
  'Dimples when smiling',
  'Light freckles',
  'Natural gap between teeth',
  'Distinctive laugh lines',
  'Expressive eyebrows',
  'Graceful hand movements',
  'Natural head tilt',
  'Striking height',
  'Unique voice',
] as const;

export const SIGNATURE_FEATURES = [
  'Piercing eyes',
  'Captivating smile',
  'Strong jawline',
  'Elegant neck',
  'Expressive hands',
  'Athletic physique',
  'Graceful posture',
  'Distinctive hair',
  'Beautiful skin',
  'Commanding presence',
] as const;

export const ASYMMETRIES = [
  'Slight eyebrow height difference',
  'One dimple only',
  'Natural hair part variation',
  'Subtle smile asymmetry',
  'One eye slightly larger',
  'Shoulder height difference',
  'None - perfectly symmetrical',
] as const;

export const MAKEUP_LOOKS = [
  'Natural and fresh',
  'Subtle enhancement',
  'Classic elegance',
  'Bold and dramatic',
  'Smoky eyes',
  'Glowing skin focus',
  'Artistic and creative',
  'Minimalist',
] as const;

export const SIGNATURE_COLORS = [
  'Warm earth tones',
  'Cool blues and grays',
  'Rich jewel tones',
  'Soft pastels',
  'Bold and vibrant',
  'Monochromatic neutrals',
  'Black and white',
  'Metallic accents',
] as const;

export const MAKEUP_INTENSITIES = [
  'Very light',
  'Light and natural',
  'Medium coverage',
  'Full coverage',
  'Dramatic and bold',
] as const;

export const PREFERRED_SILHOUETTES = [
  'Fitted and tailored',
  'Flowy and feminine',
  'Structured and sharp',
  'Relaxed and casual',
  'Body-hugging',
  'Oversized and dramatic',
  'Classic and timeless',
] as const;

export const COLOR_PALETTES = [
  'Warm and vibrant',
  'Cool and calming',
  'Neutral and earthy',
  'Monochromatic',
  'Bold contrasts',
  'Soft and romantic',
  'Dark and mysterious',
] as const;

export const PREFERRED_NECKLINES = [
  'V-neck',
  'Scoop neck',
  'High neck',
  'Off-shoulder',
  'Sweetheart',
  'Crew neck',
  'Boat neck',
  'Halter neck',
] as const;

export const STYLE_ICONS = [
  'Audrey Hepburn',
  'Grace Kelly',
  'Marilyn Monroe',
  'Twiggy',
  'Diana Ross',
  'Madonna',
  'Kate Moss',
  'Rihanna',
  'Zendaya',
  'Timeless classics',
] as const;

export const JEWELRY_STYLES = [
  'Minimalist and delicate',
  'Statement pieces',
  'Vintage and antique',
  'Modern and geometric',
  'Bohemian and layered',
  'Classic and timeless',
  'Edgy and bold',
] as const;

export const PREFERRED_METALS = [
  'Gold',
  'Silver',
  'Rose Gold',
  'Mixed metals',
  'Platinum',
  'Copper',
] as const;

export const SIGNATURE_ACCESSORIES = [
  'Delicate necklace',
  'Statement earrings',
  'Classic watch',
  'Layered bracelets',
  'Vintage rings',
  'Hair accessories',
  'Sunglasses',
  'Scarves',
] as const;

export const SIGNATURE_SMILES = [
  'Bright and full',
  'Subtle and mysterious',
  'Confident smirk',
  'Gentle and warm',
  'Playful grin',
  'Elegant and refined',
  'Asymmetrical charm',
] as const;

export const EYE_EXPRESSIONS = [
  'Intense and focused',
  'Warm and inviting',
  'Dreamy and creative',
  'Clear and determined',
  'Soft and gentle',
  'Playful and mischievous',
  'Mysterious and alluring',
] as const;

export const RESTING_FACES = [
  'Serene and confident',
  'Approachable and friendly',
  'Contemplative and thoughtful',
  'Strong and determined',
  'Soft and peaceful',
  'Alert and engaged',
  'Mysterious and intriguing',
] as const;

export const POSTURES = [
  'Graceful and straight',
  'Confident and strong',
  'Relaxed and natural',
  'Athletic and poised',
  'Elegant and refined',
  'Casual and approachable',
  'Powerful and commanding',
] as const;

export const HAND_POSITIONS = [
  'Natural at sides',
  'Gently posed',
  'Expressive gestures',
  'On hips confidently',
  'Behind back gracefully',
  'Artistic positioning',
  'Active and dynamic',
] as const;

export const PREFERRED_ANGLES = [
  'Three-quarter view',
  'Profile shots',
  'Straight-on',
  'Dynamic angles',
  'Low angle for power',
  'High angle for elegance',
  'Multiple angles',
] as const;

export const VOICE_TONES = [
  'Soft and melodic',
  'Warm and animated',
  'Clear and confident',
  'Strong and commanding',
  'Gentle and soothing',
  'Bright and energetic',
  'Deep and resonant',
] as const;

export const SPEAKING_STYLES = [
  'Thoughtful and articulate',
  'Expressive and animated',
  'Direct and confident',
  'Soft-spoken and gentle',
  'Engaging and charismatic',
  'Measured and deliberate',
  'Spontaneous and natural',
] as const;

export const PERSONALITY_TRAITS = [
  'Intelligent and composed',
  'Charismatic and outgoing',
  'Creative and intuitive',
  'Determined and focused',
  'Warm and empathetic',
  'Bold and adventurous',
  'Elegant and sophisticated',
] as const;

export const PREFERRED_LIGHTING = [
  'Soft natural light',
  'Warm golden hour',
  'Dramatic studio lighting',
  'Bright and even',
  'Moody and atmospheric',
  'Backlit and ethereal',
  'High contrast',
] as const;

export const BEST_ANGLES = [
  'Three-quarter view',
  'Profile emphasis',
  'Straight-on power',
  'Dynamic movement',
  'Low angle strength',
  'High angle elegance',
  'Multiple perspectives',
] as const;

export const CAMERA_DISTANCES = [
  'Close-up for intimacy',
  'Medium for portraits',
  'Full body for fashion',
  'Wide for environment',
  'Varied for storytelling',
  'Artistic compositions',
] as const;

// Helper function to get display value for color options
export const getColorDisplay = (colorOptions: readonly { name: string; value: string }[]) => 
  colorOptions.map(color => ({
    value: color.value,
    label: color.name,
    color: color.value,
  }));

// Helper function to get simple select options
export const getSelectOptions = (options: readonly string[]) =>
  options.map(option => ({
    value: option,
    label: option,
  }));
