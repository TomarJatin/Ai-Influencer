'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateAIInfluencerDto } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as FormOptions from '../../constants/influencerFormOptions';
import { ColorPicker } from '../ui/color-picker';


const createInfluencerSchema = z.object({
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

type FormData = z.infer<typeof createInfluencerSchema>;

interface CustomInfluencerFormProps {
  onSubmit: (data: CreateAIInfluencerDto) => void;
  isSubmitting: boolean;
}

export function CustomInfluencerForm({ onSubmit, isSubmitting }: CustomInfluencerFormProps) {
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
    resolver: zodResolver(createInfluencerSchema),
    defaultValues: {
      name: '',
      description: '',
      age: 25,
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data as CreateAIInfluencerDto);
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

  return (
    <div className='mx-auto w-full max-w-4xl'>
      <Card>
        <CardHeader>
          <CardTitle>Custom Influencer Details</CardTitle>
          <CardDescription>
            Create your unique AI influencer with detailed characteristics. Fill in as many details as you want - all
            fields except name are optional.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                    {/* Nose */}
                    <CollapsibleSection id='nose' title='Nose'>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <FormField
                          control={form.control}
                          name='noseShape'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nose Shape</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select nose shape' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.NOSE_SHAPES.map((shape) => (
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
                          name='noseSize'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nose Size</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select nose size' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.NOSE_SIZES.map((size) => (
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
                          name='nostrilShape'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nostril Shape</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select nostril shape' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.NOSTRIL_SHAPES.map((shape) => (
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

                    {/* Lips */}
                    <CollapsibleSection id='lips' title='Lips'>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <FormField
                          control={form.control}
                          name='lipShape'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lip Shape</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select lip shape' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.LIP_SHAPES.map((shape) => (
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
                          name='lipSize'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lip Size</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select lip size' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.LIP_SIZES.map((size) => (
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
                          name='naturalLipColor'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Natural Lip Color</FormLabel>
                              <FormControl>
                                <ColorPicker
                                  value={field.value}
                                  onChange={field.onChange}
                                  colors={FormOptions.getColorDisplay(FormOptions.LIP_COLORS)}
                                  placeholder='Select lip color'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CollapsibleSection>

                    {/* Skin */}
                    <CollapsibleSection id='skin' title='Skin'>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                        <FormField
                          control={form.control}
                          name='skinTone'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skin Tone</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select skin tone' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.SKIN_TONES.map((tone) => (
                                    <SelectItem key={tone} value={tone}>
                                      {tone}
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
                          name='skinTexture'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skin Texture</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select skin texture' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.SKIN_TEXTURES.map((texture) => (
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
                          name='skinCondition'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skin Condition</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select skin condition' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.SKIN_CONDITIONS.map((condition) => (
                                    <SelectItem key={condition} value={condition}>
                                      {condition}
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
                          name='complexion'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complexion</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select complexion' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.COMPLEXIONS.map((complexion) => (
                                    <SelectItem key={complexion} value={complexion}>
                                      {complexion}
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                        <FormField
                          control={form.control}
                          name='hairVolume'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hair Volume</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select hair volume' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.HAIR_VOLUMES.map((volume) => (
                                    <SelectItem key={volume} value={volume}>
                                      {volume}
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
                          name='hairStyle'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hair Style</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select hair style' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.HAIR_STYLES.map((style) => (
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          name='overallBuild'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Overall Build</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select overall build' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.OVERALL_BUILDS.map((build) => (
                                    <SelectItem key={build} value={build}>
                                      {build}
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
                          name='shoulderWidth'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Shoulder Width</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select shoulder width' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.SHOULDER_WIDTHS.map((width) => (
                                    <SelectItem key={width} value={width}>
                                      {width}
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
                          name='waist'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Waist</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select waist type' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.WAIST_TYPES.map((waist) => (
                                    <SelectItem key={waist} value={waist}>
                                      {waist}
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
                          name='hipWidth'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hip Width</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select hip width' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.HIP_WIDTHS.map((width) => (
                                    <SelectItem key={width} value={width}>
                                      {width}
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                        <FormField
                          control={form.control}
                          name='chestSize'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chest Size</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select chest size' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.CHEST_SIZES.map((size) => (
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
                          name='chestShape'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chest Shape</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select chest shape' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.CHEST_SHAPES.map((shape) => (
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

                    {/* Arms and Hands */}
                    <CollapsibleSection id='armsHands' title='Arms & Hands'>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        <FormField
                          control={form.control}
                          name='armLength'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Arm Length</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select arm length' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.ARM_LENGTHS.map((length) => (
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

                        <FormField
                          control={form.control}
                          name='armMuscleTone'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Arm Muscle Tone</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select muscle tone' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.ARM_MUSCLE_TONES.map((tone) => (
                                    <SelectItem key={tone} value={tone}>
                                      {tone}
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
                          name='handSize'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hand Size</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select hand size' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.HAND_SIZES.map((size) => (
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
                          name='fingerLength'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Finger Length</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select finger length' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.FINGER_LENGTHS.map((length) => (
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

                        <FormField
                          control={form.control}
                          name='nailStyle'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nail Style</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select nail style' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.NAIL_STYLES.map((style) => (
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
                    </CollapsibleSection>

                    {/* Legs and Feet */}
                    <CollapsibleSection id='legsFeet' title='Legs & Feet'>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        <FormField
                          control={form.control}
                          name='legLength'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Leg Length</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select leg length' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.LEG_LENGTHS.map((length) => (
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

                        <FormField
                          control={form.control}
                          name='thighShape'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thigh Shape</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select thigh shape' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.THIGH_SHAPES.map((shape) => (
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
                          name='calfShape'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Calf Shape</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select calf shape' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.CALF_SHAPES.map((shape) => (
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
                          name='footSize'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Foot Size</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select foot size' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.FOOT_SIZES.map((size) => (
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
                          name='footShape'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Foot Shape</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select foot shape' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.FOOT_SHAPES.map((shape) => (
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
                  </div>
                </TabsContent>

                <TabsContent value='style' className='space-y-6'>
                  <div className='space-y-4'>
                    <h3 className='text-lg font-medium'>Style & Personality</h3>

                    {/* Distinctive Features */}
                    <CollapsibleSection id='distinctive' title='Distinctive Features'>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <FormField
                          control={form.control}
                          name='uniqueCharacteristics'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unique Characteristics</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select unique characteristics' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.UNIQUE_CHARACTERISTICS.map((characteristic) => (
                                    <SelectItem key={characteristic} value={characteristic}>
                                      {characteristic}
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
                          name='signatureFeatures'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Signature Features</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select signature features' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.SIGNATURE_FEATURES.map((feature) => (
                                    <SelectItem key={feature} value={feature}>
                                      {feature}
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
                          name='asymmetries'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Asymmetries</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select asymmetries' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.ASYMMETRIES.map((asymmetry) => (
                                    <SelectItem key={asymmetry} value={asymmetry}>
                                      {asymmetry}
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

                    {/* Style Preferences */}
                    <CollapsibleSection id='stylePrefs' title='Style Preferences'>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        <FormField
                          control={form.control}
                          name='dailyMakeupLook'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Daily Makeup Look</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          name='signatureColors'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Signature Colors</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select signature colors' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.SIGNATURE_COLORS.map((color) => (
                                    <SelectItem key={color} value={color}>
                                      {color}
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
                          name='makeupIntensity'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Makeup Intensity</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select makeup intensity' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.MAKEUP_INTENSITIES.map((intensity) => (
                                    <SelectItem key={intensity} value={intensity}>
                                      {intensity}
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
                          name='preferredSilhouettes'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Silhouettes</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select silhouettes' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.PREFERRED_SILHOUETTES.map((silhouette) => (
                                    <SelectItem key={silhouette} value={silhouette}>
                                      {silhouette}
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
                          name='colorPalette'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Color Palette</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select color palette' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.COLOR_PALETTES.map((palette) => (
                                    <SelectItem key={palette} value={palette}>
                                      {palette}
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
                          name='preferredNecklines'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Necklines</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select necklines' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.PREFERRED_NECKLINES.map((neckline) => (
                                    <SelectItem key={neckline} value={neckline}>
                                      {neckline}
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
                          name='styleIcons'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Style Icons</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select style icons' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.STYLE_ICONS.map((icon) => (
                                    <SelectItem key={icon} value={icon}>
                                      {icon}
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                        <FormField
                          control={form.control}
                          name='signatureAccessories'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Signature Accessories</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select accessories' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.SIGNATURE_ACCESSORIES.map((accessory) => (
                                    <SelectItem key={accessory} value={accessory}>
                                      {accessory}
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          name='restingFace'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Resting Face</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select resting face' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.RESTING_FACES.map((face) => (
                                    <SelectItem key={face} value={face}>
                                      {face}
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                        <FormField
                          control={form.control}
                          name='handPositions'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hand Positions</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select hand positions' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.HAND_POSITIONS.map((position) => (
                                    <SelectItem key={position} value={position}>
                                      {position}
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
                          name='preferredAngles'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Angles</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select preferred angles' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.PREFERRED_ANGLES.map((angle) => (
                                    <SelectItem key={angle} value={angle}>
                                      {angle}
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

                    {/* Voice and Personality */}
                    <CollapsibleSection id='voice' title='Voice & Personality'>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <FormField
                          control={form.control}
                          name='voiceTone'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Voice Tone</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select voice tone' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.VOICE_TONES.map((tone) => (
                                    <SelectItem key={tone} value={tone}>
                                      {tone}
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
                          name='speakingStyle'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Speaking Style</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select speaking style' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.SPEAKING_STYLES.map((style) => (
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
                          name='personalityTraits'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Personality Traits</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select personality traits' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.PERSONALITY_TRAITS.map((trait) => (
                                    <SelectItem key={trait} value={trait}>
                                      {trait}
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

                    {/* Technical Specifications */}
                    <CollapsibleSection id='technical' title='Technical Specifications'>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <FormField
                          control={form.control}
                          name='preferredLighting'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Lighting</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select lighting' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.PREFERRED_LIGHTING.map((lighting) => (
                                    <SelectItem key={lighting} value={lighting}>
                                      {lighting}
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
                          name='bestAngles'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Best Angles</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select best angles' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.BEST_ANGLES.map((angle) => (
                                    <SelectItem key={angle} value={angle}>
                                      {angle}
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
                          name='cameraDistance'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Camera Distance</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select camera distance' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {FormOptions.CAMERA_DISTANCES.map((distance) => (
                                    <SelectItem key={distance} value={distance}>
                                      {distance}
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
                <Button type='button' variant='outline' onClick={() => form.reset()}>
                  Reset Form
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Influencer'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
