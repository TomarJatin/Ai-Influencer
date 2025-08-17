'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AIInfluencer, UpdateAIInfluencerDto } from '@/types';
import { InfluencerService } from '@/services';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';

interface EditInfluencerDialogProps {
  influencer: AIInfluencer;
  open: boolean;
  onClose: () => void;
  onInfluencerUpdated: () => void;
}

const updateInfluencerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
  age: z.number().min(18, 'Age must be at least 18').max(50, 'Age must be at most 50').optional(),
  personalityArchetype: z.string().optional(),
  styleAesthetic: z.string().optional(),
});

type FormData = z.infer<typeof updateInfluencerSchema>;

export function EditInfluencerDialog({ influencer, open, onClose, onInfluencerUpdated }: EditInfluencerDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(updateInfluencerSchema),
    defaultValues: {
      name: influencer.name,
      description: influencer.description || '',
      age: influencer.age || undefined,
      personalityArchetype: influencer.personalityArchetype || '',
      styleAesthetic: influencer.styleAesthetic || '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setIsUpdating(true);
      const response = await InfluencerService.updateInfluencer(influencer.id, data as UpdateAIInfluencerDto);
      
      if (response.data) {
        toast.success('Influencer updated successfully!');
        onInfluencerUpdated();
        onClose();
      } else {
        toast.error(response.error?.message || 'Failed to update influencer');
      }
    } catch (error) {
      console.error('Error updating influencer:', error);
      toast.error('Failed to update influencer');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    if (!isUpdating) {
      onClose();
      form.reset();
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {influencer.name}</DialogTitle>
            <DialogDescription>
              Update the details of your AI influencer
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter influencer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your influencer's personality and style"
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="18" 
                            max="50"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="personalityArchetype"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personality</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Confident, Playful" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isUpdating}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}