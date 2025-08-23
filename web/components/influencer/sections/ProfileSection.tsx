'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { AIInfluencer } from '@/types';

interface ProfileSectionProps {
  influencer: AIInfluencer;
}

export function ProfileSection({ influencer }: ProfileSectionProps) {
  const getProfileImage = () => {
    // First priority: Base image if available
    if (influencer.baseImageUrl) {
      return influencer.baseImageUrl;
    }

    // Second priority: Existing portrait reference image
    const portraitImage = influencer.images?.find((img) => img.imageType === 'PORTRAIT' && img.isReference);
    if (portraitImage?.imageUrl) {
      return portraitImage.imageUrl;
    }

    // Fallback: placeholder image
    return '/api/placeholder/400/400';
  };

  const stats = {
    totalImages: influencer.images?.length || 0,
    totalVideos: influencer.videos?.length || 0,
    referenceImages: influencer.images?.filter((img) => img.isReference).length || 0,
    completedVideos: influencer.videos?.filter((video) => video.status === 'COMPLETED').length || 0,
  };

  return (
    <div className='space-y-6'>
      {/* Profile Image */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='bg-muted relative h-64 w-full overflow-hidden rounded-lg'>
              <Image src={getProfileImage()} alt={influencer.name} fill className='object-cover' priority />
            </div>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-foreground font-medium'>Age</p>
                <p className='text-muted-foreground'>{influencer.age || 'Not specified'}</p>
              </div>
              <div>
                <p className='text-foreground font-medium'>Height</p>
                <p className='text-muted-foreground'>{influencer.height || 'Not specified'}</p>
              </div>
              <div>
                <p className='text-foreground font-medium'>Ethnicity</p>
                <p className='text-muted-foreground'>{influencer.primaryEthnicity || 'Not specified'}</p>
              </div>
              <div>
                <p className='text-foreground font-medium'>Build</p>
                <p className='text-muted-foreground'>{influencer.overallBuild || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Base Image for Face Consistency */}
      {influencer.baseImageUrl && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Base Face Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='bg-muted relative h-48 w-full overflow-hidden rounded-lg'>
              <Image
                src={influencer.baseImageUrl}
                alt={`${influencer.name} base face`}
                fill
                className='object-cover'
              />
            </div>
            <p className='mt-2 text-sm text-muted-foreground'>
              This base face image ensures consistency across all generated images
            </p>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Total Images</span>
              <Badge variant='outline' className='font-mono'>
                {stats.totalImages}
              </Badge>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Reference Images</span>
              <Badge variant='outline' className='font-mono'>
                {stats.referenceImages}
              </Badge>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Total Videos</span>
              <Badge variant='outline' className='font-mono'>
                {stats.totalVideos}
              </Badge>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Completed Videos</span>
              <Badge variant='outline' className='font-mono'>
                {stats.completedVideos}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Character Traits */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Character Traits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {influencer.personalityArchetype && (
              <Badge variant='secondary' className='mr-2 mb-2'>
                {influencer.personalityArchetype}
              </Badge>
            )}
            {influencer.styleAesthetic && (
              <Badge variant='secondary' className='mr-2 mb-2'>
                {influencer.styleAesthetic}
              </Badge>
            )}
            {influencer.eyeColor && (
              <Badge variant='outline' className='mr-2 mb-2'>
                Eyes: {influencer.eyeColor}
              </Badge>
            )}
            {influencer.hairColor && (
              <Badge variant='outline' className='mr-2 mb-2'>
                Hair: {influencer.hairColor}
              </Badge>
            )}
            {!influencer.personalityArchetype &&
              !influencer.styleAesthetic &&
              !influencer.eyeColor &&
              !influencer.hairColor && (
                <p className='text-muted-foreground text-sm'>No character traits specified yet.</p>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
