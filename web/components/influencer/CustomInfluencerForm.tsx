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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CreateAIInfluencerDto } from '@/types';

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
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const CollapsibleSection = ({ 
    id, 
    title, 
    children 
  }: { 
    id: string; 
    title: string; 
    children: React.ReactNode; 
  }) => (
    <Collapsible open={openSections[id]} onOpenChange={() => toggleSection(id)}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <h4 className="text-sm font-medium">{title}</h4>
          {openSections[id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 p-4 pt-0">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Custom Influencer Details</CardTitle>
          <CardDescription>
            Create your unique AI influencer with detailed characteristics. Fill in as many details as you want - all fields except name are optional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="physical">Physical Features</TabsTrigger>
                  <TabsTrigger value="style">Style & Personality</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
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
                      <FormDescription>
                        A brief description that captures the essence of your influencer
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                placeholder="25"
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select personality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Confident">Confident</SelectItem>
                            <SelectItem value="Playful">Playful</SelectItem>
                            <SelectItem value="Sophisticated">Sophisticated</SelectItem>
                            <SelectItem value="Athletic">Athletic</SelectItem>
                            <SelectItem value="Artistic">Artistic</SelectItem>
                            <SelectItem value="Mysterious">Mysterious</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="styleAesthetic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Style Aesthetic</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Minimalist">Minimalist</SelectItem>
                            <SelectItem value="Glamorous">Glamorous</SelectItem>
                            <SelectItem value="Street Style">Street Style</SelectItem>
                            <SelectItem value="Bohemian">Bohemian</SelectItem>
                            <SelectItem value="Athletic">Athletic</SelectItem>
                            <SelectItem value="Vintage">Vintage</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                    {/* Ethnicity and Heritage */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="primaryEthnicity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Ethnicity</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select ethnicity" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="East Asian">East Asian</SelectItem>
                                <SelectItem value="South Asian">South Asian</SelectItem>
                                <SelectItem value="Southeast Asian">Southeast Asian</SelectItem>
                                <SelectItem value="Northern European">Northern European</SelectItem>
                                <SelectItem value="Southern European">Southern European</SelectItem>
                                <SelectItem value="Eastern European">Eastern European</SelectItem>
                                <SelectItem value="West African">West African</SelectItem>
                                <SelectItem value="East African">East African</SelectItem>
                                <SelectItem value="Latin American">Latin American</SelectItem>
                                <SelectItem value="Middle Eastern">Middle Eastern</SelectItem>
                                <SelectItem value="Mixed Heritage">Mixed Heritage</SelectItem>
                                <SelectItem value="Indigenous">Indigenous</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="secondaryHeritage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secondary Heritage</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., African and European" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="physical" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Physical Features</h3>
                    
                    {/* Face Structure */}
                    <CollapsibleSection id="faceStructure" title="Face Structure">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="faceShape"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Face Shape</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select face shape" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Oval">Oval</SelectItem>
                                  <SelectItem value="Round">Round</SelectItem>
                                  <SelectItem value="Square">Square</SelectItem>
                                  <SelectItem value="Heart">Heart</SelectItem>
                                  <SelectItem value="Diamond">Diamond</SelectItem>
                                  <SelectItem value="Oblong">Oblong</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="jawline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jawline</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Soft and refined" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cheekbones"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cheekbones</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., High and prominent" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="forehead"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Forehead</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Average height" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="chin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chin</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Delicate and pointed" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CollapsibleSection>

                    {/* Eyes */}
                    <CollapsibleSection id="eyes" title="Eyes">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="eyeShape"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Eye Shape</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select eye shape" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Almond">Almond</SelectItem>
                                  <SelectItem value="Round">Round</SelectItem>
                                  <SelectItem value="Hooded">Hooded</SelectItem>
                                  <SelectItem value="Monolid">Monolid</SelectItem>
                                  <SelectItem value="Upturned">Upturned</SelectItem>
                                  <SelectItem value="Downturned">Downturned</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="eyeColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Eye Color</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Deep Brown #2C1810" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="eyeSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Eye Size</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select eye size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Small">Small</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="Large">Large</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="eyebrowShape"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Eyebrow Shape</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Naturally arched" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="eyebrowColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Eyebrow Color</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Dark brown" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="eyelashes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Eyelashes</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Long and curled" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CollapsibleSection>

                    {/* Body Characteristics */}
                    <CollapsibleSection id="bodyCharacteristics" title="Body Characteristics">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 5'6&quot; (168cm)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight Range</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 120-125 lbs (54-57kg)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bodyType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Body Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select body type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Ectomorph">Ectomorph</SelectItem>
                                  <SelectItem value="Mesomorph">Mesomorph</SelectItem>
                                  <SelectItem value="Endomorph">Endomorph</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="overallBuild"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Overall Build</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Slim and elegant" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bodyShape"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Body Shape</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select body shape" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Hourglass">Hourglass</SelectItem>
                                  <SelectItem value="Pear">Pear</SelectItem>
                                  <SelectItem value="Apple">Apple</SelectItem>
                                  <SelectItem value="Rectangle">Rectangle</SelectItem>
                                  <SelectItem value="Inverted Triangle">Inverted Triangle</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CollapsibleSection>

                    {/* Hair */}
                    <CollapsibleSection id="hair" title="Hair">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="hairColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hair Color</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Raven Black with blue undertones" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hairTexture"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hair Texture</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select texture" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Straight">Straight</SelectItem>
                                  <SelectItem value="Wavy">Wavy</SelectItem>
                                  <SelectItem value="Curly">Curly</SelectItem>
                                  <SelectItem value="Coily">Coily</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hairLength"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hair Length</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select length" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Pixie">Pixie</SelectItem>
                                  <SelectItem value="Bob">Bob</SelectItem>
                                  <SelectItem value="Shoulder-length">Shoulder-length</SelectItem>
                                  <SelectItem value="Long">Long</SelectItem>
                                  <SelectItem value="Very Long">Very Long</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CollapsibleSection>

                    {/* Skin */}
                    <CollapsibleSection id="skin" title="Skin">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="skinTone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skin Tone</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Light to medium with golden undertones" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="complexion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complexion</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select complexion" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Matte">Matte</SelectItem>
                                  <SelectItem value="Dewy">Dewy</SelectItem>
                                  <SelectItem value="Natural Glow">Natural Glow</SelectItem>
                                  <SelectItem value="Luminous">Luminous</SelectItem>
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

                <TabsContent value="style" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Style & Personality</h3>
                    
                    {/* Style Preferences */}
                    <CollapsibleSection id="stylePrefs" title="Style Preferences">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="dailyMakeupLook"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Daily Makeup Look</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Natural with subtle enhancement" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="colorPalette"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Color Palette</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Monochromatic neutrals" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="jewelryStyle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jewelry Style</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Minimalist gold pieces" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="preferredMetals"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Metals</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select metals" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Gold">Gold</SelectItem>
                                  <SelectItem value="Silver">Silver</SelectItem>
                                  <SelectItem value="Rose Gold">Rose Gold</SelectItem>
                                  <SelectItem value="Mixed">Mixed</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CollapsibleSection>

                    {/* Poses and Expressions */}
                    <CollapsibleSection id="poses" title="Poses & Expressions">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="signatureSmile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Signature Smile</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Subtle, mysterious smile" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="eyeExpression"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Eye Expression</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Intense and focused gaze" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="posture"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Posture</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Graceful and straight" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="preferredAngles"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Angles</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Three-quarter view, profile shots" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CollapsibleSection>

                    {/* Technical Specifications */}
                    <CollapsibleSection id="technical" title="Technical Specifications">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="preferredLighting"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Lighting</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Soft natural light" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cameraDistance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Camera Distance</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Medium to close-up for portraits" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CollapsibleSection>

                    {/* Consistency Notes */}
                    <CollapsibleSection id="consistency" title="Consistency Notes">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="keyFeatures"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Key Features</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="e.g., Almond eyes, heart-shaped lips, sleek black hair"
                                  className="min-h-[60px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Most important features that must remain consistent
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="acceptableVariations"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Acceptable Variations</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="e.g., Hair styling, makeup intensity, clothing style"
                                  className="min-h-[60px]"
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

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Reset Form
                </Button>
                <Button type="submit" disabled={isSubmitting}>
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