"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Mail, Phone, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { QuoteResponseDetail } from './quote-response-detail';

interface QuoteResponseData {
  response: {
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
  };
  template: {
    id: string;
    title: string;
    businessType: string;
    userId: string;
  };
}

// Flattened interface for easier component usage
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

interface QuoteResponsesListProps {
  userId: string;
}

export function QuoteResponsesList({ userId }: QuoteResponsesListProps) {
  const [responses, setResponses] = useState<QuoteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<QuoteResponse | null>(null);

  useEffect(() => {
    fetchResponses();
  }, [userId]);

  const fetchResponses = async () => {
    try {
      const response = await fetch('/api/quotes/responses');
      if (response.ok) {
        const data: QuoteResponseData[] = await response.json();
        // Transform the data to flatten the structure
        const transformedData: QuoteResponse[] = data.map(item => ({
          id: item.response.id,
          templateId: item.response.templateId,
          customerName: item.response.customerName,
          customerEmail: item.response.customerEmail,
          customerPhone: item.response.customerPhone,
          selectedItems: item.response.selectedItems,
          selectedOptions: item.response.selectedOptions,
          parameterValues: item.response.parameterValues,
          totalMinPrice: item.response.totalMinPrice,
          totalMaxPrice: item.response.totalMaxPrice,
          notes: item.response.notes,
          status: item.response.status || 'pending',
          createdAt: item.response.createdAt,
          template: {
            title: item.template.title,
            businessType: item.template.businessType,
          },
        }));
        setResponses(transformedData);
      } else {
        toast.error('Failed to load quote responses');
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
      toast.error('Failed to load quote responses');
    } finally {
      setLoading(false);
    }
  };

  const updateResponseStatus = async (responseId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/quotes/responses/${responseId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setResponses(responses.map(r => 
          r.id === responseId ? { ...r, status: newStatus } : r
        ));
        // Also update the selected response if it's currently displayed
        if (selectedResponse && selectedResponse.id === responseId) {
          setSelectedResponse({ ...selectedResponse, status: newStatus });
        }
        toast.success('Status updated successfully');
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (selectedResponse) {
    return (
      <QuoteResponseDetail
        response={selectedResponse}
        onClose={() => setSelectedResponse(null)}
        onStatusUpdate={updateResponseStatus}
      />
    );
  }

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

  const formatPrice = (minPrice: string | null, maxPrice: string | null) => {
    if (!minPrice && !maxPrice) return 'N/A';
    
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : 0;
    
    if (min === max) {
      return `$${min.toLocaleString()}`;
    }
    
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20">
            <CardHeader>
              <div className="h-4 bg-white/20 rounded animate-pulse" />
              <div className="h-3 bg-white/20 rounded animate-pulse w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-white/20 rounded animate-pulse" />
                <div className="h-3 bg-white/20 rounded animate-pulse w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <h3 className="text-lg font-medium text-white mb-2">No responses yet</h3>
            <p className="text-zinc-400 mb-4">
              Customer responses will appear here once they start submitting your quote forms
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {responses.map((response) => (
        <Card key={response.id} className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20 hover:bg-white/15 transition-all duration-300">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-white text-lg">
                  {response.customerName || 'Anonymous Customer'}
                </CardTitle>
                <CardDescription className="text-zinc-400 mt-1">
                  Quote for: {response.template.title}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(response.status)}>
                {formatStatus(response.status)}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="border-cyan-400/30 text-cyan-300">
                {response.template.businessType}
              </Badge>
              <Badge variant="outline" className="border-green-400/30 text-green-300">
                {formatPrice(response.totalMinPrice, response.totalMaxPrice)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {/* Customer Info */}
              <div className="flex flex-wrap gap-4 text-sm">
                {response.customerEmail && (
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Mail className="w-4 h-4" />
                    {response.customerEmail}
                  </div>
                )}
                {response.customerPhone && (
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Phone className="w-4 h-4" />
                    {response.customerPhone}
                  </div>
                )}
              </div>
              
              {/* Notes */}
              {response.notes && (
                <div className="flex items-start gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-zinc-400 mt-0.5" />
                  <p className="text-zinc-300">{response.notes}</p>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedResponse(response)}
                  className="bg-cyan-500/10 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                
                {response.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateResponseStatus(response.id, 'reviewed')}
                    className="bg-blue-500/10 border-blue-400/30 text-blue-300 hover:bg-blue-500/20"
                  >
                    Mark Reviewed
                  </Button>
                )}
                
                {response.status === 'reviewed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateResponseStatus(response.id, 'quoted')}
                    className="bg-green-500/10 border-green-400/30 text-green-300 hover:bg-green-500/20"
                  >
                    Mark Quoted
                  </Button>
                )}
              </div>
              
              <div className="text-xs text-zinc-500 mt-4">
                Submitted {new Date(response.createdAt).toLocaleDateString()} at{' '}
                {new Date(response.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}