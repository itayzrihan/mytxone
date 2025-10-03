"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { QuoteItemBuilder } from './quote-item-builder';

interface QuoteItem {
  id?: string;
  title: string;
  description: string;
  isRequired: boolean;
  itemType: 'fixed' | 'range' | 'parameter' | 'option_group';
  fixedPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  parameterType?: string;
  parameterUnit?: string;
  parameterPricingMode?: 'fixed' | 'range';
  pricePerUnit?: number;
  minPricePerUnit?: number;
  maxPricePerUnit?: number;
  minUnits?: number;
  maxUnits?: number;
  options: QuoteOption[];
}

interface QuoteOption {
  id?: string;
  title: string;
  description: string;
  pricingType: 'fixed' | 'range';
  fixedPrice?: number;
  minPrice?: number;
  maxPrice?: number;
}

interface CreateQuoteTemplateProps {
  userId: string;
  onBack: () => void;
  editingTemplate?: {
    id: string;
    title: string;
    description: string | null;
    businessType: string;
    isActive: boolean;
    allowGuestSubmissions: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

const businessTypes = [
  'digital', 'installation', 'consulting', 'design', 'development', 
  'marketing', 'construction', 'repair', 'maintenance', 'custom'
];

export function CreateQuoteTemplate({ userId, onBack, editingTemplate }: CreateQuoteTemplateProps) {
  const [template, setTemplate] = useState({
    title: editingTemplate?.title || '',
    description: editingTemplate?.description || '',
    businessType: editingTemplate?.businessType || '',
    allowGuestSubmissions: editingTemplate?.allowGuestSubmissions ?? true,
  });
  
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!editingTemplate);

  // Load existing items when editing
  useEffect(() => {
    if (editingTemplate) {
      loadTemplateItems(editingTemplate.id);
    }
  }, [editingTemplate]);

  const loadTemplateItems = async (templateId: string) => {
    try {
      const response = await fetch(`/api/quotes/templates/${templateId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.items) {
          // Ensure all items and options have required fields with defaults
          const itemsWithDefaults = data.items.map((item: any) => ({
            ...item,
            parameterPricingMode: item.parameterPricingMode || 'fixed',
            options: item.options?.map((option: any) => ({
              ...option,
              pricingType: option.pricingType || 'fixed',
            })) || [],
          }));
          setItems(itemsWithDefaults);
        }
      }
    } catch (error) {
      console.error('Error loading template items:', error);
      toast.error('Failed to load template items');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    const newItem: QuoteItem = {
      title: '',
      description: '',
      isRequired: false,
      itemType: 'fixed',
      options: [],
    };
    setItems([...items, newItem]);
  };

  const updateItem = (index: number, updatedItem: QuoteItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!template.title || !template.businessType) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (items.length === 0) {
      toast.error('Please add at least one item to your quote template');
      return;
    }

    setSaving(true);
    
    try {
      const isEditing = !!editingTemplate;
      const url = isEditing 
        ? `/api/quotes/templates/${editingTemplate.id}` 
        : '/api/quotes/templates';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...template,
          items,
        }),
      });

      if (response.ok) {
        toast.success(isEditing ? 'Quote template updated successfully!' : 'Quote template created successfully!');
        onBack();
      } else {
        const error = await response.text();
        toast.error(error || `Failed to ${isEditing ? 'update' : 'create'} quote template`);
      }
    } catch (error) {
      console.error(`Error ${editingTemplate ? 'updating' : 'creating'} template:`, error);
      toast.error(`Failed to ${editingTemplate ? 'update' : 'create'} quote template`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {editingTemplate ? 'Edit Quote Template' : 'Create Quote Template'}
          </h1>
          <p className="text-zinc-300">Build a dynamic quote form for your business</p>
        </div>
      </div>

      {/* Template Settings */}
      <Card className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Template Settings
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Configure your quote template basic information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Template Title *</Label>
              <Input
                id="title"
                value={template.title}
                onChange={(e) => setTemplate({ ...template, title: e.target.value })}
                placeholder="e.g., Website Development Quote"
                className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessType" className="text-white">Business Type *</Label>
              <Select
                value={template.businessType}
                onValueChange={(value) => setTemplate({ ...template, businessType: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-md border-white/20">
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-white hover:bg-white/10">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={template.description}
              onChange={(e) => setTemplate({ ...template, description: e.target.value })}
              placeholder="Briefly describe what this quote template is for..."
              className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="allowGuests"
              checked={template.allowGuestSubmissions}
              onCheckedChange={(checked) => 
                setTemplate({ ...template, allowGuestSubmissions: checked })
              }
            />
            <Label htmlFor="allowGuests" className="text-white">
              Allow guest submissions (customers don&apos;t need to register)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Quote Items */}
      <Card className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Quote Items</CardTitle>
              <CardDescription className="text-zinc-400">
                Add items, services, or products that customers can select
              </CardDescription>
            </div>
            <Button
              onClick={addItem}
              className="bg-cyan-500/20 backdrop-blur-md text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-400 mb-4">No items added yet</p>
              <Button
                onClick={addItem}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Add Your First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="relative">
                  <QuoteItemBuilder
                    item={item}
                    onChange={(updatedItem: QuoteItem) => updateItem(index, updatedItem)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="absolute top-4 right-4 bg-red-500/10 border-red-400/30 text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-cyan-500/20 backdrop-blur-md text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30 hover:border-cyan-400/50 shadow-lg shadow-black/20 transition-all duration-300"
        >
          {saving 
            ? (editingTemplate ? 'Updating...' : 'Creating...') 
            : (editingTemplate ? 'Update Template' : 'Create Template')
          }
        </Button>
      </div>
    </div>
  );
}