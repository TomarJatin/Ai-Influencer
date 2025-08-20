'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIInfluencer } from '@/types';
import { InfluencerService, ImageIdea, PaginationQueryDto, GenerateImageFromIdeaDto } from '@/services';
import { toast } from 'sonner';
import { Wand2, Loader2, Image as ImageIcon, Search, Plus, ArrowLeft, Eye, Sparkles } from 'lucide-react';

interface NewImageGenerationDialogProps {
  influencer: AIInfluencer;
  open: boolean;
  onClose: () => void;
  onImageGenerated: () => void;
  onCreateIdea: () => void;
}

const IMAGE_TYPES = [
  { value: 'PORTRAIT', label: 'Portrait', description: 'Close-up headshot focusing on facial features' },
  { value: 'FULL_BODY', label: 'Full Body', description: 'Complete body shot showing full appearance' },
  { value: 'BEAUTY_SHOT', label: 'Beauty Shot', description: 'High-quality beauty photography style' },
  { value: 'LIFESTYLE', label: 'Lifestyle', description: 'Natural, candid lifestyle photography' },
  { value: 'REFERENCE', label: 'Reference', description: 'Multiple angles for consistency reference' },
];

type Step = 'select-idea' | 'configure-generation' | 'generating';

export function NewImageGenerationDialog({
  influencer,
  open,
  onClose,
  onImageGenerated,
  onCreateIdea,
}: NewImageGenerationDialogProps) {
  const [step, setStep] = useState<Step>('select-idea');
  const [selectedIdea, setSelectedIdea] = useState<ImageIdea | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Ideas loading state
  const [ideas, setIdeas] = useState<ImageIdea[]>([]);
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
  const [imageType, setImageType] = useState<GenerateImageFromIdeaDto['imageType']>('LIFESTYLE');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isReference, setIsReference] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  const loadIdeas = useCallback(
    async (query: PaginationQueryDto = {}) => {
      try {
        setIsLoadingIdeas(true);
        const response = await InfluencerService.getImageIdeas(influencer.id, {
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

  const handleIdeaSelect = async (idea: ImageIdea) => {
    setSelectedIdea(idea);
    setStep('configure-generation');

    // Generate optimized prompt in the background
    try {
      setIsGeneratingPrompt(true);

      const enhancedPrompt = `Based on the selected idea "${idea.title}":
${idea.description}

Setting: ${idea.setting || 'Not specified'}
Mood: ${idea.mood || 'Not specified'}
Style Notes: ${idea.styleNotes || 'Not specified'}
Visual Elements: ${idea.visualElements?.join(', ') || 'Not specified'}`;

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

      const generateData: GenerateImageFromIdeaDto = {
        imageIdeaId: selectedIdea.id,
        imageType,
        customPrompt: customPrompt || undefined,
        isReference,
      };

      const response = await InfluencerService.generateImageFromIdea(influencer.id, generateData);

      if (response.data) {
        toast.success('Image generated successfully!');
        onImageGenerated();
        onClose();
      } else {
        toast.error(response.error?.message || 'Failed to generate image');
        setStep('configure-generation');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
      setStep('configure-generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      setStep('select-idea');
      setSelectedIdea(null);
      setCustomPrompt('');
      setGeneratedPrompt('');
      onClose();
    }
  };

  const categories = Array.from(new Set(ideas.map((idea) => idea.category))).filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Generate Image for {influencer.name}</DialogTitle>
          <DialogDescription>Select an idea and configure the image generation settings</DialogDescription>
        </DialogHeader>

        {step === 'select-idea' && (
          <div className='space-y-4'>
            {/* Header with Actions */}
            <div className='flex items-center justify-between pb-2'>
              <div className='space-y-1'>
                <h3 className='text-lg font-semibold tracking-tight'>Select an Image Idea</h3>
                <p className='text-muted-foreground text-sm'>Choose from your saved ideas or create a new one</p>
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
                      placeholder='Search by title, description, or setting...'
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // Auto-search with debounce effect
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

            {/* Ideas List */}
            <Card className='border-border/50 shadow-sm'>
              {isLoadingIdeas ? (
                <CardContent className='p-8'>
                  <div className='flex items-center justify-center space-y-3'>
                    <div className='space-y-3 text-center'>
                      <div className='relative'>
                        <div className='border-primary/20 border-t-primary mx-auto h-12 w-12 animate-spin rounded-full border-4'></div>
                        <ImageIcon className='text-primary absolute inset-0 m-auto h-6 w-6' />
                      </div>
                      <p className='text-muted-foreground text-sm'>Loading your image ideas...</p>
                    </div>
                  </div>
                </CardContent>
              ) : ideas.length > 0 ? (
                <div>
                  {/* Results Header */}
                  <div className='bg-muted/20 border-border/50 border-b px-4 py-3'>
                    <div className='flex items-center justify-between'>
                      <p className='text-foreground text-sm font-medium'>
                        {pagination.total} idea{pagination.total !== 1 ? 's' : ''} available
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

                  {/* Scrollable Ideas List */}
                  <div className='max-h-[450px] overflow-y-auto'>
                    {ideas.map((idea, index) => (
                      <div
                        key={idea.id}
                        className='hover:bg-muted/30 border-border/30 group cursor-pointer border-b p-4 transition-all duration-200 last:border-b-0'
                        onClick={() => handleIdeaSelect(idea)}
                      >
                        <div className='flex items-start space-x-4'>
                          {/* Idea Number & Icon */}
                          <div className='relative flex-shrink-0'>
                            <div className='border-border/50 flex h-10 w-10 items-center justify-center rounded-lg border bg-gradient-to-br from-blue-500/10 to-purple-600/10 transition-colors group-hover:from-blue-500/20 group-hover:to-purple-600/20'>
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

                          {/* Idea Content */}
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
                                <Wand2 className='h-4 w-4' />
                              </Button>
                            </div>

                            {/* Metadata */}
                            <div className='flex items-center justify-between'>
                              <div className='text-muted-foreground flex items-center space-x-3 text-xs'>
                                {idea.setting && (
                                  <span className='flex items-center rounded-md bg-blue-50 px-2 py-1 dark:bg-blue-950/30'>
                                    <span className='mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-500'></span>
                                    {idea.setting}
                                  </span>
                                )}
                                {idea.mood && (
                                  <span className='flex items-center rounded-md bg-purple-50 px-2 py-1 dark:bg-purple-950/30'>
                                    <span className='mr-1.5 h-1.5 w-1.5 rounded-full bg-purple-500'></span>
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
                    <div className='border-border/50 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed bg-gradient-to-br from-blue-500/10 to-purple-600/10'>
                      <ImageIcon className='text-muted-foreground h-10 w-10' />
                    </div>
                    <div className='max-w-md space-y-2 text-center'>
                      <h4 className='text-foreground font-semibold'>No Ideas Found</h4>
                      <p className='text-muted-foreground text-sm leading-relaxed'>
                        {searchQuery || (categoryFilter && categoryFilter !== 'all')
                          ? 'No ideas match your search criteria. Try adjusting your filters or create a new idea.'
                          : 'Get started by creating your first image idea. You can also upload an image for AI-powered suggestions.'}
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
            {/* Header with Back Button */}
            <div className='border-border/30 flex items-center space-x-4 border-b pb-2'>
              <Button variant='ghost' onClick={() => setStep('select-idea')} size='sm'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Ideas
              </Button>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold tracking-tight'>Configure Image Generation</h3>
                <p className='text-muted-foreground text-sm'>Review your selection and customize the output</p>
              </div>
            </div>

            {/* Selected Idea Preview */}
            <Card className='border-border/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 shadow-sm dark:from-blue-950/20 dark:to-purple-950/20'>
              <CardContent className='p-6'>
                <div className='flex items-start space-x-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg'>
                    <Eye className='h-6 w-6 text-white' />
                  </div>
                  <div className='flex-1 space-y-3'>
                    <div className='flex items-center space-x-2'>
                      <Badge variant='secondary' className='bg-white/80 dark:bg-black/20'>
                        {selectedIdea.category}
                      </Badge>
                      {selectedIdea.isUsed && (
                        <Badge
                          variant='outline'
                          className='border-green-200 bg-green-50 text-green-600 dark:bg-green-950/30'
                        >
                          <Eye className='mr-1 h-3 w-3' />
                          Previously Used
                        </Badge>
                      )}
                    </div>
                    <div>
                      <h4 className='text-foreground text-lg font-semibold'>{selectedIdea.title}</h4>
                      <p className='text-muted-foreground leading-relaxed'>{selectedIdea.description}</p>
                    </div>
                    {selectedIdea.visualElements && selectedIdea.visualElements.length > 0 && (
                      <div className='flex flex-wrap gap-1.5'>
                        {selectedIdea.visualElements.map((element, index) => (
                          <Badge key={index} variant='outline' className='bg-white/60 text-xs dark:bg-black/20'>
                            {element}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generation Configuration */}
            <div className='grid gap-6 lg:grid-cols-1'>
              <Card className='border-border/50 shadow-sm'>
                <CardHeader className='pb-4'>
                  <CardTitle className='text-base'>Image Settings</CardTitle>
                  <CardDescription>Configure the type and style of image to generate</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='space-y-3'>
                    <Label className='text-sm font-medium'>Image Type</Label>
                    <Select
                      value={imageType}
                      onValueChange={(value: GenerateImageFromIdeaDto['imageType']) => setImageType(value)}
                    >
                      <SelectTrigger className='bg-background border-border/50'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {IMAGE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className='py-1'>
                              <div className='font-medium'>{type.label}</div>
                              <div className='text-muted-foreground text-xs'>{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='bg-muted/30 border-border/30 flex items-center space-x-3 rounded-lg border p-3'>
                    <input
                      type='checkbox'
                      id='is-reference'
                      checked={isReference}
                      onChange={(e) => setIsReference(e.target.checked)}
                      className='border-border text-primary focus:ring-primary/20 h-4 w-4 rounded'
                    />
                    <div className='flex-1'>
                      <Label htmlFor='is-reference' className='cursor-pointer text-sm font-medium'>
                        Mark as reference image
                      </Label>
                      <p className='text-muted-foreground text-xs'>
                        Reference images help maintain consistency across generations
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='border-border/50 shadow-sm'>
                <CardHeader className='pb-4'>
                  <CardTitle className='flex items-center space-x-2 text-base'>
                    <Sparkles className='h-5 w-5 text-amber-500' />
                    <span>AI-Generated Prompt</span>
                  </CardTitle>
                  <CardDescription>Optimized prompt based on your idea and influencer details</CardDescription>
                </CardHeader>
                <CardContent>
                  {isGeneratingPrompt ? (
                    <div className='flex flex-col items-center justify-center space-y-3 py-8'>
                      <div className='relative'>
                        <div className='border-primary/20 border-t-primary h-10 w-10 animate-spin rounded-full border-4'></div>
                        <Sparkles className='text-primary absolute inset-0 m-auto h-5 w-5' />
                      </div>
                      <p className='text-muted-foreground text-sm'>Generating optimized prompt...</p>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      <div className='max-h-32 overflow-y-auto rounded-lg border border-amber-200/30 bg-gradient-to-br from-amber-50/50 to-orange-50/50 p-4 dark:border-amber-800/30 dark:from-amber-950/20 dark:to-orange-950/20'>
                        <p className='text-foreground text-sm leading-relaxed whitespace-pre-wrap'>
                          {generatedPrompt || 'Prompt will be generated when you select an idea...'}
                        </p>
                      </div>
                      {generatedPrompt && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleIdeaSelect(selectedIdea)}
                          disabled={isGeneratingPrompt}
                          className='w-full'
                        >
                          <Sparkles className='mr-2 h-4 w-4' />
                          Regenerate Prompt
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Custom Prompt Override */}
            <Card className='border-border/50 shadow-sm'>
              <CardHeader className='pb-4'>
                <CardTitle className='text-base'>Custom Prompt (Optional)</CardTitle>
                <CardDescription>Override the AI-generated prompt with your own custom instructions</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder='Enter your custom prompt here to override the AI-generated one...'
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className='bg-background border-border/50 focus:border-primary/50 min-h-[120px] resize-none'
                />
                <div className='mt-3 flex items-center justify-between'>
                  <p className='text-muted-foreground text-xs'>Leave empty to use the AI-generated prompt above</p>
                  <span className='text-muted-foreground text-xs'>{customPrompt.length}/1000</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className='border-border/30 flex justify-between border-t pt-4'>
              <Button variant='outline' onClick={() => setStep('select-idea')}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Change Idea
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGeneratingPrompt || !generatedPrompt}
                className='min-w-[140px]'
              >
                {isGeneratingPrompt ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Wand2 className='mr-2 h-4 w-4' />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'generating' && selectedIdea && (
          <div className='space-y-8 py-12 text-center'>
            {/* Generation Animation */}
            <div className='flex justify-center'>
              <div className='relative'>
                <div className='border-primary/20 flex h-32 w-32 items-center justify-center rounded-full border-4 bg-gradient-to-br from-blue-500/10 to-purple-600/10'>
                  <div className='border-t-primary h-24 w-24 animate-spin rounded-full border-4 border-transparent'></div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg'>
                      <Wand2 className='h-8 w-8 animate-pulse text-white' />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generation Details */}
            <div className='mx-auto max-w-lg space-y-6'>
              <div className='space-y-3'>
                <h3 className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent'>
                  Generating Your Image
                </h3>
                <div className='space-y-2'>
                  <p className='text-foreground text-lg font-medium'>&quot;{selectedIdea.title}&quot;</p>
                  <p className='text-muted-foreground'>for {influencer.name}</p>
                </div>
              </div>

              {/* Technical Details */}
              <Card className='border-border/50 bg-muted/20 shadow-sm'>
                <CardContent className='p-6'>
                  <div className='space-y-4'>
                    <div className='text-muted-foreground flex items-center justify-center space-x-2 text-sm'>
                      <Sparkles className='h-4 w-4 text-amber-500' />
                      <span>Powered by Google&apos;s Imagen AI</span>
                    </div>

                    <div className='grid grid-cols-2 gap-4 text-xs'>
                      <div className='bg-background border-border/30 rounded-lg border p-3 text-center'>
                        <div className='text-foreground font-medium'>Image Type</div>
                        <div className='text-muted-foreground mt-1'>
                          {IMAGE_TYPES.find((t) => t.value === imageType)?.label}
                        </div>
                      </div>
                      <div className='bg-background border-border/30 rounded-lg border p-3 text-center'>
                        <div className='text-foreground font-medium'>Category</div>
                        <div className='text-muted-foreground mt-1'>{selectedIdea.category}</div>
                      </div>
                    </div>

                    <div className='space-y-2 text-center'>
                      <p className='text-muted-foreground text-sm'>This may take 30-60 seconds</p>
                      <p className='text-muted-foreground text-xs'>
                        Please don&apos;t close this dialog during generation
                      </p>
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
