'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AIInfluencer, VideoIdea } from '@/types';
import { InfluencerService } from '@/services';
import { toast } from 'sonner';
import { Video, Loader2, Play, Wand2, Clock, Sparkles } from 'lucide-react';

interface VideoGenerationDialogProps {
  influencer: AIInfluencer;
  open: boolean;
  onClose: () => void;
  onVideoGenerated: () => void;
}

export function VideoGenerationDialog({ influencer, open, onClose, onVideoGenerated }: VideoGenerationDialogProps) {
  const [step, setStep] = useState<'ideas' | 'custom' | 'details' | 'generating'>('ideas');
  const [videoIdeas, setVideoIdeas] = useState<VideoIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<VideoIdea | null>(null);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scenario, setScenario] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  // Generation progress
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const loadVideoIdeas = useCallback(async () => {
    try {
      setIsLoadingIdeas(true);
      const response = await InfluencerService.generateVideoIdeas(influencer.id);

      if (response.data) {
        setVideoIdeas(response.data);
      } else {
        toast.error(response.error?.message || 'Failed to generate video ideas');
      }
    } catch (error) {
      console.error('Error loading video ideas:', error);
      toast.error('Failed to generate video ideas');
    } finally {
      setIsLoadingIdeas(false);
    }
  }, [influencer.id]);

  useEffect(() => {
    if (open && videoIdeas.length === 0) {
      loadVideoIdeas();
    }
  }, [open, videoIdeas.length, loadVideoIdeas]);

  const handleIdeaSelect = (idea: VideoIdea) => {
    setSelectedIdea(idea);
    setTitle(idea.title);
    setDescription(idea.description);
    setScenario(idea.scenario);
    setStep('details');
  };

  const handleCustomVideo = () => {
    setSelectedIdea(null);
    setTitle('');
    setDescription('');
    setScenario('');
    setCustomPrompt('');
    setStep('custom');
  };

  const handleCustomSubmit = () => {
    if (!title.trim() || !scenario.trim()) {
      toast.error('Please fill in the title and scenario');
      return;
    }
    setStep('details');
  };

  const handleGenerateVideo = async () => {
    if (!title.trim() || !scenario.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsGenerating(true);
      setStep('generating');
      setProgress(0);
      setCurrentStep('Starting video generation...');

      const response = await InfluencerService.generateVideo({
        influencerId: influencer.id,
        title,
        description,
        scenario,
        customPrompt,
      });

      if (response.data) {
        // Start polling for progress
        await pollVideoProgress(response.data.id);
      } else {
        toast.error(response.error?.message || 'Failed to start video generation');
        setStep('details');
      }
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error('Failed to generate video');
      setStep('details');
    } finally {
      setIsGenerating(false);
    }
  };

  const pollVideoProgress = async (videoId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max

    const poll = async () => {
      try {
        attempts++;
        setProgress((attempts / maxAttempts) * 100);

        if (attempts <= 5) {
          setCurrentStep('Analyzing character features...');
        } else if (attempts <= 10) {
          setCurrentStep('Generating scene composition...');
        } else if (attempts <= 20) {
          setCurrentStep('Creating video with Veo3...');
        } else {
          setCurrentStep('Finalizing video output...');
        }

        const response = await InfluencerService.getLegacyVideoStatus(influencer.id, videoId);

        if (response.data) {
          if (response.data.status === 'COMPLETED') {
            setProgress(100);
            setCurrentStep('Video generation completed!');
            toast.success('Video generated successfully!');
            onVideoGenerated();
            handleClose();
            return;
          } else if (response.data.status === 'FAILED') {
            toast.error('Video generation failed');
            setStep('details');
            return;
          }
        }

        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          toast.error('Video generation timed out');
          setStep('details');
        }
      } catch (error) {
        console.error('Error polling video status:', error);
        toast.error('Error checking video status');
        setStep('details');
      }
    };

    poll();
  };

  const handleClose = () => {
    if (!isGenerating) {
      setStep('ideas');
      setSelectedIdea(null);
      setTitle('');
      setDescription('');
      setScenario('');
      setCustomPrompt('');
      setProgress(0);
      setCurrentStep('');
      onClose();
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      lifestyle: Video,
      fashion: Sparkles,
      fitness: Play,
      beauty: Wand2,
      dance: Play,
      travel: Video,
      cooking: Video,
    };
    return icons[category] || Video;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Generate Video for {influencer.name}</DialogTitle>
          <DialogDescription>Create engaging video content using AI-powered video generation</DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {step === 'ideas' && (
            <>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-medium'>Video Ideas</h3>
                  <p className='text-muted-foreground text-sm'>
                    Choose from AI-generated video concepts or create your own
                  </p>
                </div>
                <Button variant='outline' onClick={handleCustomVideo}>
                  <Wand2 className='mr-2 h-4 w-4' />
                  Create Custom Video
                </Button>
              </div>

              {isLoadingIdeas ? (
                <div className='flex items-center justify-center py-12'>
                  <Loader2 className='mr-2 h-8 w-8 animate-spin' />
                  <span>Generating creative video ideas...</span>
                </div>
              ) : (
                <div className='grid max-h-96 gap-4 overflow-y-auto md:grid-cols-2 lg:grid-cols-3'>
                  {videoIdeas.map((idea) => {
                    const IconComponent = getCategoryIcon(idea.category);
                    return (
                      <Card
                        key={idea.id}
                        className='cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md'
                        onClick={() => handleIdeaSelect(idea)}
                      >
                        <CardHeader className='pb-3'>
                          <div className='flex items-start justify-between'>
                            <div className='flex items-center space-x-2'>
                              <IconComponent className='text-primary h-5 w-5' />
                              <Badge variant='outline' className='text-xs'>
                                {idea.category}
                              </Badge>
                            </div>
                            <div className='text-muted-foreground flex items-center space-x-1 text-xs'>
                              <Clock className='h-3 w-3' />
                              <span>{idea.duration}</span>
                            </div>
                          </div>
                          <CardTitle className='text-base leading-tight'>{idea.title}</CardTitle>
                        </CardHeader>
                        <CardContent className='pt-0'>
                          <CardDescription className='line-clamp-3 text-sm'>{idea.description}</CardDescription>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {step === 'custom' && (
            <>
              <div className='flex items-center space-x-2'>
                <Button variant='outline' size='sm' onClick={() => setStep('ideas')}>
                  ← Back to Ideas
                </Button>
                <div>
                  <h3 className='font-medium'>Create Custom Video</h3>
                  <p className='text-muted-foreground text-sm'>Design your own unique video concept</p>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='custom-title'>Video Title *</Label>
                  <Input
                    id='custom-title'
                    placeholder='Enter video title...'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='custom-description'>Description</Label>
                  <Textarea
                    id='custom-description'
                    placeholder='Describe what happens in the video...'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='min-h-[80px]'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='custom-scenario'>Scenario/Setting *</Label>
                  <Textarea
                    id='custom-scenario'
                    placeholder='Describe the setting, actions, and environment...'
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    className='min-h-[100px]'
                  />
                  <p className='text-muted-foreground text-xs'>
                    Be specific about the location, lighting, actions, and mood
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='custom-prompt'>Custom Prompt (Optional)</Label>
                  <Textarea
                    id='custom-prompt'
                    placeholder='Advanced: Add specific technical requirements...'
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className='min-h-[80px]'
                  />
                </div>
              </div>

              <div className='flex justify-end space-x-2'>
                <Button variant='outline' onClick={() => setStep('ideas')}>
                  Cancel
                </Button>
                <Button onClick={handleCustomSubmit}>Continue</Button>
              </div>
            </>
          )}

          {step === 'details' && (
            <>
              <div className='flex items-center space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => (selectedIdea ? setStep('ideas') : setStep('custom'))}
                >
                  ← Back
                </Button>
                <div>
                  <h3 className='font-medium'>Video Details</h3>
                  <p className='text-muted-foreground text-sm'>Review and customize your video before generation</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center space-x-2'>
                    <Video className='h-5 w-5' />
                    <span>Video Preview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='final-title'>Title</Label>
                    <Input id='final-title' value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='final-description'>Description</Label>
                    <Textarea
                      id='final-description'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className='min-h-[80px]'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='final-scenario'>Scenario</Label>
                    <Textarea
                      id='final-scenario'
                      value={scenario}
                      onChange={(e) => setScenario(e.target.value)}
                      className='min-h-[100px]'
                    />
                  </div>

                  {selectedIdea && (
                    <div className='bg-muted flex items-center space-x-4 rounded-lg p-3'>
                      <Badge variant='outline'>{selectedIdea.category}</Badge>
                      <div className='text-muted-foreground flex items-center space-x-1 text-sm'>
                        <Clock className='h-4 w-4' />
                        <span>~{selectedIdea.duration}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className='flex justify-end space-x-2'>
                <Button variant='outline' onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateVideo}>
                  <Video className='mr-2 h-4 w-4' />
                  Generate Video
                </Button>
              </div>
            </>
          )}

          {step === 'generating' && (
            <div className='space-y-6 py-8 text-center'>
              <div className='flex justify-center'>
                <div className='relative'>
                  <div className='border-primary/20 h-24 w-24 rounded-full border-4'>
                    <div className='border-t-primary absolute inset-0 animate-spin rounded-full border-4 border-transparent'></div>
                  </div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <Video className='text-primary h-10 w-10' />
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <h3 className='text-xl font-semibold'>Generating Your Video</h3>
                  <p className='text-muted-foreground'>
                    Creating &quot;{title}&quot; with {influencer.name}
                  </p>
                </div>

                <div className='mx-auto max-w-md space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>{currentStep}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className='h-2' />
                </div>

                <div className='text-muted-foreground space-y-1 text-sm'>
                  <p>This process typically takes 2-5 minutes</p>
                  <p>Please keep this dialog open during generation</p>
                </div>

                <div className='text-muted-foreground flex items-center justify-center space-x-2 text-sm'>
                  <div className='bg-primary h-2 w-2 animate-bounce rounded-full'></div>
                  <div
                    className='bg-primary h-2 w-2 animate-bounce rounded-full'
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className='bg-primary h-2 w-2 animate-bounce rounded-full'
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
