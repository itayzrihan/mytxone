"use client";

import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Calendar, Settings, Info } from "lucide-react";
import { 
  ALL_TIMEZONES, 
  getUserDeviceTimezone, 
  convertToUTC,
  convertFromUTC 
} from "@/lib/timezones";
import { CATEGORIES, getCategoryLabel } from "@/lib/categories";

interface CreateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateMeetingDialog({ open, onOpenChange, onSuccess }: CreateMeetingDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userTimezone, setUserTimezone] = useState<string>("");
  
  // Initialize timezone on mount
  useEffect(() => {
    setUserTimezone(getUserDeviceTimezone());
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meetingType: "webinar",
    category: CATEGORIES[0].value, // Default to first category
    startTime: "",
    endTime: "",
    timezone: userTimezone || "UTC",
    meetingUrl: "",
    maxAttendees: "",
    isPublic: true,
    requiresApproval: false,
  });

  const allTimezones = useMemo(() => ALL_TIMEZONES, []);

  // Update timezone in formData when userTimezone is initialized
  useEffect(() => {
    if (userTimezone && formData.timezone === "UTC") {
      setFormData(prev => ({ ...prev, timezone: userTimezone }));
    }
  }, [userTimezone]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      meetingType: "webinar",
      category: CATEGORIES[0].value,
      startTime: "",
      endTime: "",
      timezone: userTimezone || "UTC",
      meetingUrl: "",
      maxAttendees: "",
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
                ? "bg-cyan-500 text-white"
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
        return formData.title.trim() !== "" && formData.meetingType !== "" && formData.category !== "";
      case 2:
        return (
          formData.startTime !== "" &&
          formData.endTime !== "" &&
          new Date(formData.endTime) > new Date(formData.startTime)
        );
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
      if (currentStep === 2 && formData.startTime && formData.endTime) {
        if (new Date(formData.endTime) <= new Date(formData.startTime)) {
          toast.error("End time must be after start time");
          return;
        }
      }
      toast.error("Please fill in all required fields");
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert local times to UTC before sending
      const startTimeUTC = convertToUTC(formData.startTime, formData.timezone);
      const endTimeUTC = convertToUTC(formData.endTime, formData.timezone);

      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startTime: startTimeUTC,
          endTime: endTimeUTC,
          maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create meeting");
      }

      toast.success("Meeting created successfully!");
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

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];
  
  // Disable dates before start time
  const disabledDateAfterStart = formData.startTime ? formData.startTime.split("T")[0] : null;

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        resetForm();
      }
      onOpenChange(open);
    }}>
      <DialogContent className="bg-black/90 border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Meeting</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Step {currentStep} of 3
          </DialogDescription>
        </DialogHeader>

        <StepIndicator />

        <form onSubmit={(e) => {
          e.preventDefault();
          if (currentStep === 3) {
            handleCreateMeeting(e);
          } else {
            handleNext();
          }
        }}>
          <div className="py-4 min-h-[300px]">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Info className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                  <p className="text-zinc-400 text-sm">Tell us about your meeting</p>
                </div>
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white mt-1"
                    placeholder="Enter meeting title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white mt-1"
                    rows={3}
                    placeholder="Describe your meeting (optional)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="meetingType">Meeting Type *</Label>
                    <Select value={formData.meetingType} onValueChange={(value) => setFormData({ ...formData, meetingType: value })}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="webinar">Webinar</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="training">Training Session</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="demo">Product Demo</SelectItem>
                        <SelectItem value="networking">Networking Event</SelectItem>
                        <SelectItem value="seminar">Seminar</SelectItem>
                        <SelectItem value="panel">Panel Discussion</SelectItem>
                        <SelectItem value="hackathon">Hackathon</SelectItem>
                        <SelectItem value="meetup">Meetup</SelectItem>
                        <SelectItem value="masterclass">Masterclass</SelectItem>
                        <SelectItem value="office-hours">Office Hours</SelectItem>
                        <SelectItem value="q-and-a">Q&A Session</SelectItem>
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

            {/* Step 2: Date & Time */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-white">Date & Time</h3>
                  <p className="text-zinc-400 text-sm">When will your meeting take place?</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      onBlur={() => {}} // Prevent unfocus issues
                      min={new Date().toISOString().slice(0, 16)}
                      required
                      className="bg-white/10 border-white/20 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      onBlur={() => {}} // Prevent unfocus issues
                      min={formData.startTime || new Date().toISOString().slice(0, 16)}
                      required
                      className="bg-white/10 border-white/20 text-white mt-1"
                    />
                  </div>
                </div>
                {formData.startTime && formData.endTime && new Date(formData.endTime) <= new Date(formData.startTime) && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    ⚠️ End time must be after start time
                  </div>
                )}
                <div>
                  <Label htmlFor="timezone">Timezone *</Label>
                  <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {allTimezones.map((tz: typeof ALL_TIMEZONES[0]) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Settings & Link */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Settings className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-white">Settings & Link</h3>
                  <p className="text-zinc-400 text-sm">Configure your meeting settings</p>
                </div>
                <div>
                  <Label htmlFor="meetingUrl">Meeting URL (Zoom/Meet link)</Label>
                  <Input
                    id="meetingUrl"
                    type="url"
                    value={formData.meetingUrl}
                    onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                    onBlur={() => {}} // Prevent unfocus issues
                    className="bg-white/10 border-white/20 text-white mt-1"
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
                <div>
                  <Label htmlFor="maxAttendees">Max Attendees (leave empty for unlimited)</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    min="1"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                    onBlur={() => {}} // Prevent unfocus issues
                    className="bg-white/10 border-white/20 text-white mt-1"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="isPublic" className="text-sm cursor-pointer">Make meeting public</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="requiresApproval"
                      checked={formData.requiresApproval}
                      onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="requiresApproval" className="text-sm cursor-pointer">Require approval for registration</Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="mr-2"
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              )}
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  onOpenChange(false);
                }}
                className="mr-2"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              {currentStep < 3 ? (
                <Button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600"
                  disabled={isSubmitting}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Meeting"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
