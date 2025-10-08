"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlassBackground } from "@/components/custom/glass-background";
import { 
  PlayIcon, 
  ShareIcon, 
  TrendingUpIcon, 
  UsersIcon,
  BarChart3Icon,
  CalendarIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from "lucide-react";

export default function WorkflowsPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const workflows = [
    {
      id: "video-production",
      title: "Produce 50 Videos Ready to Share Daily",
      description: "Automated video production pipeline that creates, edits, and optimizes content for multiple social media platforms",
      icon: <PlayIcon className="w-8 h-8" />,
      features: [
        "AI-powered script generation",
        "Automated video editing",
        "Multi-platform optimization",
        "Thumbnail creation",
        "Caption generation",
        "Scheduling integration"
      ],
      stats: {
        efficiency: "95%",
        timesSaved: "8 hours/day",
        platforms: "5+"
      },
      color: "from-cyan-500 to-blue-600"
    },
    {
      id: "social-media-automation",
      title: "Social Media Marketing Automation",
      description: "Complete social media management workflow with AI-driven content creation, scheduling, and engagement tracking",
      icon: <ShareIcon className="w-8 h-8" />,
      features: [
        "Content calendar automation",
        "Cross-platform posting",
        "Engagement analytics",
        "Hashtag optimization",
        "Community management",
        "Performance tracking"
      ],
      stats: {
        efficiency: "90%",
        timesSaved: "6 hours/day",
        platforms: "10+"
      },
      color: "from-purple-500 to-pink-600"
    },
    {
      id: "content-marketing-pipeline",
      title: "Content Marketing Pipeline",
      description: "End-to-end content marketing workflow from ideation to publication and performance analysis",
      icon: <TrendingUpIcon className="w-8 h-8" />,
      features: [
        "Content ideation AI",
        "SEO optimization",
        "Multi-format creation",
        "Distribution automation",
        "Analytics dashboard",
        "ROI tracking"
      ],
      stats: {
        efficiency: "88%",
        timesSaved: "5 hours/day",
        platforms: "8+"
      },
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Marketing Workflows
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Streamline your marketing operations with our automated workflows designed to boost productivity and scale your content creation.
          </p>
        </div>

        {/* Workflow Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="relative group">
              {/* Glassmorphism Container */}
              <div className="relative overflow-hidden rounded-2xl">
                <GlassBackground 
                  chromaticAberration={2}
                  strength={40}
                  depth={8}
                  blur={3}
                  brightness={0.9}
                  saturation={1.2}
                  contrast={1.1}
                  opacity={0.02}
                />
                
                {/* Card Content */}
                <div className="relative z-10 p-6 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl bg-white/5 backdrop-blur-sm">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${workflow.color} shadow-lg`}>
                      {workflow.icon}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
                      onClick={() => setSelectedWorkflow(selectedWorkflow === workflow.id ? null : workflow.id)}
                    >
                      {selectedWorkflow === workflow.id ? "Less" : "More"}
                      <ArrowRightIcon className={`w-4 h-4 ml-1 transition-transform duration-200 ${selectedWorkflow === workflow.id ? 'rotate-90' : ''}`} />
                    </Button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {workflow.title}
                  </h3>
                  <p className="text-zinc-300 text-sm mb-4 line-clamp-2">
                    {workflow.description}
                  </p>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-cyan-400">{workflow.stats.efficiency}</div>
                      <div className="text-xs text-zinc-400">Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{workflow.stats.timesSaved}</div>
                      <div className="text-xs text-zinc-400">Time Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{workflow.stats.platforms}</div>
                      <div className="text-xs text-zinc-400">Platforms</div>
                    </div>
                  </div>

                  {/* Expandable Features */}
                  {selectedWorkflow === workflow.id && (
                    <div className="border-t border-white/10 pt-4 mt-4 animate-in slide-in-from-top-2 duration-300">
                      <h4 className="text-sm font-medium text-white mb-3">Key Features:</h4>
                      <div className="space-y-2">
                        {workflow.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-sm text-zinc-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
                    className={`w-full mt-4 bg-gradient-to-r ${workflow.color} hover:opacity-90 transition-opacity duration-200 text-white font-medium`}
                    asChild
                  >
                    <Link href={`/workflows/${workflow.id}`}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl">
            <GlassBackground 
              chromaticAberration={1}
              strength={30}
              depth={6}
              blur={2}
            />
            
            <div className="relative z-10 p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <BarChart3Icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Analytics & Insights</h3>
                  <p className="text-zinc-300 text-sm">
                    Track performance across all workflows with detailed analytics and actionable insights.
                  </p>
                </div>
                <div>
                  <UsersIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Team Collaboration</h3>
                  <p className="text-zinc-300 text-sm">
                    Seamlessly collaborate with your team on workflow management and content creation.
                  </p>
                </div>
                <div>
                  <CalendarIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Smart Scheduling</h3>
                  <p className="text-zinc-300 text-sm">
                    AI-powered scheduling ensures optimal timing for maximum engagement and reach.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}