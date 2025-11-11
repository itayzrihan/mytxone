"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Users, Settings, Info } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { CommunityLimitModal } from "./community-limit-modal";

interface CreateCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  userPlan?: string;
}

export function CreateCommunityDialog({ open, onOpenChange, onSuccess, userPlan = "free" }: CreateCommunityDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitInfo, setLimitInfo] = useState({ currentCount: 0, limit: 1 });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    communityType: "learning",
    category: CATEGORIES[0].value, // Default to first category
    imageUrl: "",
    isPublic: true,
    requiresApproval: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      communityType: "learning",
      category: CATEGORIES[0].value,
      imageUrl: "",
      isPublic: true,
      requiresApproval: false,
    });
    setCurrentStep(1);
    setIsSubmitting(false);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep
                ? "bg-purple-500 text-white"
                : step < currentStep
                ? "bg-green-500 text-white"
                : "bg-white/20 text-zinc-400"
            }`}
          >
            {step < currentStep ? "✓" : step}
          </div>
          {step < 3 && (
            <div
              className={`w-12 h-0.5 mx-2 ${
                step < currentStep ? "bg-green-500" : "bg-white/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.title.trim() !== "" && formData.communityType !== "" && formData.category !== "";
      case 2:
        return formData.description.trim() !== "";
      case 3:
        return true; // No required fields in step 3
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(1)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        
        // Check if it's a limit error
        if (response.status === 403 && error.currentCount !== undefined) {
          setLimitInfo({
            currentCount: error.currentCount,
            limit: error.limit === "unlimited" ? Infinity : error.limit,
          });
          setShowLimitModal(true);
          setIsSubmitting(false);
          return;
        }
        
        throw new Error(error.error || "Failed to create community");
      }

      toast.success("Community created successfully!");
      resetForm();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        resetForm();
      }
      onOpenChange(open);
    }}>
      <DialogContent className="bg-black/90 border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Community</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Step {currentStep} of 3
          </DialogDescription>
        </DialogHeader>

        <StepIndicator />

        <form onSubmit={(e) => {
          e.preventDefault();
          if (currentStep === 3) {
            handleCreateCommunity(e);
          } else {
            handleNext();
          }
        }}>
          <div className="py-4 min-h-[300px]">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Info className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                  <p className="text-zinc-400 text-sm">Tell us about your community</p>
                </div>
                <div>
                  <Label htmlFor="title">Community Name *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white mt-1"
                    placeholder="Enter community name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="communityType">Community Type *</Label>
                    <Select value={formData.communityType} onValueChange={(value) => setFormData({ ...formData, communityType: value })}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="learning">Learning & Education</SelectItem>
                        <SelectItem value="networking">Networking</SelectItem>
                        <SelectItem value="support">Support Group</SelectItem>
                        <SelectItem value="hobby">Hobby & Interest</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="fitness">Fitness & Wellness</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="book-club">Book Club</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
                        <SelectItem value="volunteer">Volunteer & Charity</SelectItem>
                        <SelectItem value="local">Local Community</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <span className="flex items-center gap-2">
                              {category.emoji} {category.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Description */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-white">Community Description</h3>
                  <p className="text-zinc-400 text-sm">What is your community about?</p>
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-1"
                    rows={6}
                    placeholder="Describe your community, its goals, and what members can expect..."
                    required
                  />
                  <p className="text-zinc-400 text-xs mt-2">
                    A good description helps people understand what your community is about and attracts the right members.
                  </p>
                </div>
                <div>
                  <Label htmlFor="imageUrl">Community Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-1"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-zinc-400 text-xs mt-2">
                    Add a cover image for your community (recommended)
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Settings */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Settings className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-white">Community Settings</h3>
                  <p className="text-zinc-400 text-sm">Configure your community preferences</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex-1">
                      <Label htmlFor="isPublic" className="text-base">Public Community</Label>
                      <p className="text-zinc-400 text-sm">Anyone can discover and join this community</p>
                    </div>
                    <Switch
                      id="isPublic"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex-1">
                      <Label htmlFor="requiresApproval" className="text-base">Require Approval</Label>
                      <p className="text-zinc-400 text-sm">Members need approval before joining</p>
                    </div>
                    <Switch
                      id="requiresApproval"
                      checked={formData.requiresApproval}
                      onCheckedChange={(checked) => setFormData({ ...formData, requiresApproval: checked })}
                    />
                  </div>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <h4 className="text-white font-medium mb-2">📋 Community Summary</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-zinc-300"><span className="text-zinc-400">Name:</span> {formData.title || "Not set"}</p>
                    <p className="text-zinc-300"><span className="text-zinc-400">Type:</span> {formData.communityType}</p>
                    <p className="text-zinc-300"><span className="text-zinc-400">Category:</span> {CATEGORIES.find(c => c.value === formData.category)?.name || formData.category}</p>
                    <p className="text-zinc-300"><span className="text-zinc-400">Visibility:</span> {formData.isPublic ? "Public" : "Private"}</p>
                    <p className="text-zinc-300"><span className="text-zinc-400">Approval:</span> {formData.requiresApproval ? "Required" : "Not required"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between gap-2">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious} className="border-white/20 hover:bg-white/10">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {currentStep < 3 ? (
                <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="bg-purple-500 hover:bg-purple-600">
                  {isSubmitting ? "Creating..." : "Create Community"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <CommunityLimitModal
      open={showLimitModal}
      onOpenChange={setShowLimitModal}
      currentCount={limitInfo.currentCount}
      limit={limitInfo.limit}
      plan={userPlan}
      onRemoveCommunity={() => {
        setShowLimitModal(false);
        onOpenChange(false);
      }}
    />
    </>
  );
}
