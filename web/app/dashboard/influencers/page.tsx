'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AIInfluencer } from '@/types';
import { InfluencerService } from '@/services';
import { toast } from 'sonner';

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<AIInfluencer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadInfluencers();
  }, []);

  const loadInfluencers = async () => {
    try {
      setIsLoading(true);
      const response = await InfluencerService.getInfluencers();
      if (response.data) {
        setInfluencers(response.data);
      } else {
        toast.error(response.error?.message || 'Failed to load influencers');
      }
    } catch (error) {
      console.error('Error loading influencers:', error);
      toast.error('Failed to load influencers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await InfluencerService.deleteInfluencer(id);
      if (response.data) {
        toast.success(`${name} deleted successfully`);
        loadInfluencers(); // Refresh the list
      } else {
        toast.error(response.error?.message || 'Failed to delete influencer');
      }
    } catch (error) {
      console.error('Error deleting influencer:', error);
      toast.error('Failed to delete influencer');
    } finally {
      setDeletingId(null);
    }
  };

  const getPlaceholderImage = (influencer: AIInfluencer) => {
    return `/api/placeholder/300/300?text=${encodeURIComponent(influencer.name)}`;
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">AI Influencers</h2>
            <p className="text-muted-foreground">
              Manage your AI influencer collection
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading influencers...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Influencers</h2>
          <p className="text-muted-foreground">
            Manage your AI influencer collection
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Influencer
          </Button>
        </Link>
      </div>

      {influencers.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No AI Influencers Yet</CardTitle>
            <CardDescription>
              Create your first AI influencer to get started with content generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Influencer
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {influencers.map((influencer) => (
            <Card key={influencer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                <Image
                  src={getPlaceholderImage(influencer)}
                  alt={influencer.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={influencer.isActive ? 'default' : 'secondary'}>
                    {influencer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1">{influencer.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {influencer.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {influencer.personalityArchetype && (
                      <Badge variant="outline" className="text-xs">
                        {String(influencer.personalityArchetype)}
                      </Badge>
                    )}
                    {influencer.styleAesthetic && (
                      <Badge variant="outline" className="text-xs">
                        {String(influencer.styleAesthetic)}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {influencer.age && `${influencer.age} years`}
                      {influencer.height && ` • ${String(influencer.height)}`}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Link href={`/dashboard/influencer/${influencer.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(influencer.id, influencer.name)}
                      disabled={deletingId === influencer.id}
                    >
                      {deletingId === influencer.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
