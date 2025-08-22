'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Image as ImageIcon, Video } from 'lucide-react';
import Link from 'next/link';
import { AIInfluencer } from '@/types';

interface InfluencerHeaderProps {
  influencer: AIInfluencer;
  onEdit: () => void;
  onImageGenerate: () => void;
  onVideoGenerate: () => void;
}

export function InfluencerHeader({ 
  influencer, 
  onEdit, 
  onImageGenerate, 
  onVideoGenerate 
}: InfluencerHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight">{influencer.name}</h1>
            {influencer.isDefault && (
              <Badge variant="secondary">Default Template</Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {influencer.description || 'No description provided'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button onClick={onImageGenerate}>
          <ImageIcon className="mr-2 h-4 w-4" />
          Generate Image
        </Button>
        <Button onClick={onVideoGenerate}>
          <Video className="mr-2 h-4 w-4" />
          Generate Video
        </Button>
      </div>
    </div>
  );
}
