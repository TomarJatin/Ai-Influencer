# AI Influencer Image Generation Prompts

## Master Prompt Template for Face Generation

### High-Quality Portrait Prompt Structure

```
[SHOT TYPE] portrait photograph of a [AGE]-year-old [ETHNICITY] woman with [FACE_SHAPE] face shape, [SKIN_TONE] skin with [SKIN_TEXTURE], [EYE_SHAPE] [EYE_COLOR] eyes, [EYEBROW_DESCRIPTION] eyebrows, [NOSE_DESCRIPTION] nose, [LIP_DESCRIPTION] lips, [HAIR_COLOR] [HAIR_TEXTURE] [HAIR_LENGTH] hair styled [HAIR_STYLE]. [EXPRESSION_DESCRIPTION]. [LIGHTING_DESCRIPTION]. Shot with [CAMERA_SPECS]. [QUALITY_MODIFIERS].

Style: [PHOTOGRAPHY_STYLE]
Lighting: [SPECIFIC_LIGHTING_SETUP]
Background: [BACKGROUND_DESCRIPTION]
Mood: [MOOD_DESCRIPTION]

Technical specifications: 8K resolution, professional photography, sharp focus, detailed skin texture, natural skin pores, realistic lighting, color graded, shot on [CAMERA_MODEL], [LENS_SPECS], perfect exposure, no blur, no grain, photorealistic, hyperrealistic.
```

### Example Face Generation Prompt

```
Close-up portrait photograph of a 24-year-old mixed heritage (East Asian and Northern European) woman with oval face shape, medium skin tone with golden undertones and smooth texture, almond-shaped emerald green eyes, naturally arched medium-thickness dark brown eyebrows, straight medium-sized nose, full heart-shaped lips in natural rose pink, long chocolate brown hair with caramel highlights in loose waves flowing over one shoulder. Subtle confident smile with soft, approachable eyes looking directly at camera. Soft natural lighting from a large window creating gentle shadows that define facial structure.

Style: Contemporary portrait photography
Lighting: Soft window light from 45-degree angle, subtle fill light to prevent harsh shadows
Background: Neutral cream backdrop with subtle texture, slightly out of focus
Mood: Confident, approachable, sophisticated

Technical specifications: 8K resolution, professional photography, sharp focus on eyes, detailed skin texture showing natural skin pores, realistic lighting with soft shadows, color graded with warm tones, shot on Canon EOS R5, 85mm f/1.4 lens, perfect exposure, no blur, no grain, photorealistic, hyperrealistic.

Negative prompt: cartoon, anime, illustration, painting, drawing, art, sketch, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, skin spots, acnes, skin blemishes, age spot, glans, extra fingers, fewer fingers, strange fingers, bad hand, mole, ((extra limbs)), ((extra arms)), ((extra legs)), ((missing arms)), ((missing legs)), ((extra hands)), ((extra feet)), ((missing hands)), ((missing feet)), blurry, bad anatomy, bad proportions, gross proportions.
```

## Master Prompt Template for Full Body Generation

### Full Body Portrait Prompt Structure

```
Full body portrait photograph of a [AGE]-year-old [ETHNICITY] woman, [HEIGHT] tall with [BODY_TYPE] build. [FACE_DESCRIPTION_ABBREVIATED]. [BODY_PROPORTIONS_DESCRIPTION]. [OUTFIT_DESCRIPTION]. [POSE_DESCRIPTION]. [SETTING_DESCRIPTION]. [LIGHTING_DESCRIPTION]. [CAMERA_ANGLE_DESCRIPTION]. [QUALITY_MODIFIERS].

Pose: [SPECIFIC_POSE_DETAILS]
Outfit: [DETAILED_CLOTHING_DESCRIPTION]
Setting: [ENVIRONMENT_DETAILS]
Lighting: [LIGHTING_SETUP]
Composition: [FRAMING_AND_COMPOSITION_NOTES]

Technical specifications: 8K resolution, professional fashion photography, sharp focus throughout, detailed fabric textures, realistic body proportions, natural lighting, color graded, shot on [CAMERA_MODEL], [LENS_SPECS], perfect exposure, full body in frame.
```

### Example Full Body Generation Prompt

```
Full body portrait photograph of a 24-year-old mixed heritage (East Asian and Northern European) woman, 5'7" tall with athletic hourglass build. Oval face with emerald green almond eyes, chocolate brown wavy hair with caramel highlights flowing past shoulders, confident subtle smile. Toned arms, defined waist, proportionate hips, long legs with athletic muscle definition. Wearing a fitted cream-colored cashmere sweater tucked into high-waisted dark wash straight-leg jeans, nude pointed-toe ankle boots, delicate gold layered necklaces, small gold hoop earrings. Standing in a relaxed contrapposto pose with weight on right leg, left hand on hip, right arm naturally at side, head slightly tilted, looking directly at camera with confident expression. Modern minimalist studio setting with white seamless backdrop and subtle geometric shadows from window blinds creating interesting patterns on the floor.

Pose: Confident contrapposto stance, weight shifted to right leg, left hand on hip, right arm relaxed, slight head tilt, direct eye contact
Outfit: Cream cashmere sweater, dark wash straight jeans, nude ankle boots, gold jewelry - sophisticated casual style
Setting: Modern minimalist studio with white backdrop, geometric shadow patterns from blinds
Lighting: Soft natural window light from left side, subtle fill light to prevent harsh shadows, creating dimensional lighting on face and body
Composition: Full body centered in frame, shot from slightly below eye level to create empowering perspective

Technical specifications: 8K resolution, professional fashion photography, sharp focus throughout, detailed fabric textures showing cashmere weave and denim texture, realistic body proportions, natural skin texture, color graded with warm undertones, shot on Canon EOS R5, 50mm f/2.8 lens, perfect exposure, full body in frame, no crop.

Negative prompt: cartoon, anime, illustration, painting, drawing, art, sketch, (worst quality:2), (low quality:2), (normal quality:2), lowres, deformed, distorted body, bad anatomy, bad proportions, extra limbs, missing limbs, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, cropped body, out of frame.
```

## Specialized Prompt Variations

### Headshot/Professional Portrait
```
Professional headshot of [BASE_MODEL_DESCRIPTION], business casual styling, neutral expression with subtle confident smile, soft professional lighting, clean background, shot for corporate use, high-end portrait photography style.
```

### Fashion/Glamour Portrait
```
High-fashion portrait of [BASE_MODEL_DESCRIPTION], editorial makeup and styling, dramatic lighting, fashion photography aesthetic, designer clothing/accessories, artistic composition, shot for magazine cover.
```

### Lifestyle/Candid Portrait
```
Lifestyle portrait of [BASE_MODEL_DESCRIPTION], natural candid expression, environmental portrait setting, natural lighting, casual styling, authentic moment captured, documentary photography style.
```

### Beauty Close-up
```
Beauty close-up of [BASE_MODEL_DESCRIPTION], focus on facial features and skin texture, minimal makeup highlighting natural beauty, soft beauty lighting, macro lens detail, cosmetic photography style.
```

## Consistency Maintenance Prompts

### Reference Image Matching Prompt
```
Generate an image matching the exact appearance of the reference character: [DETAILED_CHARACTER_DESCRIPTION]. Maintain identical facial features, skin tone, hair color and style, eye color and shape, facial structure, and body proportions. [SPECIFIC_SCENARIO_DESCRIPTION].

Consistency requirements:
- Exact same facial bone structure and proportions
- Identical eye color [SPECIFIC_HEX_CODE]
- Same hair color and texture [SPECIFIC_DESCRIPTION]
- Matching skin tone [SPECIFIC_UNDERTONE_DESCRIPTION]
- Same body proportions and build
- Consistent facial expressions and personality traits
```

### Multi-Angle Generation Set
```
Generate a set of 4 images of the same person from different angles:
1. Front-facing portrait: [FULL_DESCRIPTION]
2. Three-quarter view (turned 45 degrees right): [SAME_PERSON_DESCRIPTION]
3. Profile view (turned 90 degrees right): [SAME_PERSON_DESCRIPTION]  
4. Three-quarter view (turned 45 degrees left): [SAME_PERSON_DESCRIPTION]

All images must maintain exact character consistency across all angles.
```

## Quality Enhancement Modifiers

### Ultra-High Quality Modifiers
```
, masterpiece, best quality, ultra high res, (photorealistic:1.4), raw photo, professional photography, studio lighting, sharp focus, physically-based rendering, extreme detail description, vivid colors, bokeh, portraits, professional, 8k, highly detailed, HDR, UHD, studio lighting, ultra-fine painting, sharp focus, physically-based rendering, extreme detail description, professional, vivid colors, bokeh
```

### Skin and Texture Enhancement
```
, detailed skin texture, visible skin pores, natural skin imperfections, realistic skin shading, subsurface scattering, detailed hair strands, individual hair texture, fabric texture detail, natural lighting on skin, skin microsurface detail
```

### Photography Technical Terms
```
, shot on Canon EOS R5, 85mm f/1.4 lens, shallow depth of field, professional color grading, perfect white balance, optimal exposure, tack sharp focus, bokeh background, professional retouching, commercial photography quality
```

## Negative Prompts (What to Avoid)

### Standard Negative Prompt
```
cartoon, anime, illustration, painting, drawing, art, sketch, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glans, extra fingers, fewer fingers, strange fingers, bad hand, mole, ((extra limbs)), ((extra arms)), ((extra legs)), ((missing arms)), ((missing legs)), ((extra hands)), ((extra feet)), ((missing hands)), ((missing feet))
```

### Face-Specific Negative Prompt
```
blurry face, distorted face, asymmetrical eyes, different sized eyes, lazy eye, cross-eyed, wall-eyed, weird eyes, bad eyes, ugly eyes, dead eyes, unrealistic eyes, oversized eyes, undersized eyes, missing eyebrows, unibrow, bad eyebrows, unrealistic eyebrows, bad nose, pig nose, unrealistic nose, bad mouth, bad lips, unrealistic lips, bad teeth, crooked teeth, yellow teeth, missing teeth, extra teeth, long neck, short neck, fat neck, skinny neck
```

### Body-Specific Negative Prompt
```
bad anatomy, bad proportions, gross proportions, distorted body, deformed body, mutated body, extra limbs, missing limbs, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, disfigured, malformed, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, cross-eyed
```

## Prompt Optimization Tips

### 1. Specificity Guidelines
- Use exact measurements when possible (5'7", size 34C, etc.)
- Include specific color codes or detailed color descriptions
- Specify camera equipment and technical settings
- Include lighting direction and quality descriptions

### 2. Consistency Keywords
- Always use the same character description base
- Reference specific features that must remain identical
- Use "maintaining exact appearance" or "identical to previous"
- Include reference to character name or identifier

### 3. Quality Assurance
- Always include negative prompts to avoid unwanted elements
- Use multiple quality modifiers for best results
- Specify resolution and technical requirements
- Include style and mood descriptors

### 4. Prompt Weight Management
- Use (word:1.2) to emphasize important features
- Use (word:0.8) to de-emphasize less important elements
- Critical features should have higher weights
- Balance prompt length vs. specificity

## Batch Generation Workflow

### Step 1: Character Establishment
Generate 5-10 reference images using the master prompt with slight variations in pose and expression to establish the character's appearance.

### Step 2: Consistency Testing  
Generate the same character in different scenarios to test consistency before proceeding to full production.

### Step 3: Production Generation
Use established character description with scenario-specific modifications for final image generation.

### Step 4: Quality Control
Review all generated images for consistency and quality before approval for use in video generation or other applications.
