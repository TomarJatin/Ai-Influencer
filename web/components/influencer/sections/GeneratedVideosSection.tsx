'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Video, Play, Download } from 'lucide-react';
import Image from 'next/image';
import { AIInfluencer } from '@/types';

interface GeneratedVideosSectionProps {
  influencer: AIInfluencer;
  onVideoGenerate: () => void;
}

export function GeneratedVideosSection({ 
  influencer, 
  onVideoGenerate 
}: GeneratedVideosSectionProps) {
  const stats = {
    totalVideos: influencer.videos?.length || 0,
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'default';
      case 'GENERATING':
        return 'secondary';
      case 'FAILED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Generated Videos ({stats.totalVideos})</h3>
        <Button onClick={onVideoGenerate}>
          <Plus className="mr-2 h-4 w-4" />
          Generate New Video
        </Button>
      </div>

      {influencer.videos && influencer.videos.length > 0 ? (
        <div className="space-y-4">
          {influencer.videos.map((video) => (
            <Card key={video.id} className="group transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Video Thumbnail */}
                  <div className="relative h-20 w-32 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                    {video.thumbnailUrl ? (
                      <Image 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Video className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-black/50 p-2">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <h4 className="truncate font-medium">{video.title}</h4>
                      <p className="truncate text-sm text-muted-foreground">
                        {video.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusVariant(video.status)}>
                        {video.status}
                      </Badge>
                      {video.duration && (
                        <span className="text-xs text-muted-foreground">
                          {video.duration}s
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {video.status === 'COMPLETED' && video.videoUrl && (
                      <Button size="sm" variant="outline">
                        <Play className="mr-2 h-3 w-3" />
                        Play
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost"
                      disabled={video.status !== 'COMPLETED'}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="rounded-full bg-muted p-4">
              <Video className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2 text-center">
              <h4 className="font-medium">No Videos Generated</h4>
              <p className="text-sm text-muted-foreground max-w-md">
                Create engaging video content with your AI influencer. Videos can showcase 
                their personality and create dynamic content.
              </p>
            </div>
            <Button onClick={onVideoGenerate}>
              <Plus className="mr-2 h-4 w-4" />
              Generate First Video
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
