'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Download, Trash2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { AIInfluencer } from '@/types';
import { toast } from 'sonner';
import { InfluencerService } from '@/services';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface GeneratedImagesSectionProps {
  influencer: AIInfluencer;
  onImageGenerate: () => void;
  onRefresh: () => void;
}

export function GeneratedImagesSection({ 
  influencer, 
  onImageGenerate, 
  onRefresh 
}: GeneratedImagesSectionProps) {
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const stats = {
    totalImages: influencer.images?.length || 0,
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      setDeletingImageId(imageId);
      const response = await InfluencerService.deleteImage(influencer.id, imageId);
      
      if (response.error) {
        toast.error(response.error.message || 'Failed to delete image');
      } else {
        toast.success('Image deleted successfully');
        onRefresh(); // Refresh the influencer data
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } finally {
      setDeletingImageId(null);
      setImageToDelete(null);
    }
  };

  const handleDownloadImage = async (imageUrl: string, imageName?: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageName || `influencer-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const handleViewImage = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Generated Images ({stats.totalImages})</h3>
        </div>

        {influencer.images && influencer.images.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {influencer.images.map((image) => (
              <Card key={image.id} className="group overflow-hidden transition-all hover:shadow-md">
                <div className="relative h-48 bg-muted overflow-hidden">
                  <Image 
                    src={image.imageUrl} 
                    alt="Generated image" 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105" 
                  />
                  
                  {/* Overlay badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {image.isReference && (
                      <Badge variant="default" className="text-xs">
                        Reference
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {image.imageType}
                    </Badge>
                  </div>

                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleViewImage(image.imageUrl)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownloadImage(image.imageUrl, `${influencer.name}-${image.imageType}-${image.id}`)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setImageToDelete(image.id)}
                      disabled={deletingImageId === image.id}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </span>
                    {image.prompt && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          if (image.prompt) {
                            navigator.clipboard.writeText(image.prompt);
                            toast.success('Prompt copied to clipboard');
                          } else {
                            toast.error('No prompt available to copy');
                          }
                        }}
                      >
                        Copy prompt
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="rounded-full bg-muted p-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2 text-center">
                <h4 className="font-medium">No Images Generated</h4>
                <p className="text-sm text-muted-foreground max-w-md">
                  Start by generating reference images for your AI influencer. These will help establish their look and style.
                </p>
              </div>
              <Button onClick={onImageGenerate}>
                <Plus className="mr-2 h-4 w-4" />
                Generate First Image
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!imageToDelete} onOpenChange={() => setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Image
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => imageToDelete && handleDeleteImage(imageToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={!!deletingImageId}
            >
              {deletingImageId ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
