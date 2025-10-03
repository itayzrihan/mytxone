"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Mail, 
  Phone,
  FileText,
  Calculator,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface QuoteResponse {
  id: string;
  templateId: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  selectedItems: any[];
  selectedOptions: any[];
  parameterValues: any;
  totalMinPrice: string | null;
  totalMaxPrice: string | null;
  notes: string | null;
  status: string;
  createdAt: Date;
  template: {
    title: string;
    businessType: string;
  };
}

interface QuoteResponseDetailProps {
  response: QuoteResponse;
  onClose: () => void;
  onStatusUpdate: (responseId: string, newStatus: string) => void;
}

export function QuoteResponseDetail({ response, onClose, onStatusUpdate }: QuoteResponseDetailProps) {
  const formatPrice = (minPrice: string | null, maxPrice: string | null) => {
    if (!minPrice && !maxPrice) return 'N/A';
    
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : 0;
    
    if (min === max) {
      return `$${min.toLocaleString()}`;
    }
    
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return 'bg-zinc-500/20 text-zinc-300';
    
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'reviewed':
        return 'bg-blue-500/20 text-blue-300';
      case 'quoted':
        return 'bg-green-500/20 text-green-300';
      case 'closed':
        return 'bg-gray-500/20 text-gray-300';
      default:
        return 'bg-zinc-500/20 text-zinc-300';
    }
  };

  const formatStatus = (status: string | null | undefined) => {
    if (!status || typeof status !== 'string') return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return 'reviewed';
      case 'reviewed':
        return 'quoted';
      case 'quoted':
        return 'closed';
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Mark as Reviewed';
      case 'reviewed':
        return 'Mark as Quoted';
      case 'quoted':
        return 'Mark as Closed';
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onClose}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          ← Back to Responses
        </Button>
        <Badge className={getStatusColor(response.status)}>
          {formatStatus(response.status)}
        </Badge>
      </div>

      {/* Customer Information */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-zinc-400">Name</Label>
              <p className="text-white">{response.customerName || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-zinc-400">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <p className="text-white">{response.customerEmail || 'Not provided'}</p>
              </div>
            </div>
          </div>
          
          {response.customerPhone && (
            <div>
              <Label className="text-zinc-400">Phone</Label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400" />
                <p className="text-white">{response.customerPhone}</p>
              </div>
            </div>
          )}
          
          <div>
            <Label className="text-zinc-400">Quote Template</Label>
            <p className="text-white">{response.template.title}</p>
            <Badge variant="outline" className="border-cyan-400/30 text-cyan-300 mt-1">
              {response.template.businessType}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quote Details */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Quote Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-zinc-400">Total Price</Label>
              <p className="text-2xl font-bold text-green-300">
                {formatPrice(response.totalMinPrice, response.totalMaxPrice)}
              </p>
            </div>
            <div>
              <Label className="text-zinc-400">Submitted On</Label>
              <p className="text-white">
                {new Date(response.createdAt).toLocaleDateString()} at{' '}
                {new Date(response.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Selected Items */}
          <div>
            <Label className="text-zinc-400">Selected Items</Label>
            <div className="mt-2 space-y-2">
              {Array.isArray(response.selectedItems) && response.selectedItems.map((item, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white">Item ID: {typeof item === 'object' && item?.itemId ? item.itemId : item}</p>
                  {typeof item === 'object' && item?.parameterValue && (
                    <p className="text-zinc-300 text-sm">Parameter: {item.parameterValue}</p>
                  )}
                  {typeof item === 'object' && item?.selectedOptionId && (
                    <p className="text-zinc-300 text-sm">Option: {item.selectedOptionId}</p>
                  )}
                  {/* Note: In a real implementation, you'd fetch item details */}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {response.notes && (
            <div>
              <Label className="text-zinc-400">Customer Notes</Label>
              <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white">{response.notes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20">
        <CardHeader>
          <CardTitle className="text-white">Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {getNextStatus(response.status) && (
              <Button
                onClick={() => onStatusUpdate(response.id, getNextStatus(response.status)!)}
                className="bg-cyan-500/20 backdrop-blur-md text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {getStatusLabel(response.status)}
              </Button>
            )}
            
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Quote Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <label className={className}>{children}</label>;
}