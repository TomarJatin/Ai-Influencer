'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ImageIdea, VideoIdea, InfluencerService } from '@/services';
import { toast } from 'sonner';
import {
  MoreVertical,
  Edit,
  Trash2,
  Wand2,
  Image as ImageIcon,
  Video,
  Clock,
  MapPin,
  Palette,
  Eye,
  Calendar,
} from 'lucide-react';

interface IdeaCardProps {
  idea: ImageIdea | VideoIdea;
  type: 'image' | 'video';
  influencerId: string;
  onEdit: (idea: ImageIdea | VideoIdea) => void;
  onDelete: (ideaId: string) => void;
  onGenerate: (idea: ImageIdea | VideoIdea) => void;
}

export function IdeaCard({ idea, type, influencerId, onEdit, onDelete, onGenerate }: IdeaCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      
      const response = type === 'image' 
        ? await InfluencerService.deleteImageIdea(influencerId, idea.id)
        : await InfluencerService.deleteVideoIdea(influencerId, idea.id);

      if (response.error) {
        toast.error(response.error.message || 'Failed to delete idea');
      } else {
        toast.success('Idea deleted successfully');
        onDelete(idea.id);
      }
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast.error('Failed to delete idea');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Portrait: 'bg-blue-100 text-blue-800',
      Lifestyle: 'bg-green-100 text-green-800',
      Fashion: 'bg-purple-100 text-purple-800',
      Beauty: 'bg-pink-100 text-pink-800',
      Fitness: 'bg-orange-100 text-orange-800',
      Travel: 'bg-cyan-100 text-cyan-800',
      Tutorial: 'bg-yellow-100 text-yellow-800',
      Dance: 'bg-red-100 text-red-800',
      Comedy: 'bg-indigo-100 text-indigo-800',
      Custom: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const isImageIdea = (idea: ImageIdea | VideoIdea): idea is ImageIdea => {
    return 'visualElements' in idea;
  };

  const isVideoIdea = (idea: ImageIdea | VideoIdea): idea is VideoIdea => {
    return 'scenario' in idea;
  };

  return (
    <Card className={`group transition-all duration-200 hover:shadow-lg ${idea.isUsed ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {type === 'image' ? (
              <ImageIcon className="h-5 w-5 text-blue-500" />
            ) : (
              <Video className="h-5 w-5 text-purple-500" />
            )}
            <Badge className={getCategoryColor(idea.category)} variant="secondary">
              {idea.category}
            </Badge>
            {idea.isUsed && (
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Eye className="mr-1 h-3 w-3" />
                Used
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(idea)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onGenerate(idea)} className="text-primary">
                <Wand2 className="mr-2 h-4 w-4" />
                Generate {type === 'image' ? 'Image' : 'Video'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-lg leading-tight">{idea.title}</CardTitle>
        <CardDescription className="line-clamp-2">{idea.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Idea-specific details */}
          {isImageIdea(idea) && (
            <div className="space-y-2">
              {idea.setting && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{idea.setting}</span>
                </div>
              )}
              {idea.mood && (
                <div className="flex items-center text-sm text-gray-600">
                  <Palette className="mr-2 h-4 w-4" />
                  <span>{idea.mood}</span>
                </div>
              )}
              {idea.visualElements && idea.visualElements.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {idea.visualElements.slice(0, 3).map((element, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {element}
                    </Badge>
                  ))}
                  {idea.visualElements.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{idea.visualElements.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}

          {isVideoIdea(idea) && (
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="mr-2 h-4 w-4" />
                <span>{idea.duration}</span>
              </div>
              {idea.mood && (
                <div className="flex items-center text-sm text-gray-600">
                  <Palette className="mr-2 h-4 w-4" />
                  <span>{idea.mood}</span>
                </div>
              )}
              {idea.keyMoments && idea.keyMoments.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {idea.keyMoments.slice(0, 2).map((moment, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {moment}
                    </Badge>
                  ))}
                  {idea.keyMoments.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{idea.keyMoments.length - 2} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="mr-1 h-3 w-3" />
              <span>{formatDate(idea.createdAt)}</span>
            </div>
            <Button
              size="sm"
              onClick={() => onGenerate(idea)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
