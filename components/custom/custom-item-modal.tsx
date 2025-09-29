'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Plus, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import type { GenerateCustomItemRequest, CustomHook, CustomContentType } from '@/lib/video-script-constants';

interface CustomItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<CustomHook> | Partial<CustomContentType>, type: 'hook' | 'contentType') => void;
  type?: 'hook' | 'contentType';
}

const CONTENT_CATEGORIES = [
  "Educational & Instructional",
  "Business & Marketing", 
  "Authority Building",
  "Storytelling & Analogies",
  "Spiritual & Consciousness",
  "Viral & Trending",
  "Advanced Storytelling",
  "Humor & Entertainment",
  "Controversial & Debate",
  "Lifestyle & Personal",
  "Other"
];

export function CustomItemModal({ isOpen, onClose, onSave, type: defaultType = 'hook' }: CustomItemModalProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('ai');
  const [itemType, setItemType] = useState<'hook' | 'contentType'>(defaultType);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // AI Generation fields
  const [aiPrompt, setAiPrompt] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Educational & Instructional');
  
  // Manual input fields
  const [manualData, setManualData] = useState({
    label: '',
    description: '',
    example: '',
    structure: '',
    category: 'Educational & Instructional'
  });

  // Generated/Preview data
  const [generatedData, setGeneratedData] = useState<{
    value: string;
    label: string;
    description: string;
    example: string;
    structure: string;
    category?: string;
  } | null>(null);

  const resetForm = () => {
    setAiPrompt('');
    setManualData({
      label: '',
      description: '',
      example: '',
      structure: '',
      category: 'Educational & Instructional'
    });
    setGeneratedData(null);
    setActiveTab('ai');
    setIsPublic(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt to generate your custom item');
      return;
    }

    setIsGenerating(true);
    
    try {
      const request: GenerateCustomItemRequest = {
        type: itemType,
        prompt: aiPrompt,
        isPublic,
        ...(itemType === 'contentType' && { category: selectedCategory })
      };

      const response = await fetch('/api/generate-custom-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      const result = await response.json();

      if (result.success && result.data) {
        setGeneratedData(result.data);
        toast.success(`${itemType === 'hook' ? 'Hook' : 'Content Type'} generated successfully!`);
      } else {
        toast.error(result.error || 'Failed to generate custom item');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate custom item. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    let dataToSave;
    
    if (activeTab === 'ai' && generatedData) {
      dataToSave = {
        ...generatedData,
        isPublic
      };
    } else if (activeTab === 'manual') {
      if (!manualData.label || !manualData.description || !manualData.example || !manualData.structure) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      dataToSave = {
        ...manualData,
        value: manualData.label.toLowerCase().replace(/\s+/g, '-'),
        isPublic
      };
    } else {
      toast.error('No data to save');
      return;
    }

    try {
      // Save to database via API
      const endpoint = itemType === 'hook' ? '/api/custom-hooks' : '/api/custom-content-types';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });

      const result = await response.json();

      if (response.ok) {
        const savedItem = itemType === 'hook' ? result.customHook : result.customContentType;
        onSave(savedItem, itemType);
        toast.success(`Custom ${itemType === 'hook' ? 'hook' : 'content type'} saved successfully!`);
        handleClose();
      } else {
        toast.error(result.error || 'Failed to save custom item');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save custom item. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Custom {itemType === 'hook' ? 'Hook' : 'Content Type'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Type Selection */}
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Label>Type:</Label>
              <Select value={itemType} onValueChange={(value: 'hook' | 'contentType') => setItemType(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hook">Custom Hook</SelectItem>
                  <SelectItem value="contentType">Custom Content Type</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Label>Visibility:</Label>
              <div className="flex items-center gap-2">
                {isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <Switch
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <span className="text-sm text-muted-foreground">
                  {isPublic ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
          </div>

          {/* Creation Method Tabs */}
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'manual' | 'ai')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Generated
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Manual Input
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate with AI
                  </CardTitle>
                  <CardDescription>
                    Describe what you want and AI will create a complete {itemType === 'hook' ? 'hook' : 'content type'} with all fields filled in.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {itemType === 'contentType' && (
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTENT_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="ai-prompt">
                      Describe your {itemType === 'hook' ? 'hook' : 'content type'}
                    </Label>
                    <Textarea
                      id="ai-prompt"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder={itemType === 'hook' 
                        ? "Example: Create a hook that starts with 'What if I told you' and is designed for revealing surprising truths about common beliefs..."
                        : "Example: Create a content type for social media marketing tips that uses step-by-step tutorials with real examples and actionable advice..."
                      }
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={generateWithAI} 
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate {itemType === 'hook' ? 'Hook' : 'Content Type'}
                      </>
                    )}
                  </Button>

                  {/* Generated Preview */}
                  {generatedData && (
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle className="text-lg">Generated {itemType === 'hook' ? 'Hook' : 'Content Type'}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Label:</Label>
                          <p className="text-sm">{generatedData.label}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Description:</Label>
                          <p className="text-sm">{generatedData.description}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Example:</Label>
                          <p className="text-sm italic">{generatedData.example}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Structure:</Label>
                          <p className="text-sm">{generatedData.structure}</p>
                        </div>
                        {generatedData.category && (
                          <div>
                            <Label className="text-sm font-medium">Category:</Label>
                            <p className="text-sm">{generatedData.category}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Manual Input</CardTitle>
                  <CardDescription>
                    Fill in all fields manually to create your custom {itemType === 'hook' ? 'hook' : 'content type'}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="manual-label">Label *</Label>
                    <Input
                      id="manual-label"
                      value={manualData.label}
                      onChange={(e) => setManualData(prev => ({ ...prev, label: e.target.value }))}
                      placeholder={itemType === 'hook' ? "e.g., Shocking Truth Reveal" : "e.g., Social Media Growth Hacks"}
                    />
                  </div>

                  <div>
                    <Label htmlFor="manual-description">Description *</Label>
                    <Textarea
                      id="manual-description"
                      value={manualData.description}
                      onChange={(e) => setManualData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={itemType === 'hook' 
                        ? "Describe when and how to use this hook..."
                        : "Describe what this content type is about and when to use it..."
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="manual-example">Example *</Label>
                    <Input
                      id="manual-example"
                      value={manualData.example}
                      onChange={(e) => setManualData(prev => ({ ...prev, example: e.target.value }))}
                      placeholder={itemType === 'hook' 
                        ? "What if I told you that everything you know about success is wrong?"
                        : "5 Instagram growth strategies that gained me 10K followers in 30 days"
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="manual-structure">Structure *</Label>
                    <Textarea
                      id="manual-structure"
                      value={manualData.structure}
                      onChange={(e) => setManualData(prev => ({ ...prev, structure: e.target.value }))}
                      placeholder="Describe the structure or format for this type of content..."
                      rows={3}
                    />
                  </div>

                  {itemType === 'contentType' && (
                    <div>
                      <Label htmlFor="manual-category">Category</Label>
                      <Select 
                        value={manualData.category} 
                        onValueChange={(value: string) => setManualData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTENT_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={activeTab === 'ai' ? !generatedData : !manualData.label || !manualData.description}
            >
              Save {itemType === 'hook' ? 'Hook' : 'Content Type'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}