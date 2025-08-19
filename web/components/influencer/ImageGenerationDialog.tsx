'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIInfluencer } from '@/types';
import { InfluencerService } from '@/services';
import { toast } from 'sonner';
import { Wand2, Loader2 } from 'lucide-react';

interface ImageGenerationDialogProps {
  influencer: AIInfluencer;
  open: boolean;
  onClose: () => void;
  onImageGenerated: () => void;
}

const IMAGE_TYPES = [
  { value: 'PORTRAIT', label: 'Portrait', description: 'Close-up headshot focusing on facial features' },
  { value: 'FULL_BODY', label: 'Full Body', description: 'Complete body shot showing full appearance' },
  { value: 'BEAUTY_SHOT', label: 'Beauty Shot', description: 'High-quality beauty photography style' },
  { value: 'LIFESTYLE', label: 'Lifestyle', description: 'Natural, candid lifestyle photography' },
  { value: 'REFERENCE', label: 'Reference', description: 'Multiple angles for consistency reference' },
];

export function ImageGenerationDialog({ influencer, open, onClose, onImageGenerated }: ImageGenerationDialogProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [step, setStep] = useState<'select' | 'prompt' | 'generating'>('select');

  const handleTypeSelect = async (type: string) => {
    setSelectedType(type);
    setStep('prompt');

    try {
      setIsGeneratingPrompt(true);
      const response = await InfluencerService.generateLegacyImagePrompt(influencer.id, type);

      if (response.data) {
        setGeneratedPrompt(response.data.prompt);
      } else {
        toast.error(response.error?.message || 'Failed to generate prompt');
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error('Failed to generate prompt');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!selectedType) return;

    try {
      setIsGeneratingImage(true);
      setStep('generating');

      const response = await InfluencerService.generateImage({
        influencerId: influencer.id,
        imageType: selectedType as 'PORTRAIT' | 'FULL_BODY' | 'BEAUTY_SHOT' | 'LIFESTYLE' | 'REFERENCE',
        customPrompt: customPrompt || generatedPrompt,
      });

      if (response.data) {
        toast.success('Image generated successfully!');
        onImageGenerated();
        onClose();
      } else {
        toast.error(response.error?.message || 'Failed to generate image');
        setStep('prompt');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
      setStep('prompt');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleClose = () => {
    if (!isGeneratingImage) {
      setStep('select');
      setSelectedType('');
      setGeneratedPrompt('');
      setCustomPrompt('');
      onClose();
    }
  };

  const selectedTypeInfo = IMAGE_TYPES.find((type) => type.value === selectedType);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Generate Image for {influencer.name}</DialogTitle>
          <DialogDescription>
            Create high-quality images using AI generation based on your influencer&apos;s characteristics
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {step === 'select' && (
            <>
              <div>
                <Label className='text-base font-medium'>Select Image Type</Label>
                <p className='text-muted-foreground mb-4 text-sm'>Choose the type of image you want to generate</p>
              </div>

              <div className='grid gap-3 md:grid-cols-2'>
                {IMAGE_TYPES.map((type) => (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedType === type.value ? 'ring-primary ring-2' : ''
                    }`}
                    onClick={() => handleTypeSelect(type.value)}
                  >
                    <CardHeader className='pb-3'>
                      <div className='flex items-center justify-between'>
                        <CardTitle className='text-lg'>{type.label}</CardTitle>
                        {type.value === 'REFERENCE' && <Badge variant='secondary'>Recommended</Badge>}
                      </div>
                      <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </>
          )}

          {step === 'prompt' && (
            <>
              <div className='flex items-center space-x-2'>
                <Button variant='outline' size='sm' onClick={() => setStep('select')} disabled={isGeneratingPrompt}>
                  ← Back
                </Button>
                <div>
                  <h3 className='font-medium'>Generate {selectedTypeInfo?.label} Image</h3>
                  <p className='text-muted-foreground text-sm'>{selectedTypeInfo?.description}</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center space-x-2 text-lg'>
                    <Wand2 className='h-5 w-5' />
                    <span>Generated Prompt</span>
                  </CardTitle>
                  <CardDescription>
                    AI-generated prompt based on {influencer.name}&apos;s characteristics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGeneratingPrompt ? (
                    <div className='flex items-center justify-center py-8'>
                      <Loader2 className='mr-2 h-6 w-6 animate-spin' />
                      <span>Generating optimized prompt...</span>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      <div className='bg-muted rounded-lg p-4'>
                        <p className='text-sm whitespace-pre-wrap'>{generatedPrompt}</p>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Button variant='outline' size='sm' onClick={() => handleTypeSelect(selectedType)}>
                          <Wand2 className='mr-2 h-3 w-3' />
                          Regenerate Prompt
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className='space-y-2'>
                <Label htmlFor='custom-prompt'>Custom Prompt (Optional)</Label>
                <Textarea
                  id='custom-prompt'
                  placeholder='Enter your own custom prompt or modify the generated one...'
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className='min-h-[100px]'
                />
                <p className='text-muted-foreground text-xs'>
                  Leave empty to use the generated prompt, or provide your own for custom results
                </p>
              </div>

              <div className='flex justify-end space-x-2'>
                <Button variant='outline' onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateImage} disabled={isGeneratingPrompt || !generatedPrompt}>
                  <Wand2 className='mr-2 h-4 w-4' />
                  Generate Image
                </Button>
              </div>
            </>
          )}

          {step === 'generating' && (
            <div className='space-y-6 py-8 text-center'>
              <div className='flex justify-center'>
                <div className='relative'>
                  <div className='border-primary/20 h-20 w-20 animate-spin rounded-full border-4'>
                    <div className='border-t-primary absolute inset-0 animate-spin rounded-full border-4 border-transparent'></div>
                  </div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <Wand2 className='text-primary h-8 w-8' />
                  </div>
                </div>
              </div>

              <div className='space-y-2'>
                <h3 className='text-xl font-semibold'>Generating Your Image</h3>
                <p className='text-muted-foreground'>
                  Creating a {selectedTypeInfo?.label.toLowerCase()} image of {influencer.name}...
                </p>
                <p className='text-muted-foreground text-sm'>
                  This may take 30-60 seconds. Please don&apos;t close this dialog.
                </p>
              </div>

              <div className='space-y-2'>
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
                <p className='text-muted-foreground text-sm'>Processing with Imagen2...</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
