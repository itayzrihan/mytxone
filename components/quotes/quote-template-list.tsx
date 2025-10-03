"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Trash2, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { CreateQuoteTemplate } from './create-quote-template';

interface QuoteTemplate {
  id: string;
  title: string;
  description: string | null;
  businessType: string;
  isActive: boolean;
  allowGuestSubmissions: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface QuoteTemplateListProps {
  userId: string;
}

export function QuoteTemplateList({ userId }: QuoteTemplateListProps) {
  const [templates, setTemplates] = useState<QuoteTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<QuoteTemplate | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, [userId]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/quotes/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      } else {
        toast.error('Failed to load quote templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load quote templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this quote template? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/quotes/templates/${templateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTemplates(templates.filter(t => t.id !== templateId));
        toast.success('Quote template deleted successfully');
      } else {
        toast.error('Failed to delete quote template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete quote template');
    }
  };

  const copyShareLink = (templateId: string) => {
    const shareUrl = `${window.location.origin}/quotes/respond/${templateId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
  };

  const handleEdit = (template: QuoteTemplate) => {
    setEditingTemplate(template);
  };

  const handleEditComplete = () => {
    setEditingTemplate(null);
    fetchTemplates(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

  if (editingTemplate) {
    return (
      <CreateQuoteTemplate
        userId={userId}
        onBack={handleEditComplete}
        editingTemplate={editingTemplate}
      />
    );
  }

  if (templates.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <h3 className="text-lg font-medium text-white mb-2">No quote templates yet</h3>
            <p className="text-zinc-400 mb-4">
              Create your first quote template to start collecting customer responses
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card key={template.id} className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20 hover:bg-white/15 transition-all duration-300">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-white text-lg">{template.title}</CardTitle>
                <CardDescription className="text-zinc-400 mt-1">
                  {template.description || 'No description'}
                </CardDescription>
              </div>
              <Badge 
                variant={template.isActive ? "default" : "secondary"}
                className={template.isActive ? "bg-green-500/20 text-green-300" : "bg-zinc-500/20 text-zinc-400"}
              >
                {template.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="border-cyan-400/30 text-cyan-300">
                {template.businessType}
              </Badge>
              {template.allowGuestSubmissions && (
                <Badge variant="outline" className="border-blue-400/30 text-blue-300">
                  Guest Friendly
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyShareLink(template.id)}
                className="flex-1 bg-cyan-500/10 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Share
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(template)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Edit className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(template.id)}
                className="bg-red-500/10 border-red-400/30 text-red-300 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="mt-4 text-xs text-zinc-500">
              Created {new Date(template.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}