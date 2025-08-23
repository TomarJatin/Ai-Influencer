'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Wand2, RefreshCw, Save, Image as ImageIcon, Upload, X } from 'lucide-react';
import { AIInfluencer, OptimizedPrompt } from '@/types';
import { InfluencerService } from '@/services';
import { toast } from 'sonner';

interface BaseImageGenerationDialogProps {
  influencer: AIInfluencer;
  open: boolean;
  onClose: () => void;
  onBaseImageUpdated: () => void;
}

export function BaseImageGenerationDialog({
  influencer,
  open,
  onClose,
  onBaseImageUpdated,
}: BaseImageGenerationDialogProps) {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState<OptimizedPrompt | null>(null);
  const [customInstructions, setCustomInstructions] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isRegeneratingPrompt, setIsRegeneratingPrompt] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('generate');

  // Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Generate initial prompt when dialog opens
  const generateInitialPrompt = async () => {
    if (generatedPrompt && !influencer.baseImageUrl) return; // Already have a prompt for new influencers

    setIsGeneratingPrompt(true);
    setError(null);

    try {
      const response = await InfluencerService.generateBaseImagePrompt({
        influencerId: influencer.id,
        customInstructions: '',
      });

      if (response.data) {
        setGeneratedPrompt(response.data);
        setCurrentPrompt(response.data.prompt);
      } else {
        setError(response.error?.message || 'Failed to generate prompt');
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
      setError('Failed to generate prompt');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  // Regenerate prompt with custom instructions
  const regeneratePrompt = async () => {
    if (!customInstructions.trim()) {
      toast.error('Please enter custom instructions for prompt regeneration');
      return;
    }

    setIsRegeneratingPrompt(true);
    setError(null);

    try {
      const response = await InfluencerService.regenerateBaseImagePrompt({
        influencerId: influencer.id,
        currentPrompt,
        customInstructions,
      });

      if (response.data) {
        setGeneratedPrompt(response.data);
        setCurrentPrompt(response.data.prompt);
        setCustomInstructions('');
        toast.success('Prompt regenerated successfully');
      } else {
        setError(response.error?.message || 'Failed to regenerate prompt');
      }
    } catch (error) {
      console.error('Error regenerating prompt:', error);
      setError('Failed to regenerate prompt');
    } finally {
      setIsRegeneratingPrompt(false);
    }
  };

  // Generate base image
  const generateImage = async () => {
    if (!currentPrompt.trim()) {
      toast.error('Please enter or generate a prompt first');
      return;
    }

    setIsGeneratingImage(true);
    setError(null);

    try {
      const response = await InfluencerService.generateBaseImage({
        influencerId: influencer.id,
        prompt: currentPrompt,
        imageType: 'PORTRAIT',
      });

      if (response.data) {
        setGeneratedImageUrl(response.data.imageUrl);
        toast.success('Base image generated successfully');
      } else {
        setError(response.error?.message || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Save base image
  const saveBaseImage = async () => {
    if (!generatedImageUrl || !currentPrompt) {
      toast.error('Please generate an image first');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await InfluencerService.saveBaseImage({
        influencerId: influencer.id,
        imageUrl: generatedImageUrl,
        prompt: currentPrompt,
      });

      if (response.data) {
        toast.success('Base image saved successfully');
        onBaseImageUpdated();
      } else {
        setError(response.error?.message || 'Failed to save base image');
      }
    } catch (error) {
      console.error('Error saving base image:', error);
      setError('Failed to save base image');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  // Process selected file
  const processFile = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, and WebP are allowed');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 10MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Upload base image
  const uploadBaseImage = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await InfluencerService.uploadBaseImage(influencer.id, selectedFile);

      if (response.data) {
        toast.success('Base image uploaded successfully');
        onBaseImageUpdated();
      } else {
        setError(response.error?.message || 'Failed to upload base image');
      }
    } catch (error) {
      console.error('Error uploading base image:', error);
      setError('Failed to upload base image');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
    setUploadPreview(null);
  };

  // Reset dialog state when opened/closed
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !generatedPrompt) {
      generateInitialPrompt();
    } else if (!newOpen) {
      // Reset state
      setCurrentPrompt('');
      setGeneratedPrompt(null);
      setCustomInstructions('');
      setGeneratedImageUrl(null);
      setSelectedFile(null);
      setUploadPreview(null);
      setActiveTab('generate');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center space-x-2'>
            <ImageIcon className='h-5 w-5' />
            <span>
              {influencer.baseImageUrl ? 'Edit Base Face Image' : 'Generate Base Face Image'} - {influencer.name}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='generate' className='flex items-center space-x-2'>
                <Wand2 className='h-4 w-4' />
                <span>Generate Base Image</span>
              </TabsTrigger>
              <TabsTrigger value='upload' className='flex items-center space-x-2'>
                <Upload className='h-4 w-4' />
                <span>Upload Base Image</span>
              </TabsTrigger>
            </TabsList>

            {/* Generate Tab Content */}
            <TabsContent value='generate' className='space-y-6'>
              {/* Prompt Generation Section */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>1. Generate Face-Focused Prompt</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='prompt'>Prompt</Label>
                    {isGeneratingPrompt ? (
                      <div className='space-y-2'>
                        <Skeleton className='h-32 w-full' />
                      </div>
                    ) : (
                      <Textarea
                        id='prompt'
                        value={currentPrompt}
                        onChange={(e) => setCurrentPrompt(e.target.value)}
                        placeholder='Enter or generate a prompt for the base face image...'
                        className='min-h-[120px]'
                      />
                    )}
                  </div>

                  {!generatedPrompt && !isGeneratingPrompt && (
                    <Button onClick={generateInitialPrompt} disabled={isGeneratingPrompt}>
                      {isGeneratingPrompt ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Generating Prompt...
                        </>
                      ) : (
                        <>
                          <Wand2 className='mr-2 h-4 w-4' />
                          Generate Initial Prompt
                        </>
                      )}
                    </Button>
                  )}

                  {generatedPrompt && (
                    <div className='space-y-4'>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='space-y-2'>
                          <Label htmlFor='reasoning'>Reasoning</Label>
                          <Textarea
                            id='reasoning'
                            value={generatedPrompt.reasoning}
                            readOnly
                            className='min-h-[80px] text-sm'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='technical-notes'>Technical Notes</Label>
                          <Textarea
                            id='technical-notes'
                            value={generatedPrompt.technicalNotes}
                            readOnly
                            className='min-h-[80px] text-sm'
                          />
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='custom-instructions'>Custom Instructions (for regeneration)</Label>
                        <Textarea
                          id='custom-instructions'
                          value={customInstructions}
                          onChange={(e) => setCustomInstructions(e.target.value)}
                          placeholder='Enter specific instructions to improve the prompt...'
                          className='min-h-[80px]'
                        />
                      </div>

                      <Button
                        onClick={regeneratePrompt}
                        disabled={isRegeneratingPrompt || !customInstructions.trim()}
                        variant='outline'
                      >
                        {isRegeneratingPrompt ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Regenerating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className='mr-2 h-4 w-4' />
                            Regenerate Prompt
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Image Generation Section */}
              {currentPrompt && (
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>2. Generate Base Face Image</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <Button
                      onClick={generateImage}
                      disabled={isGeneratingImage || !currentPrompt.trim()}
                      className='w-full'
                    >
                      {isGeneratingImage ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Generating Face Image...
                        </>
                      ) : (
                        <>
                          <ImageIcon className='mr-2 h-4 w-4' />
                          Generate Face Image
                        </>
                      )}
                    </Button>

                    {generatedImageUrl && (
                      <div className='space-y-4'>
                        <div className='bg-muted relative h-64 w-full overflow-hidden rounded-lg'>
                          <img
                            src={generatedImageUrl}
                            alt='Generated base face'
                            className='h-full w-full object-cover'
                          />
                        </div>

                        <Button onClick={saveBaseImage} disabled={isSaving} className='w-full'>
                          {isSaving ? (
                            <>
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className='mr-2 h-4 w-4' />
                              Save as Base Image
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Upload Tab Content */}
            <TabsContent value='upload' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Upload Custom Base Face Image</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* File Upload Area */}
                  <div
                    className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                      dragActive
                        ? 'border-primary bg-primary/10'
                        : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className='space-y-4'>
                      <div className='flex justify-center'>
                        <Upload className='text-muted-foreground h-12 w-12' />
                      </div>
                      <div>
                        <p className='text-lg font-medium'>Drop your base image here</p>
                        <p className='text-muted-foreground text-sm'>or click to browse files</p>
                      </div>
                      <div className='text-muted-foreground text-xs'>Supports JPEG, PNG, WebP • Max size: 10MB</div>
                      <input
                        type='file'
                        accept='image/jpeg,image/jpg,image/png,image/webp'
                        onChange={handleFileSelect}
                        className='hidden'
                        id='file-upload'
                      />
                      <Button
                        variant='outline'
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className='mt-4'
                      >
                        <Upload className='mr-2 h-4 w-4' />
                        Select File
                      </Button>
                    </div>
                  </div>

                  {/* File Preview */}
                  {uploadPreview && selectedFile && (
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <Label>Selected File</Label>
                        <Button variant='ghost' size='sm' onClick={removeSelectedFile}>
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='bg-muted relative h-64 w-full overflow-hidden rounded-lg'>
                        <img src={uploadPreview} alt='Upload preview' className='h-full w-full object-cover' />
                      </div>
                      <div className='text-muted-foreground text-sm'>
                        {selectedFile.name} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>

                      <Button onClick={uploadBaseImage} disabled={isUploading} className='w-full'>
                        {isUploading ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Save className='mr-2 h-4 w-4' />
                            Upload as Base Image
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className='flex justify-end space-x-2'>
            <Button variant='outline' onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
