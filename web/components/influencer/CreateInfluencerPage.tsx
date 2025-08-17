'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, User, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { DEFAULT_INFLUENCERS } from '@/constants/defaultInfluencers';
import { CreateAIInfluencerDto } from '@/types';
import { InfluencerService } from '@/services';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { CustomInfluencerForm } from './CustomInfluencerForm';

export default function CreateInfluencerPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedDefault, setSelectedDefault] = useState<CreateAIInfluencerDto | null>(null);
  const router = useRouter();

  const handleCreateFromDefault = async (defaultInfluencer: CreateAIInfluencerDto) => {
    try {
      setIsCreating(true);
      const response = await InfluencerService.createFromDefault(defaultInfluencer);

      if (response.data) {
        toast.success(`${defaultInfluencer.name} created successfully!`);
        router.push(`/dashboard/influencer/${response.data.id}`);
      } else {
        toast.error(response.error?.message || 'Failed to create influencer');
      }
    } catch (error) {
      console.error('Error creating influencer:', error);
      toast.error('Failed to create influencer');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCustomCreate = async (data: CreateAIInfluencerDto) => {
    try {
      setIsCreating(true);
      const response = await InfluencerService.createInfluencer(data);

      if (response.data) {
        toast.success(`${data.name} created successfully!`);
        router.push(`/dashboard/influencer/${response.data.id}`);
      } else {
        toast.error(response.error?.message || 'Failed to create influencer');
      }
    } catch (error) {
      console.error('Error creating influencer:', error);
      toast.error('Failed to create influencer');
    } finally {
      setIsCreating(false);
    }
  };

  const getDefaultImage = (influencer: CreateAIInfluencerDto) => {
    // Generate a placeholder image URL based on the influencer characteristics
    return `/api/placeholder/400/400?text=${encodeURIComponent(influencer.name)}`;
  };

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center space-x-4'>
        <Link href='/dashboard'>
          <Button variant='outline' size='sm'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Create AI Influencer</h2>
          <p className='text-muted-foreground'>
            Choose from our curated templates or create your own unique influencer
          </p>
        </div>
      </div>

      <Tabs defaultValue='templates' className='space-y-6'>
        <TabsList>
          <TabsTrigger value='templates' className='flex items-center space-x-2'>
            <Sparkles className='h-4 w-4' />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value='custom' className='flex items-center space-x-2'>
            <User className='h-4 w-4' />
            <span>Custom</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='templates' className='space-y-6'>
          <div className='space-y-2 text-center'>
            <h3 className='text-xl font-semibold'>Choose from Our Premium Templates</h3>
            <p className='text-muted-foreground'>Professionally designed AI influencers ready to create content</p>
          </div>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {DEFAULT_INFLUENCERS.map((influencer, index) => (
              <Card
                key={index}
                className='group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg'
                onClick={() => setSelectedDefault(influencer)}
              >
                <div className='relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900'>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='relative h-32 w-32 overflow-hidden rounded-full bg-white/20 backdrop-blur-sm'>
                      <Image src={getDefaultImage(influencer)} alt={influencer.name} fill className='object-cover' />
                    </div>
                  </div>
                  <div className='absolute top-4 left-4'>
                    <Badge variant='secondary' className='bg-white/90 text-gray-900'>
                      Template
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    {influencer.name}
                    <Wand2 className='text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors' />
                  </CardTitle>
                  <CardDescription className='line-clamp-2'>{influencer.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='flex flex-wrap gap-2'>
                      {influencer.personalityArchetype && (
                        <Badge variant='outline' className='text-xs'>
                          {String(influencer.personalityArchetype)}
                        </Badge>
                      )}
                      {influencer.styleAesthetic && (
                        <Badge variant='outline' className='text-xs'>
                          {String(influencer.styleAesthetic)}
                        </Badge>
                      )}
                      {influencer.primaryEthnicity && typeof influencer.primaryEthnicity === 'string' ? (
                        <Badge variant='outline' className='text-xs'>
                          {String(influencer.primaryEthnicity)}
                        </Badge>
                      ) : null}
                    </div>
                    <div className='flex items-center justify-between pt-2'>
                      <div className='text-muted-foreground text-sm'>
                        {influencer.age} years • {String(influencer.height)}
                      </div>
                      <Button
                        size='sm'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateFromDefault(influencer);
                        }}
                        disabled={isCreating}
                      >
                        {isCreating ? 'Creating...' : 'Create'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedDefault && (
            <Card className='border-primary'>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Sparkles className='text-primary h-5 w-5' />
                  <span>Selected Template: {selectedDefault.name}</span>
                </CardTitle>
                <CardDescription>Review the details and create your influencer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>Physical Characteristics</h4>
                    <div className='text-muted-foreground space-y-1 text-sm'>
                      <p>
                        <strong>Age:</strong> {selectedDefault.age} years
                      </p>
                      <p>
                        <strong>Height:</strong> {String(selectedDefault.height)}
                      </p>
                      <p>
                        <strong>Build:</strong> {String(selectedDefault.overallBuild)}
                      </p>
                      <p>
                        <strong>Ethnicity:</strong> {String(selectedDefault.primaryEthnicity)}
                      </p>
                      <p>
                        <strong>Eye Color:</strong> {String(selectedDefault.eyeColor)}
                      </p>
                      <p>
                        <strong>Hair:</strong> {String(selectedDefault.hairColor)} {String(selectedDefault.hairTexture)}
                      </p>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>Style & Personality</h4>
                    <div className='text-muted-foreground space-y-1 text-sm'>
                      <p>
                        <strong>Personality:</strong> {String(selectedDefault.personalityArchetype)}
                      </p>
                      <p>
                        <strong>Style:</strong> {String(selectedDefault.styleAesthetic)}
                      </p>
                      <p>
                        <strong>Face Shape:</strong> {String(selectedDefault.faceShape)}
                      </p>
                      <p>
                        <strong>Body Shape:</strong> {String(selectedDefault.bodyShape)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='flex justify-end space-x-2 pt-4'>
                  <Button variant='outline' onClick={() => setSelectedDefault(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleCreateFromDefault(selectedDefault)} disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Influencer'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='custom' className='space-y-6'>
          <div className='space-y-2 text-center'>
            <h3 className='text-xl font-semibold'>Create Your Unique Influencer</h3>
            <p className='text-muted-foreground'>Design every detail of your AI influencer from scratch</p>
          </div>

          <CustomInfluencerForm onSubmit={handleCustomCreate} isSubmitting={isCreating} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
