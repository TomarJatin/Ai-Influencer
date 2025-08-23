'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Image as ImageIcon, Loader2, Search, Filter } from 'lucide-react';
import { AIInfluencer } from '@/types';
import { IdeaCard } from '../IdeaCard';
import { IdeaPagination } from '../IdeaPagination';
import { ImageIdea, VideoIdea, PaginationQueryDto } from '@/services';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface ImageIdeasSectionProps {
  influencer: AIInfluencer;
  imageIdeas: ImageIdea[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onCreateIdea: () => void;
  onGenerateImage: () => void;
  onEditIdea: (idea: ImageIdea | VideoIdea) => void;
  onDeleteIdea: (ideaId: string) => void;
  onGenerateFromIdea: (idea: ImageIdea | VideoIdea) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
  onSearch: (query: PaginationQueryDto) => void;
}

export function ImageIdeasSection({
  influencer,
  imageIdeas,
  isLoading,
  pagination,
  onCreateIdea,
  onGenerateImage,
  onEditIdea,
  onDeleteIdea,
  onGenerateFromIdea,
  onPageChange,
  onItemsPerPageChange,
  onSearch,
}: ImageIdeasSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filterUsed, setFilterUsed] = useState<string>('');

  const handleSearch = () => {
    const query: PaginationQueryDto = {
      page: 1, // Reset to first page when searching
    };

    if (searchQuery.trim()) {
      query.search = searchQuery.trim();
    }
    if (selectedCategory && selectedCategory !== 'all') {
      query.category = selectedCategory;
    }
    if (filterUsed && filterUsed !== 'all') {
      query.isUsed = filterUsed === 'true';
    }

    onSearch(query);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setFilterUsed('');
    onSearch({ page: 1 });
  };

  const categories = Array.from(new Set(imageIdeas.map((idea) => idea.category))).filter(Boolean);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
        <div>
          <h3 className='text-lg font-medium'>Image Ideas</h3>
          <p className='text-muted-foreground text-sm'>Organize and plan your AI influencer&apos;s photo shoots</p>
        </div>
        <div className='flex space-x-2'>
          <Button onClick={onCreateIdea} variant='outline'>
            <Plus className='mr-2 h-4 w-4' />
            Add Idea
          </Button>
          <Button onClick={onGenerateImage}>
            <ImageIcon className='mr-2 h-4 w-4' />
            Generate Image
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className='pb-4'>
          <div className='flex items-center space-x-2'>
            <Search className='text-muted-foreground h-4 w-4' />
            <span className='text-sm font-medium'>Search & Filter</span>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            {/* Search */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-xs font-medium'>Search</label>
              <Input
                placeholder='Search ideas...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Category Filter */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-xs font-medium'>Category</label>
              <Select value={selectedCategory || 'all'} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder='All categories' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Usage Filter */}
            <div className='space-y-2'>
              <label className='text-muted-foreground text-xs font-medium'>Status</label>
              <Select value={filterUsed || 'all'} onValueChange={setFilterUsed}>
                <SelectTrigger>
                  <SelectValue placeholder='All ideas' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All ideas</SelectItem>
                  <SelectItem value='false'>Unused</SelectItem>
                  <SelectItem value='true'>Used</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className='flex items-end space-x-2'>
              <Button onClick={handleSearch} size='sm'>
                <Filter className='mr-2 h-3 w-3' />
                Apply
              </Button>
              <Button onClick={handleClearFilters} variant='outline' size='sm'>
                Clear
              </Button>
            </div>
          </div>

          {/* Active filters display */}
          {(searchQuery ||
            (selectedCategory && selectedCategory !== 'all') ||
            (filterUsed && filterUsed !== 'all')) && (
            <>
              <Separator />
              <div className='flex flex-wrap items-center gap-2'>
                <span className='text-muted-foreground text-xs font-medium'>Active filters:</span>
                {searchQuery && (
                  <Badge variant='secondary' className='text-xs'>
                    Search: {searchQuery}
                  </Badge>
                )}
                {selectedCategory && selectedCategory !== 'all' && (
                  <Badge variant='secondary' className='text-xs'>
                    Category: {selectedCategory}
                  </Badge>
                )}
                {filterUsed && filterUsed !== 'all' && (
                  <Badge variant='secondary' className='text-xs'>
                    Status: {filterUsed === 'true' ? 'Used' : 'Unused'}
                  </Badge>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Content */}
      {isLoading ? (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='mr-2 h-8 w-8 animate-spin' />
          <span>Loading image ideas...</span>
        </div>
      ) : imageIdeas.length > 0 ? (
        <div className='space-y-6'>
          {/* Ideas Grid */}
          <div className='grid gap-4 sm:grid-cols-2'>
            {imageIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                type='image'
                influencerId={influencer.id}
                onEdit={onEditIdea}
                onDelete={onDeleteIdea}
                onGenerate={onGenerateFromIdea}
              />
            ))}
          </div>

          {/* Pagination */}
          <IdeaPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        </div>
      ) : (
        <Card>
          <CardContent className='flex flex-col items-center justify-center space-y-4 py-12'>
            <div className='bg-muted rounded-full p-4'>
              <ImageIcon className='text-muted-foreground h-8 w-8' />
            </div>
            <div className='space-y-2 text-center'>
              <h4 className='font-medium'>
                {searchQuery || (selectedCategory && selectedCategory !== 'all') || (filterUsed && filterUsed !== 'all')
                  ? 'No Ideas Found'
                  : 'No Image Ideas'}
              </h4>
              <p className='text-muted-foreground max-w-md text-sm'>
                {searchQuery || (selectedCategory && selectedCategory !== 'all') || (filterUsed && filterUsed !== 'all')
                  ? 'Try adjusting your search criteria or filters to find more ideas.'
                  : "Create image ideas to organize and plan your AI influencer's photo shoots. Ideas help you generate consistent, themed content."}
              </p>
            </div>
            <div className='flex space-x-2'>
              {searchQuery ||
              (selectedCategory && selectedCategory !== 'all') ||
              (filterUsed && filterUsed !== 'all') ? (
                <Button onClick={handleClearFilters} variant='outline'>
                  Clear Filters
                </Button>
              ) : null}
              <Button onClick={onCreateIdea}>
                <Plus className='mr-2 h-4 w-4' />
                Create First Image Idea
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
