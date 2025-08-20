'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIInfluencer } from '@/types';
import { InfluencerService, CreateImageIdeaDto, CreateVideoIdeaDto, ImageIdea, VideoIdea } from '@/services';
import { toast } from 'sonner';
import { Plus, X, Wand2, Upload, Loader2 } from 'lucide-react';

interface IdeaManagementDialogProps {
  influencer: AIInfluencer;
  open: boolean;
  onClose: () => void;
  onIdeaCreated: (type: 'image' | 'video') => void;
  initialTab?: 'image' | 'video';
  editingImageIdea?: ImageIdea;
  editingVideoIdea?: VideoIdea;
}

const IMAGE_CATEGORIES = [
  'Portrait',
  'Lifestyle',
  'Fashion',
  'Beauty',
  'Fitness',
  'Travel',
  'Food',
  'Art',
  'Professional',
  'Casual',
  'Custom'
];

const VIDEO_CATEGORIES = [
  'Lifestyle',
  'Fashion',
  'Beauty',
  'Fitness',
  'Travel',
  'Tutorial',
  'Dance',
  'Comedy',
  'Vlog',
  'Review',
  'Custom'
];

const MOOD_OPTIONS = [
  'Professional',
  'Casual',
  'Elegant',
  'Playful',
  'Artistic',
  'Dramatic',
  'Romantic',
  'Energetic',
  'Serene',
  'Bold'
];

export function IdeaManagementDialog({
  influencer,
  open,
  onClose,
  onIdeaCreated,
  initialTab = 'image',
  editingImageIdea,
  editingVideoIdea,
}: IdeaManagementDialogProps) {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Image idea form state
  const [imageForm, setImageForm] = useState<CreateImageIdeaDto>({
    title: editingImageIdea?.title || '',
    description: editingImageIdea?.description || '',
    category: editingImageIdea?.category || '',
    setting: editingImageIdea?.setting || '',
    mood: editingImageIdea?.mood || '',
    styleNotes: editingImageIdea?.styleNotes || '',
    visualElements: editingImageIdea?.visualElements || [],
  });

  // Video idea form state
  const [videoForm, setVideoForm] = useState<CreateVideoIdeaDto>({
    title: editingVideoIdea?.title || '',
    description: editingVideoIdea?.description || '',
    scenario: editingVideoIdea?.scenario || '',
    category: editingVideoIdea?.category || '',
    duration: editingVideoIdea?.duration || '5-10 seconds',
    mood: editingVideoIdea?.mood || '',
    visualStyle: editingVideoIdea?.visualStyle || '',
    keyMoments: editingVideoIdea?.keyMoments || [],
  });

  const [newVisualElement, setNewVisualElement] = useState('');
  const [newKeyMoment, setNewKeyMoment] = useState('');

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsAnalyzing(true);
      const response = await InfluencerService.analyzeImageForIdea(influencer.id, file);

      if (response.data) {
        const analysis = response.data;
        setImageForm({
          title: analysis.suggestedTitle,
          description: analysis.suggestedDescription,
          category: analysis.suggestedCategory,
          setting: analysis.suggestedSetting,
          mood: analysis.suggestedMood,
          styleNotes: analysis.suggestedStyleNotes,
          visualElements: analysis.suggestedVisualElements,
        });
        toast.success('Image analyzed successfully! Form has been auto-filled.');
      } else {
        toast.error(response.error?.message || 'Failed to analyze image');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageSubmit = async () => {
    if (!imageForm.title.trim() || !imageForm.description.trim()) {
      toast.error('Please fill in the title and description');
      return;
    }

    try {
      setIsLoading(true);

      if (editingImageIdea) {
        const response = await InfluencerService.updateImageIdea(influencer.id, editingImageIdea.id, imageForm);
        if (response.data) {
          toast.success('Image idea updated successfully!');
          onIdeaCreated('image');
          onClose();
        } else {
          toast.error(response.error?.message || 'Failed to update image idea');
        }
      } else {
        const response = await InfluencerService.createImageIdea(influencer.id, imageForm);
        if (response.data) {
          toast.success('Image idea created successfully!');
          onIdeaCreated('image');
          onClose();
        } else {
          toast.error(response.error?.message || 'Failed to create image idea');
        }
      }
    } catch (error) {
      console.error('Error saving image idea:', error);
      toast.error('Failed to save image idea');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoSubmit = async () => {
    if (!videoForm.title.trim() || !videoForm.description.trim() || !videoForm.scenario.trim()) {
      toast.error('Please fill in the title, description, and scenario');
      return;
    }

    try {
      setIsLoading(true);

      if (editingVideoIdea) {
        const response = await InfluencerService.updateVideoIdea(influencer.id, editingVideoIdea.id, videoForm);
        if (response.data) {
          toast.success('Video idea updated successfully!');
          onIdeaCreated('video');
          onClose();
        } else {
          toast.error(response.error?.message || 'Failed to update video idea');
        }
      } else {
        const response = await InfluencerService.createVideoIdea(influencer.id, videoForm);
        if (response.data) {
          toast.success('Video idea created successfully!');
          onIdeaCreated('video');
          onClose();
        } else {
          toast.error(response.error?.message || 'Failed to create video idea');
        }
      }
    } catch (error) {
      console.error('Error saving video idea:', error);
      toast.error('Failed to save video idea');
    } finally {
      setIsLoading(false);
    }
  };

  const addVisualElement = () => {
    if (newVisualElement.trim() && !imageForm.visualElements?.includes(newVisualElement.trim())) {
      setImageForm(prev => ({
        ...prev,
        visualElements: [...(prev.visualElements || []), newVisualElement.trim()]
      }));
      setNewVisualElement('');
    }
  };

  const removeVisualElement = (element: string) => {
    setImageForm(prev => ({
      ...prev,
      visualElements: prev.visualElements?.filter(el => el !== element) || []
    }));
  };

  const addKeyMoment = () => {
    if (newKeyMoment.trim() && !videoForm.keyMoments?.includes(newKeyMoment.trim())) {
      setVideoForm(prev => ({
        ...prev,
        keyMoments: [...(prev.keyMoments || []), newKeyMoment.trim()]
      }));
      setNewKeyMoment('');
    }
  };

  const removeKeyMoment = (moment: string) => {
    setVideoForm(prev => ({
      ...prev,
      keyMoments: prev.keyMoments?.filter(m => m !== moment) || []
    }));
  };

  const handleClose = () => {
    if (!isLoading && !isAnalyzing) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingImageIdea || editingVideoIdea ? 'Edit' : 'Create'} Idea for {influencer.name}
          </DialogTitle>
          <DialogDescription>
            {editingImageIdea || editingVideoIdea 
              ? 'Update the details of your idea'
              : 'Create a new idea that can be used to generate images or videos'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'image' | 'video')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image" disabled={!!editingVideoIdea}>Image Idea</TabsTrigger>
            <TabsTrigger value="video" disabled={!!editingImageIdea}>Video Idea</TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-6">
            {/* Image Upload Analyzer */}
            {!editingImageIdea && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wand2 className="h-5 w-5" />
                    <span>AI-Powered Idea Generator</span>
                  </CardTitle>
                  <CardDescription>
                    Upload an image and let AI analyze it to auto-fill your idea details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="hidden"
                      id="image-upload"
                      disabled={isAnalyzing}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`cursor-pointer flex flex-col items-center space-y-2 ${
                        isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isAnalyzing ? (
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-600">
                        {isAnalyzing ? 'Analyzing image...' : 'Click to upload an image for AI analysis'}
                      </span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Image Idea Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-title">Title *</Label>
                  <Input
                    id="image-title"
                    placeholder="e.g., Golden Hour Portrait"
                    value={imageForm.title}
                    onChange={(e) => setImageForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-category">Category</Label>
                  <Select
                    value={imageForm.category}
                    onValueChange={(value) => setImageForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMAGE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-description">Description *</Label>
                <Textarea
                  id="image-description"
                  placeholder="Describe the concept and visual style of this image idea..."
                  value={imageForm.description}
                  onChange={(e) => setImageForm(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-setting">Setting/Location</Label>
                  <Input
                    id="image-setting"
                    placeholder="e.g., Urban rooftop, Beach, Studio"
                    value={imageForm.setting}
                    onChange={(e) => setImageForm(prev => ({ ...prev, setting: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-mood">Mood</Label>
                  <Select
                    value={imageForm.mood}
                    onValueChange={(value) => setImageForm(prev => ({ ...prev, mood: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOOD_OPTIONS.map((mood) => (
                        <SelectItem key={mood} value={mood}>
                          {mood}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-style-notes">Style Notes</Label>
                <Textarea
                  id="image-style-notes"
                  placeholder="Additional style notes, lighting preferences, composition details..."
                  value={imageForm.styleNotes}
                  onChange={(e) => setImageForm(prev => ({ ...prev, styleNotes: e.target.value }))}
                  className="min-h-[60px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Visual Elements</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add visual element..."
                    value={newVisualElement}
                    onChange={(e) => setNewVisualElement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addVisualElement()}
                  />
                  <Button type="button" onClick={addVisualElement} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {imageForm.visualElements && imageForm.visualElements.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imageForm.visualElements.map((element, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{element}</span>
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeVisualElement(element)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleImageSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingImageIdea ? 'Update' : 'Create'} Image Idea
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="video" className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="video-title">Title *</Label>
                  <Input
                    id="video-title"
                    placeholder="e.g., Morning Routine Vlog"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video-category">Category</Label>
                  <Select
                    value={videoForm.category}
                    onValueChange={(value) => setVideoForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {VIDEO_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-description">Description *</Label>
                <Textarea
                  id="video-description"
                  placeholder="Describe what happens in this video..."
                  value={videoForm.description}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-scenario">Scenario/Setting *</Label>
                <Textarea
                  id="video-scenario"
                  placeholder="Describe the setting, environment, and what the influencer is doing..."
                  value={videoForm.scenario}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, scenario: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="video-duration">Duration</Label>
                  <Select
                    value={videoForm.duration}
                    onValueChange={(value) => setVideoForm(prev => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-5 seconds">3-5 seconds</SelectItem>
                      <SelectItem value="5-10 seconds">5-10 seconds</SelectItem>
                      <SelectItem value="10-15 seconds">10-15 seconds</SelectItem>
                      <SelectItem value="15-30 seconds">15-30 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video-mood">Mood</Label>
                  <Select
                    value={videoForm.mood}
                    onValueChange={(value) => setVideoForm(prev => ({ ...prev, mood: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOOD_OPTIONS.map((mood) => (
                        <SelectItem key={mood} value={mood}>
                          {mood}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video-visual-style">Visual Style</Label>
                  <Input
                    id="video-visual-style"
                    placeholder="e.g., Cinematic, Documentary"
                    value={videoForm.visualStyle}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, visualStyle: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Key Moments</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add key moment..."
                    value={newKeyMoment}
                    onChange={(e) => setNewKeyMoment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyMoment()}
                  />
                  <Button type="button" onClick={addKeyMoment} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {videoForm.keyMoments && videoForm.keyMoments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {videoForm.keyMoments.map((moment, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{moment}</span>
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeKeyMoment(moment)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleVideoSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingVideoIdea ? 'Update' : 'Create'} Video Idea
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
