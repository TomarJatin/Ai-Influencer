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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIInfluencer } from '@/types';
import { InfluencerService, VideoIdea, PaginationQueryDto, GenerateVideoFromIdeaDto } from '@/services';
import { toast } from 'sonner';
import { Video, Loader2, Search, Plus, ArrowLeft, Eye, Sparkles, Clock } from 'lucide-react';

interface NewVideoGenerationDialogProps {
  influencer: AIInfluencer;
  open: boolean;
  onClose: () => void;
  onVideoGenerated: () => void;
  onCreateIdea: () => void;
}

type Step = 'select-idea' | 'configure-generation' | 'generating';

export function NewVideoGenerationDialog({
  influencer,
  open,
  onClose,
  onVideoGenerated,
  onCreateIdea,
}: NewVideoGenerationDialogProps) {
  const [step, setStep] = useState<Step>('select-idea');
  const [selectedIdea, setSelectedIdea] = useState<VideoIdea | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Ideas loading state
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Generation configuration
  const [duration, setDuration] = useState<number>(5);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  // Generation progress
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const loadIdeas = useCallback(
    async (query: PaginationQueryDto = {}) => {
      try {
        setIsLoadingIdeas(true);
        const response = await InfluencerService.getVideoIdeas(influencer.id, {
          page: pagination.page,
          limit: pagination.limit,
          search: searchQuery || undefined,
          category: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
          ...query,
        });

        if (response.data) {
          setIdeas(response.data.items);
          setPagination((prev) => ({
            ...prev,
            total: response.data.total,
            totalPages: response.data.totalPages,
            page: response.data.page,
          }));
        } else {
          toast.error(response.error?.message || 'Failed to load ideas');
        }
      } catch (error) {
        console.error('Error loading ideas:', error);
        toast.error('Failed to load ideas');
      } finally {
        setIsLoadingIdeas(false);
      }
    },
    [influencer.id, pagination.page, pagination.limit, searchQuery, categoryFilter]
  );

  useEffect(() => {
    if (open) {
      loadIdeas();
    }
  }, [open, loadIdeas]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadIdeas({ page: 1 });
  };

  const handleIdeaSelect = async (idea: VideoIdea) => {
    setSelectedIdea(idea);
    setStep('configure-generation');

    // Generate optimized prompt in the background
    try {
      setIsGeneratingPrompt(true);
      
      const enhancedPrompt = `Create a high-quality ${duration}-second video of ${influencer.name} based on the concept "${idea.title}".

VIDEO CONCEPT:
${idea.description}

SCENARIO: ${idea.scenario}
DURATION: ${idea.duration}
MOOD: ${idea.mood || 'Professional and engaging'}
VISUAL STYLE: ${idea.visualStyle || 'Cinematic and polished'}
KEY MOMENTS: ${idea.keyMoments?.join(', ') || 'Smooth narrative flow'}

INFLUENCER CHARACTERISTICS:
- Age: ${influencer.age || 'Young adult'}
- Ethnicity: ${influencer.primaryEthnicity || 'Not specified'}
- Hair: ${influencer.hairColor || 'Natural hair color'}
- Eyes: ${influencer.eyeColor || 'Natural eye color'}
- Style: ${influencer.styleAesthetic || 'Contemporary style'}
- Key Features: ${influencer.keyFeatures || 'Distinctive features'}

Create a professional, engaging video with smooth camera movements, natural lighting, and authentic expressions that represents this AI influencer's personality and style.`;

      setGeneratedPrompt(enhancedPrompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error('Failed to generate optimized prompt');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedIdea) return;

    try {
      setIsGenerating(true);
      setStep('generating');
      setProgress(0);
      setCurrentStep('Starting video generation...');

      const generateData: GenerateVideoFromIdeaDto = {
        videoIdeaId: selectedIdea.id,
        customPrompt: customPrompt || undefined,
        duration,
      };

      const response = await InfluencerService.generateVideoFromIdea(influencer.id, generateData);

      if (response.data) {
        // Start polling for progress
        await pollVideoProgress(response.data.id);
      } else {
        toast.error(response.error?.message || 'Failed to start video generation');
        setStep('configure-generation');
      }
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error('Failed to generate video');
      setStep('configure-generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const pollVideoProgress = async (videoId: string) => {
    let attempts = 0;
    const maxAttempts = 60; // 10 minutes max (10s intervals)

    const poll = async () => {
      try {
        attempts++;
        const progressPercent = Math.min((attempts / maxAttempts) * 100, 95);
        setProgress(progressPercent);

        if (attempts <= 5) {
          setCurrentStep('Analyzing character features...');
        } else if (attempts <= 15) {
          setCurrentStep('Generating scene composition...');
        } else if (attempts <= 45) {
          setCurrentStep('Creating video with Veo3...');
        } else {
          setCurrentStep('Finalizing video output...');
        }

        const response = await InfluencerService.checkVideoStatus(influencer.id, videoId);

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
            setStep('configure-generation');
            return;
          }
        }

        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          toast.error('Video generation timed out');
          setStep('configure-generation');
        }
      } catch (error) {
        console.error('Error polling video status:', error);
        toast.error('Error checking video status');
        setStep('configure-generation');
      }
    };

    poll();
  };

  const handleClose = () => {
    if (!isGenerating) {
      setStep('select-idea');
      setSelectedIdea(null);
      setCustomPrompt('');
      setGeneratedPrompt('');
      setProgress(0);
      setCurrentStep('');
      onClose();
    }
  };

  const categories = Array.from(new Set(ideas.map((idea) => idea.category))).filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Generate Video for {influencer.name}</DialogTitle>
          <DialogDescription>Select an idea and configure the video generation settings</DialogDescription>
        </DialogHeader>

        {step === 'select-idea' && (
          <div className='space-y-4'>
            {/* Header with Actions */}
            <div className='flex items-center justify-between pb-2'>
              <div className='space-y-1'>
                <h3 className='text-lg font-semibold tracking-tight'>Select a Video Idea</h3>
                <p className='text-muted-foreground text-sm'>
                  Choose from your saved video concepts or create a new one
                </p>
              </div>
              <Button onClick={onCreateIdea} variant='outline' size='sm' className='shrink-0'>
                <Plus className='mr-2 h-4 w-4' />
                New Idea
              </Button>
            </div>

            {/* Enhanced Search and Filters */}
            <Card className='border-border/50 shadow-sm'>
              <CardContent className='p-4'>
                <div className='flex flex-col gap-3 sm:flex-row'>
                  <div className='relative flex-1'>
                    <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                    <Input
                      placeholder='Search by title, scenario, or description...'
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (!e.target.value.trim()) {
                          setPagination((prev) => ({ ...prev, page: 1 }));
                          loadIdeas({ page: 1 });
                        }
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className='bg-background border-border/50 focus:border-primary/50 pl-10'
                    />
                  </div>
                  <Select
                    value={categoryFilter}
                    onValueChange={(value) => {
                      setCategoryFilter(value);
                      setPagination((prev) => ({ ...prev, page: 1 }));
                      loadIdeas({ page: 1, category: value !== 'all' ? value : undefined });
                    }}
                  >
                    <SelectTrigger className='bg-background border-border/50 w-full sm:w-[160px]'>
                      <SelectValue placeholder='Category' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {searchQuery.trim() && (
                    <Button onClick={handleSearch} size='sm' disabled={isLoadingIdeas} className='shrink-0'>
                      <Search className='mr-2 h-4 w-4' />
                      Search
                    </Button>
                  )}
                </div>

                {/* Active filters display */}
                {(searchQuery.trim() || (categoryFilter && categoryFilter !== 'all')) && (
                  <div className='border-border/30 mt-3 flex items-center gap-2 border-t pt-3'>
                    <span className='text-muted-foreground text-xs'>Active filters:</span>
                    {searchQuery.trim() && (
                      <Badge variant='secondary' className='text-xs'>
                        Search: {searchQuery}
                      </Badge>
                    )}
                    {categoryFilter && categoryFilter !== 'all' && (
                      <Badge variant='secondary' className='text-xs'>
                        Category: {categoryFilter}
                      </Badge>
                    )}
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-6 px-2 text-xs'
                      onClick={() => {
                        setSearchQuery('');
                        setCategoryFilter('all');
                        setPagination((prev) => ({ ...prev, page: 1 }));
                        loadIdeas({ page: 1 });
                      }}
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video Ideas List */}
            <Card className='border-border/50 shadow-sm'>
              {isLoadingIdeas ? (
                <CardContent className='p-8'>
                  <div className='flex items-center justify-center space-y-3'>
                    <div className='space-y-3 text-center'>
                      <div className='relative'>
                        <div className='border-primary/20 border-t-primary mx-auto h-12 w-12 animate-spin rounded-full border-4'></div>
                        <Video className='text-primary absolute inset-0 m-auto h-6 w-6' />
                      </div>
                      <p className='text-muted-foreground text-sm'>Loading your video ideas...</p>
                    </div>
                  </div>
                </CardContent>
              ) : ideas.length > 0 ? (
                <div>
                  {/* Results Header */}
                  <div className='bg-muted/20 border-border/50 border-b px-4 py-3'>
                    <div className='flex items-center justify-between'>
                      <p className='text-foreground text-sm font-medium'>
                        {pagination.total} video idea{pagination.total !== 1 ? 's' : ''} available
                      </p>
                      <div className='flex items-center space-x-2'>
                        <Badge variant='outline' className='text-xs'>
                          Page {pagination.page} of {pagination.totalPages}
                        </Badge>
                        <Select
                          value={pagination.limit.toString()}
                          onValueChange={(value) => {
                            const limit = parseInt(value);
                            setPagination((prev) => ({ ...prev, limit, page: 1 }));
                            loadIdeas({ page: 1, limit });
                          }}
                        >
                          <SelectTrigger className='h-7 w-16 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='6'>6</SelectItem>
                            <SelectItem value='12'>12</SelectItem>
                            <SelectItem value='24'>24</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Video Ideas List */}
                  <div className='max-h-[450px] overflow-y-auto'>
                    {ideas.map((idea, index) => (
                      <div
                        key={idea.id}
                        className='hover:bg-muted/30 border-border/30 group cursor-pointer border-b p-4 transition-all duration-200 last:border-b-0'
                        onClick={() => handleIdeaSelect(idea)}
                      >
                        <div className='flex items-start space-x-4'>
                          {/* Video Number & Icon */}
                          <div className='relative flex-shrink-0'>
                            <div className='border-border/50 flex h-10 w-10 items-center justify-center rounded-lg border bg-gradient-to-br from-purple-500/10 to-pink-600/10 transition-colors group-hover:from-purple-500/20 group-hover:to-pink-600/20'>
                              <span className='text-muted-foreground text-xs font-medium'>
                                {(pagination.page - 1) * pagination.limit + index + 1}
                              </span>
                            </div>
                            {idea.isUsed && (
                              <div className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500'>
                                <Eye className='h-2.5 w-2.5 text-white' />
                              </div>
                            )}
                          </div>

                          {/* Video Content */}
                          <div className='min-w-0 flex-1 space-y-2'>
                            <div className='flex items-start justify-between'>
                              <div className='flex-1 space-y-1'>
                                <h4 className='text-foreground group-hover:text-primary line-clamp-1 font-medium transition-colors'>
                                  {idea.title}
                                </h4>
                                <p className='text-muted-foreground line-clamp-2 text-sm leading-relaxed'>
                                  {idea.description}
                                </p>
                              </div>

                              <Button
                                size='sm'
                                variant='ghost'
                                className='ml-2 shrink-0 opacity-0 transition-opacity group-hover:opacity-100'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleIdeaSelect(idea);
                                }}
                              >
                                <Video className='h-4 w-4' />
                              </Button>
                            </div>

                            {/* Metadata */}
                            <div className='flex items-center justify-between'>
                              <div className='text-muted-foreground flex items-center space-x-3 text-xs'>
                                <span className='flex items-center rounded-md bg-purple-50 px-2 py-1 dark:bg-purple-950/30'>
                                  <Clock className='mr-1.5 h-3 w-3' />
                                  {idea.duration}
                                </span>
                                {idea.mood && (
                                  <span className='flex items-center rounded-md bg-pink-50 px-2 py-1 dark:bg-pink-950/30'>
                                    <span className='mr-1.5 h-1.5 w-1.5 rounded-full bg-pink-500'></span>
                                    {idea.mood}
                                  </span>
                                )}
                              </div>

                              <span className='text-muted-foreground text-xs'>
                                {new Date(idea.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Footer */}
                  {pagination.totalPages > 1 && (
                    <div className='bg-muted/10 border-border/50 border-t p-4'>
                      <div className='flex items-center justify-center'>
                        <div className='flex items-center space-x-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const newPage = Math.max(1, pagination.page - 1);
                              setPagination((prev) => ({ ...prev, page: newPage }));
                              loadIdeas({ page: newPage });
                            }}
                            disabled={pagination.page === 1}
                          >
                            <ArrowLeft className='h-4 w-4' />
                          </Button>

                          <span className='text-muted-foreground px-3 text-sm'>
                            {pagination.page} of {pagination.totalPages}
                          </span>

                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const newPage = Math.min(pagination.totalPages, pagination.page + 1);
                              setPagination((prev) => ({ ...prev, page: newPage }));
                              loadIdeas({ page: newPage });
                            }}
                            disabled={pagination.page === pagination.totalPages}
                          >
                            <Plus className='h-4 w-4 rotate-90' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <CardContent className='p-8'>
                  <div className='flex flex-col items-center justify-center space-y-6'>
                    <div className='border-border/50 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed bg-gradient-to-br from-purple-500/10 to-pink-600/10'>
                      <Video className='text-muted-foreground h-10 w-10' />
                    </div>
                    <div className='max-w-md space-y-2 text-center'>
                      <h4 className='text-foreground font-semibold'>No Video Ideas Found</h4>
                      <p className='text-muted-foreground text-sm leading-relaxed'>
                        {searchQuery || (categoryFilter && categoryFilter !== 'all')
                          ? 'No video ideas match your search criteria. Try adjusting your filters or create a new idea.'
                          : 'Get started by creating your first video idea with detailed scenarios and key moments.'}
                      </p>
                    </div>
                    <div className='flex flex-col gap-3 sm:flex-row'>
                      <Button onClick={onCreateIdea} className='min-w-[140px]'>
                        <Plus className='mr-2 h-4 w-4' />
                        Create New Idea
                      </Button>
                      {(searchQuery || (categoryFilter && categoryFilter !== 'all')) && (
                        <Button
                          onClick={() => {
                            setSearchQuery('');
                            setCategoryFilter('all');
                            setPagination((prev) => ({ ...prev, page: 1 }));
                            loadIdeas({ page: 1 });
                          }}
                          variant='outline'
                          className='min-w-[120px]'
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        )}

        {step === 'configure-generation' && selectedIdea && (
          <div className='space-y-6'>
            {/* Back Button */}
            <Button variant='outline' onClick={() => setStep('select-idea')} className='mb-4'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Ideas
            </Button>

            {/* Selected Idea Preview */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Eye className='h-5 w-5' />
                  <span>Selected Video Idea</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-center space-x-2'>
                    <Badge>{selectedIdea.category}</Badge>
                    <div className='flex items-center text-sm text-gray-500'>
                      <Clock className='mr-1 h-4 w-4' />
                      <span>{selectedIdea.duration}</span>
                    </div>
                    {selectedIdea.isUsed && (
                      <Badge variant='outline' className='text-green-600'>
                        Used
                      </Badge>
                    )}
                  </div>
                  <h3 className='font-semibold'>{selectedIdea.title}</h3>
                  <p className='text-sm text-gray-600'>{selectedIdea.description}</p>
                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <strong>Scenario:</strong> {selectedIdea.scenario}
                    </p>
                    {selectedIdea.keyMoments && selectedIdea.keyMoments.length > 0 && (
                      <div>
                        <p className='text-sm font-medium'>Key Moments:</p>
                        <div className='mt-1 flex flex-wrap gap-1'>
                          {selectedIdea.keyMoments.map((moment, index) => (
                            <Badge key={index} variant='outline' className='text-xs'>
                              {moment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generation Configuration */}
            <div className='grid gap-6 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Video Settings</CardTitle>
                  <CardDescription>Configure the video generation parameters</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Duration (seconds)</Label>
                    <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='3'>3 seconds</SelectItem>
                        <SelectItem value='5'>5 seconds</SelectItem>
                        <SelectItem value='10'>10 seconds</SelectItem>
                        <SelectItem value='15'>15 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center space-x-2'>
                    <Sparkles className='h-5 w-5' />
                    <span>AI-Generated Prompt</span>
                  </CardTitle>
                  <CardDescription>Optimized prompt based on your video idea and influencer details</CardDescription>
                </CardHeader>
                <CardContent>
                  {isGeneratingPrompt ? (
                    <div className='flex items-center justify-center py-8'>
                      <Loader2 className='mr-2 h-6 w-6 animate-spin' />
                      <span>Generating optimized prompt...</span>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      <div className='bg-muted max-h-32 overflow-y-auto rounded-lg p-4'>
                        <p className='text-sm whitespace-pre-wrap'>{generatedPrompt}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Custom Prompt Override */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Prompt (Optional)</CardTitle>
                <CardDescription>Override the AI-generated prompt with your own custom prompt</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder='Enter your custom video prompt here...'
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className='min-h-[100px]'
                />
                <p className='mt-2 text-xs text-gray-500'>Leave empty to use the AI-generated prompt above</p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className='flex justify-end space-x-2'>
              <Button variant='outline' onClick={() => setStep('select-idea')}>
                Change Idea
              </Button>
              <Button onClick={handleGenerate} disabled={isGeneratingPrompt}>
                <Video className='mr-2 h-4 w-4' />
                Generate Video
              </Button>
            </div>
          </div>
        )}

        {step === 'generating' && selectedIdea && (
          <div className='space-y-8 py-12 text-center'>
            {/* Generation Animation */}
            <div className='flex justify-center'>
              <div className='relative'>
                <div className='border-primary/20 flex h-32 w-32 items-center justify-center rounded-full border-4 bg-gradient-to-br from-purple-500/10 to-pink-600/10'>
                  <div className='border-t-primary h-24 w-24 animate-spin rounded-full border-4 border-transparent'></div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg'>
                      <Video className='h-8 w-8 animate-pulse text-white' />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generation Details */}
            <div className='mx-auto max-w-lg space-y-6'>
              <div className='space-y-3'>
                <h3 className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent'>
                  Generating Your Video
                </h3>
                <div className='space-y-2'>
                  <p className='text-foreground text-lg font-medium'>&quot;{selectedIdea.title}&quot;</p>
                  <p className='text-muted-foreground'>for {influencer.name}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <Card className='border-border/50 bg-muted/20 shadow-sm'>
                <CardContent className='p-6'>
                  <div className='space-y-4'>
                    <div className='text-muted-foreground flex items-center justify-center space-x-2 text-sm'>
                      <Sparkles className='h-4 w-4 text-purple-500' />
                      <span>Powered by Google&apos;s Veo3 AI</span>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>{currentStep}</span>
                        <span className='text-foreground font-medium'>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className='bg-muted border-border/30 h-3 border' />
                    </div>

                    <div className='grid grid-cols-2 gap-4 text-xs'>
                      <div className='bg-background border-border/30 rounded-lg border p-3 text-center'>
                        <div className='text-foreground font-medium'>Duration</div>
                        <div className='text-muted-foreground mt-1'>{duration} seconds</div>
                      </div>
                      <div className='bg-background border-border/30 rounded-lg border p-3 text-center'>
                        <div className='text-foreground font-medium'>Category</div>
                        <div className='text-muted-foreground mt-1'>{selectedIdea.category}</div>
                      </div>
                    </div>

                    <div className='border-border/30 space-y-2 border-t pt-2 text-center'>
                      <p className='text-muted-foreground text-sm'>This process typically takes 3-8 minutes</p>
                      <p className='text-muted-foreground text-xs'>Please keep this dialog open during generation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Animated Dots */}
              <div className='flex items-center justify-center space-x-2'>
                <div className='bg-primary h-3 w-3 animate-bounce rounded-full'></div>
                <div
                  className='bg-primary h-3 w-3 animate-bounce rounded-full'
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className='bg-primary h-3 w-3 animate-bounce rounded-full'
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
