"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Calculator, Send, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface QuoteOption {
  id: string;
  title: string;
  description: string | null;
  fixedPrice: string | null;
  minPrice: string | null;
  maxPrice: string | null;
  displayOrder: number;
}

interface QuoteItem {
  id: string;
  title: string;
  description: string | null;
  isRequired: boolean;
  itemType: string;
  fixedPrice: string | null;
  minPrice: string | null;
  maxPrice: string | null;
  parameterType: string | null;
  parameterUnit: string | null;
  pricePerUnit: string | null;
  minUnits: number | null;
  maxUnits: number | null;
  options: QuoteOption[];
}

interface QuoteTemplate {
  id: string;
  title: string;
  description: string | null;
  businessType: string;
  allowGuestSubmissions: boolean;
  items: QuoteItem[];
}

interface QuoteResponseFormProps {
  template: QuoteTemplate;
}

interface SelectedItem {
  itemId: string;
  selected: boolean;
  selectedOptionId?: string;
  parameterValue?: number;
}

export function QuoteResponseForm({ template }: QuoteResponseFormProps) {
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedItem>>({});
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [totalPrice, setTotalPrice] = useState({ min: 0, max: 0 });
  const [submitting, setSubmitting] = useState(false);

  // Initialize selected items with required items
  useEffect(() => {
    const initialSelections: Record<string, SelectedItem> = {};
    template.items.forEach(item => {
      initialSelections[item.id] = {
        itemId: item.id,
        selected: item.isRequired,
        parameterValue: item.minUnits || 1,
      };
    });
    setSelectedItems(initialSelections);
  }, [template]);

  // Calculate total price whenever selections change
  useEffect(() => {
    calculateTotal();
  }, [selectedItems]);

  const calculateTotal = () => {
    let minTotal = 0;
    let maxTotal = 0;

    Object.values(selectedItems).forEach(selection => {
      if (!selection.selected) return;

      const item = template.items.find(i => i.id === selection.itemId);
      if (!item) return;

      if (item.itemType === 'fixed') {
        const price = parseFloat(item.fixedPrice || '0');
        minTotal += price;
        maxTotal += price;
      } else if (item.itemType === 'range') {
        minTotal += parseFloat(item.minPrice || '0');
        maxTotal += parseFloat(item.maxPrice || '0');
      } else if (item.itemType === 'parameter') {
        const pricePerUnit = parseFloat(item.pricePerUnit || '0');
        const units = selection.parameterValue || 1;
        const totalPrice = pricePerUnit * units;
        minTotal += totalPrice;
        maxTotal += totalPrice;
      } else if (item.itemType === 'option_group' && selection.selectedOptionId) {
        const option = item.options.find(o => o.id === selection.selectedOptionId);
        if (option) {
          if (option.fixedPrice) {
            const price = parseFloat(option.fixedPrice);
            minTotal += price;
            maxTotal += price;
          } else {
            minTotal += parseFloat(option.minPrice || '0');
            maxTotal += parseFloat(option.maxPrice || '0');
          }
        }
      }
    });

    setTotalPrice({ min: minTotal, max: maxTotal });
  };

  const updateSelection = (itemId: string, updates: Partial<SelectedItem>) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], ...updates }
    }));
  };

  const formatPrice = (min: number, max: number) => {
    if (min === max) {
      return `$${min.toLocaleString()}`;
    }
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const getParameterLabel = (item: QuoteItem) => {
    switch (item.parameterType) {
      case 'video_length':
        return 'seconds';
      case 'page_count':
        return 'pages';
      case 'hours':
        return 'hours';
      case 'square_feet':
        return 'sq ft';
      case 'custom':
        return item.parameterUnit || 'units';
      default:
        return 'units';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const selectedRequired = template.items.filter(item => 
      item.isRequired && selectedItems[item.id]?.selected
    );
    
    const allRequiredSelected = template.items.every(item => 
      !item.isRequired || selectedItems[item.id]?.selected
    );

    if (!allRequiredSelected) {
      toast.error('Please select all required items');
      return;
    }

    // Validate option groups
    const invalidOptionGroups = template.items.filter(item => 
      item.itemType === 'option_group' && 
      selectedItems[item.id]?.selected && 
      !selectedItems[item.id]?.selectedOptionId
    );

    if (invalidOptionGroups.length > 0) {
      toast.error('Please select an option for all selected items');
      return;
    }

    if (!template.allowGuestSubmissions && (!customerInfo.email)) {
      toast.error('Please provide your email address');
      return;
    }

    setSubmitting(true);

    try {
      const selectedItemsArray = Object.values(selectedItems).filter(s => s.selected);
      const parameterValues: Record<string, number> = {};
      
      selectedItemsArray.forEach(selection => {
        if (selection.parameterValue !== undefined) {
          parameterValues[selection.itemId] = selection.parameterValue;
        }
      });

      const response = await fetch('/api/quotes/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          customerName: customerInfo.name || null,
          customerEmail: customerInfo.email || null,
          customerPhone: customerInfo.phone || null,
          selectedItems: selectedItemsArray,
          selectedOptions: selectedItemsArray
            .filter(s => s.selectedOptionId)
            .map(s => ({ itemId: s.itemId, optionId: s.selectedOptionId })),
          parameterValues,
          totalMinPrice: totalPrice.min,
          totalMaxPrice: totalPrice.max,
          notes: customerInfo.notes || null,
        }),
      });

      if (response.ok) {
        toast.success('Quote request submitted successfully!');
        // Reset form
        setCustomerInfo({ name: '', email: '', phone: '', notes: '' });
      } else {
        toast.error('Failed to submit quote request');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Failed to submit quote request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quote Items */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Select Items & Services
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Choose the items and services you need for your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {template.items.map((item) => (
            <div key={item.id} className="border border-white/10 rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={selectedItems[item.id]?.selected || false}
                    disabled={item.isRequired}
                    onCheckedChange={(checked) => 
                      updateSelection(item.id, { selected: !!checked })
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={`item-${item.id}`} className="text-white font-medium cursor-pointer">
                      {item.title}
                      {item.isRequired && (
                        <Badge variant="secondary" className="ml-2 bg-red-500/20 text-red-300">
                          Required
                        </Badge>
                      )}
                    </Label>
                    {item.description && (
                      <p className="text-zinc-400 text-sm mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
                
                {/* Price Display */}
                <div className="text-right">
                  {item.itemType === 'fixed' && (
                    <div className="text-cyan-300 font-medium">
                      ${parseFloat(item.fixedPrice || '0').toLocaleString()}
                    </div>
                  )}
                  {item.itemType === 'range' && (
                    <div className="text-cyan-300 font-medium">
                      ${parseFloat(item.minPrice || '0').toLocaleString()} - 
                      ${parseFloat(item.maxPrice || '0').toLocaleString()}
                    </div>
                  )}
                  {item.itemType === 'parameter' && (
                    <div className="text-cyan-300 font-medium">
                      ${parseFloat(item.pricePerUnit || '0').toLocaleString()} / {getParameterLabel(item)}
                    </div>
                  )}
                </div>
              </div>

              {/* Parameter Input */}
              {item.itemType === 'parameter' && selectedItems[item.id]?.selected && (
                <div className="ml-6 space-y-2">
                  <Label className="text-white text-sm">
                    How many {getParameterLabel(item)}?
                  </Label>
                  <Input
                    type="number"
                    min={item.minUnits || 1}
                    max={item.maxUnits || undefined}
                    value={selectedItems[item.id]?.parameterValue || item.minUnits || 1}
                    onChange={(e) => 
                      updateSelection(item.id, { 
                        parameterValue: parseInt(e.target.value) || 1 
                      })
                    }
                    className="bg-white/10 border-white/20 text-white w-32"
                  />
                  <p className="text-zinc-400 text-xs">
                    {item.minUnits && `Min: ${item.minUnits}`}
                    {item.maxUnits && ` | Max: ${item.maxUnits}`}
                  </p>
                </div>
              )}

              {/* Options */}
              {item.itemType === 'option_group' && selectedItems[item.id]?.selected && (
                <div className="ml-6 space-y-3">
                  <Label className="text-white text-sm">Choose an option:</Label>
                  <RadioGroup
                    value={selectedItems[item.id]?.selectedOptionId || ''}
                    onValueChange={(value) => 
                      updateSelection(item.id, { selectedOptionId: value })
                    }
                  >
                    {item.options.map((option) => (
                      <div key={option.id} className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <div>
                            <Label htmlFor={option.id} className="text-white cursor-pointer">
                              {option.title}
                            </Label>
                            {option.description && (
                              <p className="text-zinc-400 text-sm">{option.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-cyan-300 font-medium">
                          {option.fixedPrice ? (
                            `$${parseFloat(option.fixedPrice).toLocaleString()}`
                          ) : (
                            `$${parseFloat(option.minPrice || '0').toLocaleString()} - $${parseFloat(option.maxPrice || '0').toLocaleString()}`
                          )}
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Total Price */}
      <Card className="bg-cyan-500/10 backdrop-blur-md border border-cyan-400/30 shadow-lg shadow-black/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Estimated Total</h3>
              <p className="text-cyan-300 text-sm">Based on your selections</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-300">
                {formatPrice(totalPrice.min, totalPrice.max)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Information
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {template.allowGuestSubmissions 
              ? "Optional - but helps us provide a better quote"
              : "Required information to process your quote request"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                placeholder="Enter your full name"
                className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address {!template.allowGuestSubmissions && "*"}
              </Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                required={!template.allowGuestSubmissions}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              placeholder="Enter your phone number"
              className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={customerInfo.notes}
              onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
              placeholder="Any additional details or special requirements..."
              className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={submitting}
          className="bg-cyan-500/20 backdrop-blur-md text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30 hover:border-cyan-400/50 shadow-lg shadow-black/20 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 px-8 py-3 text-lg"
        >
          {submitting ? (
            'Submitting...'
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit Quote Request
            </>
          )}
        </Button>
      </div>
    </form>
  );
}