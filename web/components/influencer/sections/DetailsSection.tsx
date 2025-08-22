'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIInfluencer } from '@/types';

interface DetailsSectionProps {
  influencer: AIInfluencer;
}

export function DetailsSection({ influencer }: DetailsSectionProps) {
  const DetailField = ({ 
    label, 
    value, 
    showColor = false 
  }: { 
    label: string; 
    value?: string | null; 
    showColor?: boolean;
  }) => {
    if (!value) return null;

    return (
      <div>
        <span className="font-medium text-muted-foreground">{label}:</span>
        <div className="mt-1 flex items-center gap-2">
          {showColor && (
            <div
              className="h-4 w-4 rounded-full border border-gray-300"
              style={{ backgroundColor: value }}
            />
          )}
          <p className="text-sm">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Character Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Character Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <DetailField label="Personality" value={influencer.personalityArchetype} />
            <DetailField label="Style Aesthetic" value={influencer.styleAesthetic} />
            <DetailField label="Primary Ethnicity" value={influencer.primaryEthnicity} />
            <DetailField label="Secondary Heritage" value={influencer.secondaryHeritage} />
            <DetailField label="Cultural Influences" value={influencer.culturalInfluences} />
          </div>
        </CardContent>
      </Card>

      {/* Physical Features - Face */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Facial Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <DetailField label="Face Shape" value={influencer.faceShape} />
            <DetailField label="Jawline" value={influencer.jawline} />
            <DetailField label="Cheekbones" value={influencer.cheekbones} />
            <DetailField label="Eye Shape" value={influencer.eyeShape} />
            <DetailField label="Eye Color" value={influencer.eyeColor} showColor />
            <DetailField label="Nose Shape" value={influencer.noseShape} />
            <DetailField label="Lip Shape" value={influencer.lipShape} />
            <DetailField label="Natural Lip Color" value={influencer.naturalLipColor} showColor />
          </div>
        </CardContent>
      </Card>

      {/* Skin & Hair */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skin & Hair</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <DetailField label="Skin Tone" value={influencer.skinTone} />
            <DetailField label="Skin Texture" value={influencer.skinTexture} />
            <DetailField label="Complexion" value={influencer.complexion} />
            <DetailField label="Hair Color" value={influencer.hairColor} showColor />
            <DetailField label="Hair Texture" value={influencer.hairTexture} />
            <DetailField label="Hair Length" value={influencer.hairLength} />
            <DetailField label="Hair Style" value={influencer.hairStyle} />
          </div>
        </CardContent>
      </Card>

      {/* Body Characteristics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Body Characteristics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <DetailField label="Height" value={influencer.height} />
            <DetailField label="Weight" value={influencer.weight} />
            <DetailField label="Body Type" value={influencer.bodyType} />
            <DetailField label="Overall Build" value={influencer.overallBuild} />
            <DetailField label="Body Shape" value={influencer.bodyShape} />
            <DetailField label="Shoulder Width" value={influencer.shoulderWidth} />
            <DetailField label="Waist" value={influencer.waist} />
            <DetailField label="Hip Width" value={influencer.hipWidth} />
          </div>
        </CardContent>
      </Card>

      {/* Style Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Style Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <DetailField label="Daily Makeup" value={influencer.dailyMakeupLook} />
            <DetailField label="Signature Colors" value={influencer.signatureColors} />
            <DetailField label="Color Palette" value={influencer.colorPalette} />
            <DetailField label="Jewelry Style" value={influencer.jewelryStyle} />
            <DetailField label="Preferred Metals" value={influencer.preferredMetals} />
            <DetailField label="Style Icons" value={influencer.styleIcons} />
          </div>
        </CardContent>
      </Card>

      {/* Expressions & Personality */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expressions & Personality</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <DetailField label="Signature Smile" value={influencer.signatureSmile} />
            <DetailField label="Eye Expression" value={influencer.eyeExpression} />
            <DetailField label="Resting Face" value={influencer.restingFace} />
            <DetailField label="Posture" value={influencer.posture} />
            <DetailField label="Hand Positions" value={influencer.handPositions} />
            <DetailField label="Personality Traits" value={influencer.personalityTraits} />
            <DetailField label="Voice Tone" value={influencer.voiceTone} />
            <DetailField label="Speaking Style" value={influencer.speakingStyle} />
          </div>
        </CardContent>
      </Card>

      {/* Distinctive Features */}
      {(influencer.uniqueCharacteristics || influencer.signatureFeatures || influencer.asymmetries) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distinctive Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 text-sm">
              <DetailField label="Unique Characteristics" value={influencer.uniqueCharacteristics} />
              <DetailField label="Signature Features" value={influencer.signatureFeatures} />
              <DetailField label="Asymmetries" value={influencer.asymmetries} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Specifications */}
      {(influencer.preferredLighting || influencer.bestAngles || influencer.cameraDistance) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Technical Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 text-sm">
              <DetailField label="Preferred Lighting" value={influencer.preferredLighting} />
              <DetailField label="Best Angles" value={influencer.bestAngles} />
              <DetailField label="Camera Distance" value={influencer.cameraDistance} />
              <DetailField label="Preferred Angles" value={influencer.preferredAngles} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consistency Notes */}
      {(influencer.keyFeatures || influencer.acceptableVariations) && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Consistency Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              {influencer.keyFeatures && (
                <div>
                  <span className="font-medium text-muted-foreground">Key Features:</span>
                  <p className="mt-1 text-sm leading-relaxed">{influencer.keyFeatures}</p>
                </div>
              )}
              {influencer.acceptableVariations && (
                <div>
                  <span className="font-medium text-muted-foreground">Acceptable Variations:</span>
                  <p className="mt-1 text-sm leading-relaxed">{influencer.acceptableVariations}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
