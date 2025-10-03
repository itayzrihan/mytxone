"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface QuoteOption {
  id?: string;
  title: string;
  description: string;
  fixedPrice?: number;
  minPrice?: number;
  maxPrice?: number;
}

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
  pricePerUnit?: number;
  minUnits?: number;
  maxUnits?: number;
  options: QuoteOption[];
}

interface QuoteItemBuilderProps {
  item: QuoteItem;
  onChange: (item: QuoteItem) => void;
}

const itemTypes = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'range', label: 'Price Range' },
  { value: 'parameter', label: 'Parameter-based' },
  { value: 'option_group', label: 'Option Group' },
];

const parameterTypes = [
  { value: 'video_length', label: 'Video Length (seconds)' },
  { value: 'page_count', label: 'Page Count' },
  { value: 'hours', label: 'Hours' },
  { value: 'square_feet', label: 'Square Feet' },
  { value: 'custom', label: 'Custom Unit' },
];

export function QuoteItemBuilder({ item, onChange }: QuoteItemBuilderProps) {
  const updateItem = (updates: Partial<QuoteItem>) => {
    onChange({ ...item, ...updates });
  };

  const addOption = () => {
    const newOption: QuoteOption = {
      title: '',
      description: '',
    };
    updateItem({ options: [...item.options, newOption] });
  };

  const updateOption = (index: number, updatedOption: QuoteOption) => {
    const newOptions = [...item.options];
    newOptions[index] = updatedOption;
    updateItem({ options: newOptions });
  };

  const removeOption = (index: number) => {
    updateItem({ options: item.options.filter((_, i) => i !== index) });
  };

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-lg">Quote Item Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="itemTitle" className="text-white">Item Title *</Label>
            <Input
              id="itemTitle"
              value={item.title}
              onChange={(e) => updateItem({ title: e.target.value })}
              placeholder="e.g., Website Development"
              className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="itemType" className="text-white">Pricing Type *</Label>
            <Select
              value={item.itemType}
              onValueChange={(value: any) => updateItem({ itemType: value })}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select pricing type" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-md border-white/20">
                {itemTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-white hover:bg-white/10">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="itemDescription" className="text-white">Description</Label>
          <Textarea
            id="itemDescription"
            value={item.description}
            onChange={(e) => updateItem({ description: e.target.value })}
            placeholder="Describe what this item includes..."
            className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
            rows={2}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="isRequired"
            checked={item.isRequired}
            onCheckedChange={(checked) => updateItem({ isRequired: checked })}
          />
          <Label htmlFor="isRequired" className="text-white">
            Required item (customer must select this)
          </Label>
        </div>

        {/* Pricing Configuration */}
        <div className="border-t border-white/10 pt-4">
          {item.itemType === 'fixed' && (
            <div className="space-y-2">
              <Label htmlFor="fixedPrice" className="text-white">Fixed Price *</Label>
              <Input
                id="fixedPrice"
                type="number"
                value={item.fixedPrice || ''}
                onChange={(e) => updateItem({ fixedPrice: parseFloat(e.target.value) || undefined })}
                placeholder="0.00"
                className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
              />
            </div>
          )}

          {item.itemType === 'range' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minPrice" className="text-white">Minimum Price *</Label>
                <Input
                  id="minPrice"
                  type="number"
                  value={item.minPrice || ''}
                  onChange={(e) => updateItem({ minPrice: parseFloat(e.target.value) || undefined })}
                  placeholder="0.00"
                  className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPrice" className="text-white">Maximum Price *</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  value={item.maxPrice || ''}
                  onChange={(e) => updateItem({ maxPrice: parseFloat(e.target.value) || undefined })}
                  placeholder="0.00"
                  className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                />
              </div>
            </div>
          )}

          {item.itemType === 'parameter' && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="parameterType" className="text-white">Parameter Type *</Label>
                  <Select
                    value={item.parameterType}
                    onValueChange={(value) => updateItem({ parameterType: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select parameter type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-md border-white/20">
                      {parameterTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-white hover:bg-white/10">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {item.parameterType === 'custom' && (
                  <div className="space-y-2">
                    <Label htmlFor="parameterUnit" className="text-white">Custom Unit *</Label>
                    <Input
                      id="parameterUnit"
                      value={item.parameterUnit || ''}
                      onChange={(e) => updateItem({ parameterUnit: e.target.value })}
                      placeholder="e.g., items, words, etc."
                      className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="pricePerUnit" className="text-white">Price per Unit *</Label>
                  <Input
                    id="pricePerUnit"
                    type="number"
                    step="0.01"
                    value={item.pricePerUnit || ''}
                    onChange={(e) => updateItem({ pricePerUnit: parseFloat(e.target.value) || undefined })}
                    placeholder="0.00"
                    className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minUnits" className="text-white">Minimum Units</Label>
                  <Input
                    id="minUnits"
                    type="number"
                    value={item.minUnits || ''}
                    onChange={(e) => updateItem({ minUnits: parseInt(e.target.value) || undefined })}
                    placeholder="1"
                    className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUnits" className="text-white">Maximum Units</Label>
                  <Input
                    id="maxUnits"
                    type="number"
                    value={item.maxUnits || ''}
                    onChange={(e) => updateItem({ maxUnits: parseInt(e.target.value) || undefined })}
                    placeholder="100"
                    className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Options for Option Group */}
        {item.itemType === 'option_group' && (
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-white text-lg">Options</Label>
              <Button
                onClick={addOption}
                size="sm"
                className="bg-cyan-500/20 backdrop-blur-md text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Option
              </Button>
            </div>
            
            {item.options.length === 0 ? (
              <p className="text-zinc-400 text-center py-4">No options added yet</p>
            ) : (
              <div className="space-y-3">
                {item.options.map((option, index) => (
                  <Card key={index} className="bg-white/5 border border-white/10">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="grid gap-3 md:grid-cols-2">
                            <Input
                              value={option.title}
                              onChange={(e) => updateOption(index, { ...option, title: e.target.value })}
                              placeholder="Option title"
                              className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                            />
                            <Input
                              value={option.description}
                              onChange={(e) => updateOption(index, { ...option, description: e.target.value })}
                              placeholder="Option description"
                              className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                            />
                          </div>
                          
                          <div className="grid gap-3 md:grid-cols-3">
                            <Input
                              type="number"
                              step="0.01"
                              value={option.fixedPrice || ''}
                              onChange={(e) => updateOption(index, { 
                                ...option, 
                                fixedPrice: parseFloat(e.target.value) || undefined 
                              })}
                              placeholder="Fixed price"
                              className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                            />
                            <Input
                              type="number"
                              step="0.01"
                              value={option.minPrice || ''}
                              onChange={(e) => updateOption(index, { 
                                ...option, 
                                minPrice: parseFloat(e.target.value) || undefined 
                              })}
                              placeholder="Min price"
                              className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                            />
                            <Input
                              type="number"
                              step="0.01"
                              value={option.maxPrice || ''}
                              onChange={(e) => updateOption(index, { 
                                ...option, 
                                maxPrice: parseFloat(e.target.value) || undefined 
                              })}
                              placeholder="Max price"
                              className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                            />
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="bg-red-500/10 border-red-400/30 text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}