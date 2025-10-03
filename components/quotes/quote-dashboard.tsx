"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, BarChart3, Settings } from 'lucide-react';
import { QuoteTemplateList } from './quote-template-list';
import { QuoteResponsesList } from './quote-responses-list';
import { CreateQuoteTemplate } from './create-quote-template';

interface QuoteDashboardProps {
  currentUser: {
    id: string;
    email: string;
  };
}

interface DashboardStats {
  activeTemplates: number;
  totalResponses: number;
  pendingResponses: number;
}

export function QuoteDashboard({ currentUser }: QuoteDashboardProps) {
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    activeTemplates: 0,
    totalResponses: 0,
    pendingResponses: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [templatesResponse, responsesResponse] = await Promise.all([
        fetch('/api/quotes/templates'),
        fetch('/api/quotes/responses'),
      ]);

      if (templatesResponse.ok && responsesResponse.ok) {
        const templates = await templatesResponse.json();
        const responses = await responsesResponse.json();

        setStats({
          activeTemplates: templates.filter((t: any) => t.isActive).length,
          totalResponses: responses.length,
          pendingResponses: responses.filter((r: any) => 
            r.response?.status === 'pending' || r.status === 'pending'
          ).length,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (showCreateTemplate) {
    return (
      <CreateQuoteTemplate
        userId={currentUser.id}
        onBack={() => {
          setShowCreateTemplate(false);
          fetchStats(); // Refresh stats when returning from create template
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quote Proposals</h1>
          <p className="text-zinc-300 mt-1">
            Create dynamic quote templates and manage customer responses
          </p>
        </div>
        <Button
          onClick={() => setShowCreateTemplate(true)}
          className="bg-cyan-500/20 backdrop-blur-md text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30 hover:border-cyan-400/50 shadow-lg shadow-black/20 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Quote Template
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Templates</CardTitle>
            <FileText className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeTemplates}</div>
            <p className="text-xs text-zinc-400">Quote templates created</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Responses</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalResponses}</div>
            <p className="text-xs text-zinc-400">Customer responses received</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pending Reviews</CardTitle>
            <Settings className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingResponses}</div>
            <p className="text-xs text-zinc-400">Responses awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList className="bg-white/10 backdrop-blur-md border border-white/20">
          <TabsTrigger 
            value="templates" 
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 text-zinc-300"
          >
            My Templates
          </TabsTrigger>
          <TabsTrigger 
            value="responses" 
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 text-zinc-300"
          >
            Customer Responses
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4">
          <QuoteTemplateList userId={currentUser.id} />
        </TabsContent>
        
        <TabsContent value="responses" className="space-y-4">
          <QuoteResponsesList userId={currentUser.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}