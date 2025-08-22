'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as ImageIcon, Video, Plus, Settings, ArrowLeft } from 'lucide-react';
import { AIInfluencer } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { ImageGenerationDialog } from './ImageGenerationDialog';
import { VideoGenerationDialog } from './VideoGenerationDialog';
import { EditInfluencerDialog } from './EditInfluencerDialog';
import { IdeaManagementDialog } from './IdeaManagementDialog';
import { NewImageGenerationDialog } from './NewImageGenerationDialog';
import { NewVideoGenerationDialog } from './NewVideoGenerationDialog';
import { InfluencerService, ImageIdea, VideoIdea, PaginationQueryDto } from '@/services';

// Import modular sections
import { InfluencerHeader } from './sections/InfluencerHeader';
import { ProfileSection } from './sections/ProfileSection';
import { GeneratedImagesSection } from './sections/GeneratedImagesSection';
import { GeneratedVideosSection } from './sections/GeneratedVideosSection';
import { ImageIdeasSection } from './sections/ImageIdeasSection';
import { VideoIdeasSection } from './sections/VideoIdeasSection';
import { DetailsSection } from './sections/DetailsSection';

interface InfluencerDetailPageProps {
  influencerId: string;
}

export default function InfluencerDetailPage({ influencerId }: InfluencerDetailPageProps) {
  const [influencer, setInfluencer] = useState<AIInfluencer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showIdeaDialog, setShowIdeaDialog] = useState(false);
  const [showNewImageDialog, setShowNewImageDialog] = useState(false);
  const [showNewVideoDialog, setShowNewVideoDialog] = useState(false);

  // Idea management states
  const [ideaDialogTab, setIdeaDialogTab] = useState<'image' | 'video'>('image');
  const [editingImageIdea, setEditingImageIdea] = useState<ImageIdea | null>(null);
  const [editingVideoIdea, setEditingVideoIdea] = useState<VideoIdea | null>(null);

  // Ideas data
  const [imageIdeas, setImageIdeas] = useState<ImageIdea[]>([]);
  const [videoIdeas, setVideoIdeas] = useState<VideoIdea[]>([]);
  const [isLoadingImageIdeas, setIsLoadingImageIdeas] = useState(false);
  const [isLoadingVideoIdeas, setIsLoadingVideoIdeas] = useState(false);

  // Pagination states
  const [imagePagination, setImagePagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  });
  const [videoPagination, setVideoPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  });

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

  // Load image ideas
  const loadImageIdeas = useCallback(
    async (query: PaginationQueryDto = {}) => {
      try {
        setIsLoadingImageIdeas(true);
        const response = await InfluencerService.getImageIdeas(influencerId, {
          page: imagePagination.page,
          limit: imagePagination.limit,
          ...query,
        });

        if (response.data) {
          setImageIdeas(response.data.items);
          setImagePagination((prev) => ({
            ...prev,
            total: response.data.total,
            totalPages: response.data.totalPages,
            page: response.data.page,
          }));
        }
      } catch (error) {
        console.error('Error loading image ideas:', error);
      } finally {
        setIsLoadingImageIdeas(false);
      }
    },
    [influencerId, imagePagination.page, imagePagination.limit]
  );

  // Load video ideas
  const loadVideoIdeas = useCallback(
    async (query: PaginationQueryDto = {}) => {
      try {
        setIsLoadingVideoIdeas(true);
        const response = await InfluencerService.getVideoIdeas(influencerId, {
          page: videoPagination.page,
          limit: videoPagination.limit,
          ...query,
        });

        if (response.data) {
          setVideoIdeas(response.data.items);
          setVideoPagination((prev) => ({
            ...prev,
            total: response.data.total,
            totalPages: response.data.totalPages,
            page: response.data.page,
          }));
        }
      } catch (error) {
        console.error('Error loading video ideas:', error);
      } finally {
        setIsLoadingVideoIdeas(false);
      }
    },
    [influencerId, videoPagination.page, videoPagination.limit]
  );

  useEffect(() => {
    loadInfluencer();
    loadImageIdeas();
    loadVideoIdeas();
  }, [loadInfluencer, loadImageIdeas, loadVideoIdeas]);

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

  // Handle idea management
  const handleCreateIdea = (type: 'image' | 'video') => {
    setIdeaDialogTab(type);
    setEditingImageIdea(null);
    setEditingVideoIdea(null);
    setShowIdeaDialog(true);
  };

  const handleEditIdea = (idea: ImageIdea | VideoIdea, type: 'image' | 'video') => {
    if (type === 'image') {
      setEditingImageIdea(idea as ImageIdea);
      setEditingVideoIdea(null);
    } else {
      setEditingVideoIdea(idea as VideoIdea);
      setEditingImageIdea(null);
    }
    setIdeaDialogTab(type);
    setShowIdeaDialog(true);
  };

  const handleDeleteIdea = (ideaId: string, type: 'image' | 'video') => {
    if (type === 'image') {
      setImageIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
      setImagePagination((prev) => ({ ...prev, total: prev.total - 1 }));
    } else {
      setVideoIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
      setVideoPagination((prev) => ({ ...prev, total: prev.total - 1 }));
    }
  };

  const handleIdeaCreated = (type: 'image' | 'video') => {
    if (type === 'image') {
      loadImageIdeas();
    } else {
      loadVideoIdeas();
    }
    setShowIdeaDialog(false);
    setEditingImageIdea(null);
    setEditingVideoIdea(null);
  };

  const handleGenerateFromIdea = (idea: ImageIdea | VideoIdea, type: 'image' | 'video') => {
    if (type === 'image') {
      setShowNewImageDialog(true);
    } else {
      setShowNewVideoDialog(true);
    }
  };

  // Search handlers for ideas
  const handleImageIdeasSearch = (query: PaginationQueryDto) => {
    setImagePagination((prev) => ({ ...prev, ...query }));
    loadImageIdeas(query);
  };

  const handleVideoIdeasSearch = (query: PaginationQueryDto) => {
    setVideoPagination((prev) => ({ ...prev, ...query }));
    loadVideoIdeas(query);
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-4 md:col-span-2">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold">Influencer Not Found</h2>
          <p className="text-muted-foreground">The requested AI influencer could not be found.</p>
          <Link href="/dashboard" className="inline-block">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = {
    totalImages: influencer.images?.length || 0,
    totalVideos: influencer.videos?.length || 0,
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <InfluencerHeader
        influencer={influencer}
        onEdit={() => setShowEditDialog(true)}
        onImageGenerate={() => setShowImageDialog(true)}
        onVideoGenerate={() => setShowVideoDialog(true)}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Profile & Stats */}
        <ProfileSection influencer={influencer} />

        {/* Right Column - Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="images" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="images" className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4" />
                <span>Images ({stats.totalImages})</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center space-x-2">
                <Video className="h-4 w-4" />
                <span>Videos ({stats.totalVideos})</span>
              </TabsTrigger>
              <TabsTrigger value="image-ideas" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Image Ideas</span>
              </TabsTrigger>
              <TabsTrigger value="video-ideas" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Video Ideas</span>
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Details</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="images" className="space-y-4">
              <GeneratedImagesSection
                influencer={influencer}
                onImageGenerate={() => setShowImageDialog(true)}
                onRefresh={loadInfluencer}
              />
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <GeneratedVideosSection
                influencer={influencer}
                onVideoGenerate={() => setShowVideoDialog(true)}
              />
            </TabsContent>

            <TabsContent value="image-ideas" className="space-y-4">
              <ImageIdeasSection
                influencer={influencer}
                imageIdeas={imageIdeas}
                isLoading={isLoadingImageIdeas}
                pagination={imagePagination}
                onCreateIdea={() => handleCreateIdea('image')}
                onGenerateImage={() => setShowNewImageDialog(true)}
                onEditIdea={(idea) => handleEditIdea(idea, 'image')}
                onDeleteIdea={(ideaId) => handleDeleteIdea(ideaId, 'image')}
                onGenerateFromIdea={(idea) => handleGenerateFromIdea(idea, 'image')}
                onPageChange={(page) => {
                  setImagePagination((prev) => ({ ...prev, page }));
                  loadImageIdeas({ page });
                }}
                onItemsPerPageChange={(limit) => {
                  setImagePagination((prev) => ({ ...prev, limit, page: 1 }));
                  loadImageIdeas({ page: 1, limit });
                }}
                onSearch={handleImageIdeasSearch}
              />
            </TabsContent>

            <TabsContent value="video-ideas" className="space-y-4">
              <VideoIdeasSection
                influencer={influencer}
                videoIdeas={videoIdeas}
                isLoading={isLoadingVideoIdeas}
                pagination={videoPagination}
                onCreateIdea={() => handleCreateIdea('video')}
                onGenerateVideo={() => setShowNewVideoDialog(true)}
                onEditIdea={(idea) => handleEditIdea(idea, 'video')}
                onDeleteIdea={(ideaId) => handleDeleteIdea(ideaId, 'video')}
                onGenerateFromIdea={(idea) => handleGenerateFromIdea(idea, 'video')}
                onPageChange={(page) => {
                  setVideoPagination((prev) => ({ ...prev, page }));
                  loadVideoIdeas({ page });
                }}
                onItemsPerPageChange={(limit) => {
                  setVideoPagination((prev) => ({ ...prev, limit, page: 1 }));
                  loadVideoIdeas({ page: 1, limit });
                }}
                onSearch={handleVideoIdeasSearch}
              />
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <DetailsSection influencer={influencer} />
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

      {/* New Idea Management Dialog */}
      {showIdeaDialog && (
        <IdeaManagementDialog
          influencer={influencer}
          open={showIdeaDialog}
          onClose={() => {
            setShowIdeaDialog(false);
            setEditingImageIdea(null);
            setEditingVideoIdea(null);
          }}
          onIdeaCreated={handleIdeaCreated}
          initialTab={ideaDialogTab}
          editingImageIdea={editingImageIdea || undefined}
          editingVideoIdea={editingVideoIdea || undefined}
        />
      )}

      {/* New Image Generation Dialog */}
      {showNewImageDialog && (
        <NewImageGenerationDialog
          influencer={influencer}
          open={showNewImageDialog}
          onClose={() => setShowNewImageDialog(false)}
          onImageGenerated={handleImageGenerated}
          onCreateIdea={() => {
            setShowNewImageDialog(false);
            handleCreateIdea('image');
          }}
        />
      )}

      {/* New Video Generation Dialog */}
      {showNewVideoDialog && (
        <NewVideoGenerationDialog
          influencer={influencer}
          open={showNewVideoDialog}
          onClose={() => setShowNewVideoDialog(false)}
          onVideoGenerated={handleVideoGenerated}
          onCreateIdea={() => {
            setShowNewVideoDialog(false);
            handleCreateIdea('video');
          }}
        />
      )}
    </div>
  );
}
