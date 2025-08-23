'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ColorPicker } from '@/components/ui/color-picker';
import { ChevronDown, ChevronUp, Save, Loader2 } from 'lucide-react';
import { AIInfluencer, UpdateAIInfluencerDto } from '@/types';
import { InfluencerService } from '@/services';
import { toast } from 'sonner';
import * as FormOptions from '@/constants/influencerFormOptions';

interface EditInfluencerDialogProps {
  influencer: AIInfluencer;
  open: boolean;
  onClose: () => void;
  onInfluencerUpdated: () => void;
}

const updateInfluencerSchema = z.object({
  // Basic Information
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
  age: z.number().min(18, 'Age must be at least 18').max(50, 'Age must be at most 50').optional(),
  personalityArchetype: z.string().optional(),
  styleAesthetic: z.string().optional(),

  // Facial Features - Face Structure
  faceShape: z.string().optional(),
  jawline: z.string().optional(),
  cheekbones: z.string().optional(),
  forehead: z.string().optional(),
  chin: z.string().optional(),

  // Eyes
  eyeShape: z.string().optional(),
  eyeColor: z.string().optional(),
  eyeSize: z.string().optional(),
  eyebrowShape: z.string().optional(),
  eyebrowColor: z.string().optional(),
  eyelashes: z.string().optional(),

  // Nose
  noseShape: z.string().optional(),
  noseSize: z.string().optional(),
  nostrilShape: z.string().optional(),

  // Lips
  lipShape: z.string().optional(),
  lipSize: z.string().optional(),
  naturalLipColor: z.string().optional(),

  // Skin
  skinTone: z.string().optional(),
  skinTexture: z.string().optional(),
  skinCondition: z.string().optional(),
  complexion: z.string().optional(),

  // Hair
  hairColor: z.string().optional(),
  hairTexture: z.string().optional(),
  hairLength: z.string().optional(),
  hairVolume: z.string().optional(),
  hairStyle: z.string().optional(),

  // Body Characteristics
  height: z.string().optional(),
  weight: z.string().optional(),
  bodyType: z.string().optional(),
  overallBuild: z.string().optional(),
  shoulderWidth: z.string().optional(),
  waist: z.string().optional(),
  hipWidth: z.string().optional(),
  bodyShape: z.string().optional(),
  chestSize: z.string().optional(),
  chestShape: z.string().optional(),

  // Arms and Hands
  armLength: z.string().optional(),
  armMuscleTone: z.string().optional(),
  handSize: z.string().optional(),
  fingerLength: z.string().optional(),
  nailStyle: z.string().optional(),

  // Legs and Feet
  legLength: z.string().optional(),
  thighShape: z.string().optional(),
  calfShape: z.string().optional(),
  footSize: z.string().optional(),
  footShape: z.string().optional(),

  // Ethnicity and Heritage
  primaryEthnicity: z.string().optional(),
  secondaryHeritage: z.string().optional(),
  culturalInfluences: z.string().optional(),

  // Distinctive Features
  uniqueCharacteristics: z.string().optional(),
  signatureFeatures: z.string().optional(),
  asymmetries: z.string().optional(),

  // Style Preferences
  dailyMakeupLook: z.string().optional(),
  signatureColors: z.string().optional(),
  makeupIntensity: z.string().optional(),
  preferredSilhouettes: z.string().optional(),
  colorPalette: z.string().optional(),
  preferredNecklines: z.string().optional(),
  styleIcons: z.string().optional(),
  jewelryStyle: z.string().optional(),
  preferredMetals: z.string().optional(),
  signatureAccessories: z.string().optional(),

  // Poses and Expressions
  signatureSmile: z.string().optional(),
  eyeExpression: z.string().optional(),
  restingFace: z.string().optional(),
  posture: z.string().optional(),
  handPositions: z.string().optional(),
  preferredAngles: z.string().optional(),

  // Voice and Personality
  voiceTone: z.string().optional(),
  speakingStyle: z.string().optional(),
  personalityTraits: z.string().optional(),

  // Technical Specifications
  preferredLighting: z.string().optional(),
  bestAngles: z.string().optional(),
  cameraDistance: z.string().optional(),

  // Consistency Notes
  keyFeatures: z.string().optional(),
  acceptableVariations: z.string().optional(),
  referenceImages: z.string().optional(),
});

type FormData = z.infer<typeof updateInfluencerSchema>;

export function EditInfluencerDialog({ influencer, open, onClose, onInfluencerUpdated }: EditInfluencerDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    faceStructure: false,
    eyes: false,
    nose: false,
    lips: false,
    skin: false,
    hair: false,
    bodyCharacteristics: false,
    armsHands: false,
    legsFeet: false,
    ethnicity: false,
    distinctive: false,
    stylePrefs: false,
    poses: false,
    voice: false,
    technical: false,
    consistency: false,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(updateInfluencerSchema),
    defaultValues: {
      name: influencer.name,
      description: influencer.description || '',
      age: influencer.age || undefined,
      personalityArchetype: influencer.personalityArchetype || '',
      styleAesthetic: influencer.styleAesthetic || '',
      faceShape: influencer.faceShape || '',
      jawline: influencer.jawline || '',
      cheekbones: influencer.cheekbones || '',
      forehead: influencer.forehead || '',
      chin: influencer.chin || '',
      eyeShape: influencer.eyeShape || '',
      eyeColor: influencer.eyeColor || '',
      eyeSize: influencer.eyeSize || '',
      eyebrowShape: influencer.eyebrowShape || '',
      eyebrowColor: influencer.eyebrowColor || '',
      eyelashes: influencer.eyelashes || '',
      noseShape: influencer.noseShape || '',
      noseSize: influencer.noseSize || '',
      nostrilShape: influencer.nostrilShape || '',
      lipShape: influencer.lipShape || '',
      lipSize: influencer.lipSize || '',
      naturalLipColor: influencer.naturalLipColor || '',
      skinTone: influencer.skinTone || '',
      skinTexture: influencer.skinTexture || '',
      skinCondition: influencer.skinCondition || '',
      complexion: influencer.complexion || '',
      hairColor: influencer.hairColor || '',
      hairTexture: influencer.hairTexture || '',
      hairLength: influencer.hairLength || '',
      hairVolume: influencer.hairVolume || '',
      hairStyle: influencer.hairStyle || '',
      height: influencer.height || '',
      weight: influencer.weight || '',
      bodyType: influencer.bodyType || '',
      overallBuild: influencer.overallBuild || '',
      shoulderWidth: influencer.shoulderWidth || '',
      waist: influencer.waist || '',
      hipWidth: influencer.hipWidth || '',
      bodyShape: influencer.bodyShape || '',
      chestSize: influencer.chestSize || '',
      chestShape: influencer.chestShape || '',
      armLength: influencer.armLength || '',
      armMuscleTone: influencer.armMuscleTone || '',
      handSize: influencer.handSize || '',
      fingerLength: influencer.fingerLength || '',
      nailStyle: influencer.nailStyle || '',
      legLength: influencer.legLength || '',
      thighShape: influencer.thighShape || '',
      calfShape: influencer.calfShape || '',
      footSize: influencer.footSize || '',
      footShape: influencer.footShape || '',
      primaryEthnicity: influencer.primaryEthnicity || '',
      secondaryHeritage: influencer.secondaryHeritage || '',
      culturalInfluences: influencer.culturalInfluences || '',
      uniqueCharacteristics: influencer.uniqueCharacteristics || '',
      signatureFeatures: influencer.signatureFeatures || '',
      asymmetries: influencer.asymmetries || '',
      dailyMakeupLook: influencer.dailyMakeupLook || '',
      signatureColors: influencer.signatureColors || '',
      makeupIntensity: influencer.makeupIntensity || '',
      preferredSilhouettes: influencer.preferredSilhouettes || '',
      colorPalette: influencer.colorPalette || '',
      preferredNecklines: influencer.preferredNecklines || '',
      styleIcons: influencer.styleIcons || '',
      jewelryStyle: influencer.jewelryStyle || '',
      preferredMetals: influencer.preferredMetals || '',
      signatureAccessories: influencer.signatureAccessories || '',
      signatureSmile: influencer.signatureSmile || '',
      eyeExpression: influencer.eyeExpression || '',
      restingFace: influencer.restingFace || '',
      posture: influencer.posture || '',
      handPositions: influencer.handPositions || '',
      preferredAngles: influencer.preferredAngles || '',
      voiceTone: influencer.voiceTone || '',
      speakingStyle: influencer.speakingStyle || '',
      personalityTraits: influencer.personalityTraits || '',
      preferredLighting: influencer.preferredLighting || '',
      bestAngles: influencer.bestAngles || '',
      cameraDistance: influencer.cameraDistance || '',
      keyFeatures: influencer.keyFeatures || '',
      acceptableVariations: influencer.acceptableVariations || '',
      referenceImages: influencer.referenceImages || '',
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setIsUpdating(true);
      console.log('Submitting form data:', data);

      const response = await InfluencerService.updateInfluencer(influencer.id, data as UpdateAIInfluencerDto);

      if (response.data) {
        toast.success('Influencer updated successfully!');
        console.log('Updated influencer data:', response.data);
        await onInfluencerUpdated();
        // Don't reset form here, it will be handled by handleOpenChange
        onClose();
      } else {
        console.error('Update failed with error:', response.error);
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
      form.reset();
      onClose();
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const CollapsibleSection = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <Collapsible open={openSections[id]} onOpenChange={() => toggleSection(id)}>
      <CollapsibleTrigger asChild>
        <Button variant='ghost' className='h-auto w-full justify-between p-4'>
          <h4 className='text-sm font-medium'>{title}</h4>
          {openSections[id] ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className='space-y-4 p-4 pt-0'>{children}</CollapsibleContent>
    </Collapsible>
  );

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isUpdating) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-5xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit {influencer.name}</DialogTitle>
          <DialogDescription>Update the details of your AI influencer</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='basic'>Basic Info</TabsTrigger>
                <TabsTrigger value='physical'>Physical Features</TabsTrigger>
                <TabsTrigger value='style'>Style & Personality</TabsTrigger>
              </TabsList>

              <TabsContent value='basic' className='space-y-6'>
                {/* Basic Information */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-medium'>Basic Information</h3>

                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter influencer name' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your influencer's personality and style"
                            className='min-h-[80px]'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description that captures the essence of your influencer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='age'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              min='18'
                              max='50'
                              placeholder='25'
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
                      name='personalityArchetype'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personality</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select personality' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {FormOptions.PERSONALITY_ARCHETYPES.map((personality) => (
                                <SelectItem key={personality} value={personality}>
                                  {personality}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='styleAesthetic'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Style Aesthetic</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select style' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {FormOptions.STYLE_AESTHETICS.map((style) => (
                                <SelectItem key={style} value={style}>
                                  {style}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Ethnicity and Heritage */}
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='primaryEthnicity'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Ethnicity</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select ethnicity' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {FormOptions.ETHNICITIES.map((ethnicity) => (
                                <SelectItem key={ethnicity} value={ethnicity}>
                                  {ethnicity}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='secondaryHeritage'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Heritage</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select secondary heritage' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {FormOptions.ETHNICITIES.map((ethnicity) => (
                                <SelectItem key={ethnicity} value={ethnicity}>
                                  {ethnicity}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='physical' className='space-y-6'>
                <div className='space-y-4'>
                  <h3 className='text-lg font-medium'>Physical Features</h3>

                  {/* Face Structure */}
                  <CollapsibleSection id='faceStructure' title='Face Structure'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                      <FormField
                        control={form.control}
                        name='faceShape'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Face Shape</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select face shape' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.FACE_SHAPES.map((shape) => (
                                  <SelectItem key={shape} value={shape}>
                                    {shape}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='jawline'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jawline</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select jawline type' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.JAWLINE_TYPES.map((jawline) => (
                                  <SelectItem key={jawline} value={jawline}>
                                    {jawline}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='cheekbones'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cheekbones</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select cheekbone type' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.CHEEKBONE_TYPES.map((cheekbone) => (
                                  <SelectItem key={cheekbone} value={cheekbone}>
                                    {cheekbone}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='forehead'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Forehead</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select forehead type' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.FOREHEAD_TYPES.map((forehead) => (
                                  <SelectItem key={forehead} value={forehead}>
                                    {forehead}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='chin'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chin</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select chin type' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.CHIN_TYPES.map((chin) => (
                                  <SelectItem key={chin} value={chin}>
                                    {chin}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CollapsibleSection>

                  {/* Eyes */}
                  <CollapsibleSection id='eyes' title='Eyes'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                      <FormField
                        control={form.control}
                        name='eyeShape'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Eye Shape</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select eye shape' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.EYE_SHAPES.map((shape) => (
                                  <SelectItem key={shape} value={shape}>
                                    {shape}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='eyeColor'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Eye Color</FormLabel>
                            <FormControl>
                              <ColorPicker
                                value={field.value}
                                onChange={field.onChange}
                                colors={FormOptions.getColorDisplay(FormOptions.EYE_COLORS)}
                                placeholder='Select eye color'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='eyeSize'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Eye Size</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select eye size' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.EYE_SIZES.map((size) => (
                                  <SelectItem key={size} value={size}>
                                    {size}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='eyebrowShape'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Eyebrow Shape</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select eyebrow shape' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.EYEBROW_SHAPES.map((shape) => (
                                  <SelectItem key={shape} value={shape}>
                                    {shape}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='eyebrowColor'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Eyebrow Color</FormLabel>
                            <FormControl>
                              <ColorPicker
                                value={field.value}
                                onChange={field.onChange}
                                colors={FormOptions.getColorDisplay(FormOptions.HAIR_COLORS)}
                                placeholder='Select eyebrow color'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='eyelashes'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Eyelashes</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select eyelash type' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.EYELASH_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CollapsibleSection>

                  {/* Body Characteristics */}
                  <CollapsibleSection id='bodyCharacteristics' title='Body Characteristics'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                      <FormField
                        control={form.control}
                        name='height'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select height' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.HEIGHTS.map((height) => (
                                  <SelectItem key={height} value={height}>
                                    {height}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='weight'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight Range</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select weight range' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.WEIGHT_RANGES.map((weight) => (
                                  <SelectItem key={weight} value={weight}>
                                    {weight}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='bodyType'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Body Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select body type' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.BODY_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='bodyShape'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Body Shape</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select body shape' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.BODY_SHAPES.map((shape) => (
                                  <SelectItem key={shape} value={shape}>
                                    {shape}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CollapsibleSection>

                  {/* Hair */}
                  <CollapsibleSection id='hair' title='Hair'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                      <FormField
                        control={form.control}
                        name='hairColor'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hair Color</FormLabel>
                            <FormControl>
                              <ColorPicker
                                value={field.value}
                                onChange={field.onChange}
                                colors={FormOptions.getColorDisplay(FormOptions.HAIR_COLORS)}
                                placeholder='Select hair color'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='hairTexture'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hair Texture</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select hair texture' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.HAIR_TEXTURES.map((texture) => (
                                  <SelectItem key={texture} value={texture}>
                                    {texture}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='hairLength'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hair Length</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select hair length' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.HAIR_LENGTHS.map((length) => (
                                  <SelectItem key={length} value={length}>
                                    {length}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CollapsibleSection>
                </div>
              </TabsContent>

              <TabsContent value='style' className='space-y-6'>
                <div className='space-y-4'>
                  <h3 className='text-lg font-medium'>Style & Personality</h3>

                  {/* Style Preferences */}
                  <CollapsibleSection id='stylePrefs' title='Style Preferences'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                      <FormField
                        control={form.control}
                        name='dailyMakeupLook'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Daily Makeup Look</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select makeup look' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.MAKEUP_LOOKS.map((look) => (
                                  <SelectItem key={look} value={look}>
                                    {look}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='jewelryStyle'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jewelry Style</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select jewelry style' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.JEWELRY_STYLES.map((style) => (
                                  <SelectItem key={style} value={style}>
                                    {style}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='preferredMetals'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Metals</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select metals' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.PREFERRED_METALS.map((metal) => (
                                  <SelectItem key={metal} value={metal}>
                                    {metal}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CollapsibleSection>

                  {/* Poses and Expressions */}
                  <CollapsibleSection id='poses' title='Poses & Expressions'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                      <FormField
                        control={form.control}
                        name='signatureSmile'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Signature Smile</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select signature smile' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.SIGNATURE_SMILES.map((smile) => (
                                  <SelectItem key={smile} value={smile}>
                                    {smile}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='eyeExpression'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Eye Expression</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select eye expression' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.EYE_EXPRESSIONS.map((expression) => (
                                  <SelectItem key={expression} value={expression}>
                                    {expression}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='posture'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Posture</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select posture' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FormOptions.POSTURES.map((posture) => (
                                  <SelectItem key={posture} value={posture}>
                                    {posture}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CollapsibleSection>

                  {/* Consistency Notes */}
                  <CollapsibleSection id='consistency' title='Consistency Notes'>
                    <div className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='keyFeatures'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key Features</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='e.g., Almond eyes, heart-shaped lips, sleek black hair'
                                className='min-h-[60px]'
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>Most important features that must remain consistent</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='acceptableVariations'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Acceptable Variations</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='e.g., Hair styling, makeup intensity, clothing style'
                                className='min-h-[60px]'
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Features that can slightly vary while maintaining identity
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CollapsibleSection>
                </div>
              </TabsContent>
            </Tabs>

            <div className='flex justify-end space-x-2 pt-4'>
              <Button type='button' variant='outline' onClick={handleClose} disabled={isUpdating}>
                Cancel
              </Button>
              <Button type='submit' disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Update Influencer
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
