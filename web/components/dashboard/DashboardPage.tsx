'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Image as ImageIcon, Video, Settings } from 'lucide-react';
import Link from 'next/link';
import { AIInfluencer } from '@/types';
import { InfluencerService } from '@/services/influencer.service';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [influencers, setInfluencers] = useState<AIInfluencer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      loadInfluencers();
    }
  }, [session?.user?.id]);

  const loadInfluencers = async () => {
    try {
      setIsLoading(true);
      const response = await InfluencerService.getInfluencers();
      if (response.data) {
        setInfluencers(response.data);
      }
    } catch (error) {
      console.error('Error loading influencers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInfluencerImage = (influencer: AIInfluencer) => {
    const portraitImage = influencer.images?.find(
      img => img.imageType === 'PORTRAIT' && img.isReference
    );
    return portraitImage?.imageUrl || '/api/placeholder/400/400';
  };

  const getInfluencerStats = (influencer: AIInfluencer) => {
    const imageCount = influencer.images?.length || 0;
    const videoCount = influencer.videos?.length || 0;
    return { imageCount, videoCount };
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-20 mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalImages = influencers.reduce((sum, inf) => sum + (inf.images?.length || 0), 0);
  const totalVideos = influencers.reduce((sum, inf) => sum + (inf.videos?.length || 0), 0);
  const activeInfluencers = influencers.filter(inf => inf.isActive).length;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Influencer Dashboard</h2>
          <p className="text-muted-foreground">
            Create and manage your AI influencers, generate images and videos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Influencer
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Influencers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{influencers.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeInfluencers} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImages}</div>
            <p className="text-xs text-muted-foreground">
              Across all influencers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVideos}</div>
            <p className="text-xs text-muted-foreground">
              Total video content
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Influencers Grid */}
      {influencers.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No AI Influencers Yet</CardTitle>
            <CardDescription>
              Create your first AI influencer to get started with generating content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Users className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground text-center max-w-sm">
                You haven&apos;t created any AI influencers yet. Start by creating your first influencer from our templates or build one from scratch.
              </p>
              <Link href="/dashboard/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Influencer
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {influencers.map((influencer) => {
            const { imageCount, videoCount } = getInfluencerStats(influencer);
            return (
              <Card key={influencer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={getInfluencerImage(influencer)}
                        alt={influencer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{influencer.name}</CardTitle>
                      <CardDescription className="truncate">
                        {influencer.description || 'No description'}
                      </CardDescription>
                      <div className="flex items-center space-x-2 mt-2">
                        {influencer.isDefault && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                        {influencer.personalityArchetype && (
                          <Badge variant="outline" className="text-xs">
                            {influencer.personalityArchetype}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <ImageIcon className="h-4 w-4" />
                        <span>{imageCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Video className="h-4 w-4" />
                        <span>{videoCount}</span>
                      </div>
                    </div>
                    <Link href={`/dashboard/influencer/${influencer.id}`}>
                      <Button size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
