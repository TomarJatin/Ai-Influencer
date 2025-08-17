'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Image as ImageIcon, Video, Plus, Download, Play, Settings, Eye } from 'lucide-react';
import Link from 'next/link';
import { AIInfluencer } from '@/types';
import { InfluencerService } from '@/services';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { toast } from 'sonner';
import { ImageGenerationDialog } from './ImageGenerationDialog';
import { VideoGenerationDialog } from './VideoGenerationDialog';
import { EditInfluencerDialog } from './EditInfluencerDialog';

interface InfluencerDetailPageProps {
  influencerId: string;
}

export default function InfluencerDetailPage({ influencerId }: InfluencerDetailPageProps) {
  const [influencer, setInfluencer] = useState<AIInfluencer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const loadInfluencer = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await InfluencerService.getInfluencer(influencerId);
      if (response.data) {
        setInfluencer(response.data);
      } else {
        toast.error(response.error?.message || 'Failed to load influencer');
      }
    } catch (error) {
      console.error('Error loading influencer:', error);
      toast.error('Failed to load influencer');
    } finally {
      setIsLoading(false);
    }
  }, [influencerId]);

  useEffect(() => {
    loadInfluencer();
  }, [loadInfluencer]);

  const handleImageGenerated = () => {
    loadInfluencer(); // Refresh data
    setShowImageDialog(false);
  };

  const handleVideoGenerated = () => {
    loadInfluencer(); // Refresh data
    setShowVideoDialog(false);
  };

  const handleInfluencerUpdated = () => {
    loadInfluencer(); // Refresh data
    setShowEditDialog(false);
  };

  if (isLoading) {
    return (
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-10 w-24' />
          <div className='space-y-2'>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='h-4 w-96' />
          </div>
        </div>
        <div className='grid gap-6 md:grid-cols-3'>
          <div className='space-y-4'>
            <Skeleton className='h-64 w-full' />
            <Skeleton className='h-32 w-full' />
          </div>
          <div className='space-y-4 md:col-span-2'>
            <Skeleton className='h-40 w-full' />
            <Skeleton className='h-64 w-full' />
          </div>
        </div>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <div className='space-y-4 text-center'>
          <h2 className='text-2xl font-bold'>Influencer Not Found</h2>
          <p className='text-muted-foreground'>The requested AI influencer could not be found.</p>
          <Link href='/dashboard'>
            <Button>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getProfileImage = () => {
    const portraitImage = influencer.images?.find((img) => img.imageType === 'PORTRAIT' && img.isReference);
    return portraitImage?.imageUrl || '/api/placeholder/400/400';
  };

  const stats = {
    totalImages: influencer.images?.length || 0,
    totalVideos: influencer.videos?.length || 0,
    referenceImages: influencer.images?.filter((img) => img.isReference).length || 0,
    completedVideos: influencer.videos?.filter((video) => video.status === 'COMPLETED').length || 0,
  };

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Link href='/dashboard'>
            <Button variant='outline' size='sm'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back
            </Button>
          </Link>
          <div>
            <div className='flex items-center space-x-2'>
              <h2 className='text-3xl font-bold tracking-tight'>{influencer.name}</h2>
              {influencer.isDefault && <Badge variant='secondary'>Default Template</Badge>}
            </div>
            <p className='text-muted-foreground'>{influencer.description || 'No description provided'}</p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <Button variant='outline' onClick={() => setShowEditDialog(true)}>
            <Edit className='mr-2 h-4 w-4' />
            Edit
          </Button>
          <Button onClick={() => setShowImageDialog(true)}>
            <ImageIcon className='mr-2 h-4 w-4' />
            Generate Image
          </Button>
          <Button onClick={() => setShowVideoDialog(true)}>
            <Video className='mr-2 h-4 w-4' />
            Generate Video
          </Button>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        {/* Left Column - Profile & Stats */}
        <div className='space-y-6'>
          {/* Profile Image */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='bg-muted relative h-64 w-full overflow-hidden rounded-lg'>
                  <Image src={getProfileImage()} alt={influencer.name} fill className='object-cover' />
                </div>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <p className='font-medium'>Age</p>
                    <p className='text-muted-foreground'>{influencer.age || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className='font-medium'>Height</p>
                    <p className='text-muted-foreground'>{influencer.height || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className='font-medium'>Ethnicity</p>
                    <p className='text-muted-foreground'>{influencer.primaryEthnicity || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className='font-medium'>Build</p>
                    <p className='text-muted-foreground'>{influencer.overallBuild || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Total Images</span>
                  <Badge variant='outline'>{stats.totalImages}</Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Reference Images</span>
                  <Badge variant='outline'>{stats.referenceImages}</Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Total Videos</span>
                  <Badge variant='outline'>{stats.totalVideos}</Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Completed Videos</span>
                  <Badge variant='outline'>{stats.completedVideos}</Badge>
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
                  <Badge variant='secondary'>{influencer.personalityArchetype}</Badge>
                )}
                {influencer.styleAesthetic && <Badge variant='secondary'>{influencer.styleAesthetic}</Badge>}
                {influencer.eyeColor && <Badge variant='outline'>Eyes: {influencer.eyeColor}</Badge>}
                {influencer.hairColor && <Badge variant='outline'>Hair: {influencer.hairColor}</Badge>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Content */}
        <div className='md:col-span-2'>
          <Tabs defaultValue='images' className='space-y-4'>
            <TabsList>
              <TabsTrigger value='images' className='flex items-center space-x-2'>
                <ImageIcon className='h-4 w-4' />
                <span>Images ({stats.totalImages})</span>
              </TabsTrigger>
              <TabsTrigger value='videos' className='flex items-center space-x-2'>
                <Video className='h-4 w-4' />
                <span>Videos ({stats.totalVideos})</span>
              </TabsTrigger>
              <TabsTrigger value='details' className='flex items-center space-x-2'>
                <Settings className='h-4 w-4' />
                <span>Details</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value='images' className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium'>Generated Images</h3>
                <Button onClick={() => setShowImageDialog(true)}>
                  <Plus className='mr-2 h-4 w-4' />
                  Generate New Image
                </Button>
              </div>

              {influencer.images && influencer.images.length > 0 ? (
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {influencer.images.map((image) => (
                    <Card key={image.id} className='overflow-hidden'>
                      <div className='bg-muted relative h-48'>
                        <Image src={image.imageUrl} alt='Generated image' fill className='object-cover' />
                        {image.isReference && (
                          <Badge className='absolute top-2 left-2' variant='default'>
                            Reference
                          </Badge>
                        )}
                        <Badge className='absolute top-2 right-2' variant='outline'>
                          {image.imageType}
                        </Badge>
                      </div>
                      <CardContent className='p-3'>
                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground text-sm'>
                            {new Date(image.createdAt).toLocaleDateString()}
                          </span>
                          <div className='flex space-x-1'>
                            <Button size='sm' variant='ghost'>
                              <Eye className='h-3 w-3' />
                            </Button>
                            <Button size='sm' variant='ghost'>
                              <Download className='h-3 w-3' />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className='flex flex-col items-center justify-center space-y-4 py-8'>
                    <ImageIcon className='text-muted-foreground h-12 w-12' />
                    <div className='space-y-2 text-center'>
                      <h4 className='font-medium'>No Images Generated</h4>
                      <p className='text-muted-foreground text-sm'>
                        Start by generating reference images for your AI influencer
                      </p>
                    </div>
                    <Button onClick={() => setShowImageDialog(true)}>
                      <Plus className='mr-2 h-4 w-4' />
                      Generate First Image
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value='videos' className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium'>Generated Videos</h3>
                <Button onClick={() => setShowVideoDialog(true)}>
                  <Plus className='mr-2 h-4 w-4' />
                  Generate New Video
                </Button>
              </div>

              {influencer.videos && influencer.videos.length > 0 ? (
                <div className='space-y-4'>
                  {influencer.videos.map((video) => (
                    <Card key={video.id}>
                      <CardContent className='p-4'>
                        <div className='flex items-center space-x-4'>
                          <div className='bg-muted relative h-20 w-32 overflow-hidden rounded-lg'>
                            {video.thumbnailUrl ? (
                              <Image src={video.thumbnailUrl} alt={video.title} fill className='object-cover' />
                            ) : (
                              <div className='flex h-full items-center justify-center'>
                                <Video className='text-muted-foreground h-8 w-8' />
                              </div>
                            )}
                            <div className='absolute inset-0 flex items-center justify-center'>
                              <Play className='h-6 w-6 text-white drop-shadow-lg' />
                            </div>
                          </div>
                          <div className='min-w-0 flex-1'>
                            <h4 className='truncate font-medium'>{video.title}</h4>
                            <p className='text-muted-foreground truncate text-sm'>{video.description}</p>
                            <div className='mt-2 flex items-center space-x-2'>
                              <Badge
                                variant={
                                  video.status === 'COMPLETED'
                                    ? 'default'
                                    : video.status === 'GENERATING'
                                      ? 'secondary'
                                      : video.status === 'FAILED'
                                        ? 'destructive'
                                        : 'outline'
                                }
                              >
                                {video.status}
                              </Badge>
                              {video.duration && (
                                <span className='text-muted-foreground text-xs'>{video.duration}s</span>
                              )}
                            </div>
                          </div>
                          <div className='flex items-center space-x-2'>
                            {video.status === 'COMPLETED' && video.videoUrl && (
                              <Button size='sm' variant='outline'>
                                <Play className='mr-2 h-3 w-3' />
                                Play
                              </Button>
                            )}
                            <Button size='sm' variant='ghost'>
                              <Download className='h-3 w-3' />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className='flex flex-col items-center justify-center space-y-4 py-8'>
                    <Video className='text-muted-foreground h-12 w-12' />
                    <div className='space-y-2 text-center'>
                      <h4 className='font-medium'>No Videos Generated</h4>
                      <p className='text-muted-foreground text-sm'>
                        Create engaging video content with your AI influencer
                      </p>
                    </div>
                    <Button onClick={() => setShowVideoDialog(true)}>
                      <Plus className='mr-2 h-4 w-4' />
                      Generate First Video
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value='details' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Influencer Details</CardTitle>
                  <CardDescription>Complete character specifications and settings</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Character Identity */}
                  {(influencer.personalityArchetype || influencer.styleAesthetic) && (
                    <div>
                      <h4 className='mb-2 font-medium'>Character Identity</h4>
                      <div className='grid grid-cols-2 gap-4 text-sm'>
                        {influencer.personalityArchetype && (
                          <div>
                            <span className='text-muted-foreground'>Personality:</span>
                            <p>{influencer.personalityArchetype}</p>
                          </div>
                        )}
                        {influencer.styleAesthetic && (
                          <div>
                            <span className='text-muted-foreground'>Style:</span>
                            <p>{influencer.styleAesthetic}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Physical Features */}
                  <div>
                    <h4 className='mb-2 font-medium'>Physical Features</h4>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      {influencer.faceShape && (
                        <div>
                          <span className='text-muted-foreground'>Face Shape:</span>
                          <p>{influencer.faceShape}</p>
                        </div>
                      )}
                      {influencer.eyeColor && (
                        <div>
                          <span className='text-muted-foreground'>Eye Color:</span>
                          <p>{influencer.eyeColor}</p>
                        </div>
                      )}
                      {influencer.hairColor && (
                        <div>
                          <span className='text-muted-foreground'>Hair Color:</span>
                          <p>{influencer.hairColor}</p>
                        </div>
                      )}
                      {influencer.skinTone && (
                        <div>
                          <span className='text-muted-foreground'>Skin Tone:</span>
                          <p>{influencer.skinTone}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Key Features */}
                  {influencer.keyFeatures && (
                    <div>
                      <h4 className='mb-2 font-medium'>Key Features</h4>
                      <p className='text-muted-foreground text-sm'>{influencer.keyFeatures}</p>
                    </div>
                  )}

                  {/* Technical Settings */}
                  {influencer.preferredLighting && (
                    <div>
                      <h4 className='mb-2 font-medium'>Technical Settings</h4>
                      <div className='text-sm'>
                        <span className='text-muted-foreground'>Preferred Lighting:</span>
                        <p>{influencer.preferredLighting}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      {showImageDialog && (
        <ImageGenerationDialog
          influencer={influencer}
          open={showImageDialog}
          onClose={() => setShowImageDialog(false)}
          onImageGenerated={handleImageGenerated}
        />
      )}

      {showVideoDialog && (
        <VideoGenerationDialog
          influencer={influencer}
          open={showVideoDialog}
          onClose={() => setShowVideoDialog(false)}
          onVideoGenerated={handleVideoGenerated}
        />
      )}

      {showEditDialog && (
        <EditInfluencerDialog
          influencer={influencer}
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          onInfluencerUpdated={handleInfluencerUpdated}
        />
      )}
    </div>
  );
}
