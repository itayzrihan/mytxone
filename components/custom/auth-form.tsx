import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { User, ImageIcon, ChevronRight, ChevronLeft } from "lucide-react";
import { ImageCropModal } from "./image-crop-modal";

export function AuthForm({
  action,
  children,
  defaultUsername = "",
  includeProfileFields = false,
  isModal = false,
  onStepChange,
}: {
  action: any;
  children: React.ReactNode;
  defaultUsername?: string;
  includeProfileFields?: boolean;
  isModal?: boolean;
  onStepChange?: (step: number) => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Form state for validation and persistence across steps
  const [formState, setFormState] = useState({
    username: defaultUsername,
    password: "",
    fullName: "",
    notMytxEmail: "",
    phoneNumber: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageUrl(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setImagePreview(croppedImage);
    // Convert base64 to File
    fetch(croppedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "profile-image.png", { type: "image/png" });
        setImageFile(file);
      });
  };

  const handleNextStep = () => {
    if (currentStep < (includeProfileFields && isModal ? 2 : 0)) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  };

  // Check if current step fields are valid
  const isCurrentStepValid = () => {
    if (!shouldShowSteps) return true;
    
    switch (currentStep) {
      case 0: // Email & Password
        return formState.password.trim() !== "";
      case 1: // Phone & Full Name
        return formState.fullName.trim() !== "";
      case 2: // Username & Profile Picture
        return formState.username.trim() !== "";
      default:
        return true;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Determine which step to show
  const shouldShowSteps = includeProfileFields && isModal;
  
  // Step 0: Username & Full Name
  // Step 1: Email & Phone
  // Step 2: Profile Picture & Password

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {/* Login view (no profile fields) */}
        {!includeProfileFields && (
          <>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="username"
                className="text-cyan-300 font-medium"
              >
                Username
              </Label>

              <Input
                id="username"
                name="username"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
                type="text"
                placeholder="john_doe"
                autoComplete="username"
                required
                value={formState.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="password"
                className="text-cyan-300 font-medium"
              >
                Password
              </Label>

              <Input
                id="password"
                name="password"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
                type="password"
                required
                value={formState.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>
          </>
        )}

        {/* Step 0: Email & Password (stepped registration) */}
        {shouldShowSteps && currentStep === 0 && (
          <>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="notMytxEmail"
                className="text-cyan-300 font-medium"
              >
                External Email <span className="text-xs text-gray-400">(Recommended)</span>
              </Label>

              <Input
                id="notMytxEmail"
                name="notMytxEmail"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                value={formState.notMytxEmail}
                onChange={(e) => handleInputChange("notMytxEmail", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="password"
                className="text-cyan-300 font-medium"
              >
                Password
              </Label>

              <Input
                id="password"
                name="password"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
                type="password"
                required
                value={formState.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>
          </>
        )}

        {/* Step 1: Phone & Full Name */}
        {shouldShowSteps && currentStep === 1 && (
          <>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="phoneNumber"
                className="text-cyan-300 font-medium"
              >
                Phone Number <span className="text-xs text-gray-400">(Recommended)</span>
              </Label>

              <Input
                id="phoneNumber"
                name="phoneNumber"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
                type="tel"
                placeholder="+1 (555) 123-4567"
                autoComplete="tel"
                value={formState.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              />
            </div>

            {includeProfileFields && (
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="fullName"
                  className="text-cyan-300 font-medium"
                >
                  Full Name
                </Label>

                <Input
                  id="fullName"
                  name="fullName"
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                  value={formState.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
              </div>
            )}
          </>
        )}

        {/* Step 2: Username & Profile Picture */}
        {shouldShowSteps && currentStep === 2 && (
          <>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="username"
                className="text-cyan-300 font-medium"
              >
                Username
              </Label>

              <Input
                id="username"
                name="username"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
                type="text"
                placeholder="john_doe"
                autoComplete="username"
                required
                value={formState.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </div>

            {/* Profile Picture Upload */}
            <div className="flex flex-col gap-2">
              <Label className="text-cyan-300 font-medium">
                Profile Picture <span className="text-xs text-gray-400">(Recommended)</span>
              </Label>
              
              <div className="flex flex-col gap-3">
                {/* Preview */}
                {imagePreview && (
                  <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-1">
                      <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <label className="relative inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition-colors cursor-pointer">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-300">Upload & Crop</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <p className="text-xs text-gray-400 text-center">Max 5MB • Will be circular</p>
              </div>
            </div>
          </>
        )}

        {/* Non-stepped view (registration page) */}
        {!shouldShowSteps && includeProfileFields && (
          <>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="fullName"
                className="text-cyan-300 font-medium"
              >
                Full Name
              </Label>

              <Input
                id="fullName"
                name="fullName"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                required
                value={formState.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="notMytxEmail"
                className="text-cyan-300 font-medium"
              >
                External Email <span className="text-xs text-gray-400">(Recommended)</span>
              </Label>

              <Input
                id="notMytxEmail"
                name="notMytxEmail"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                value={formState.notMytxEmail}
                onChange={(e) => handleInputChange("notMytxEmail", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="phoneNumber"
                className="text-cyan-300 font-medium"
              >
                Phone Number <span className="text-xs text-gray-400">(Recommended)</span>
              </Label>

              <Input
                id="phoneNumber"
                name="phoneNumber"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 focus:border-cyan-400 focus:ring-cyan-400/50"
                type="tel"
                placeholder="+1 (555) 123-4567"
                autoComplete="tel"
                value={formState.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              />
            </div>

            {/* Profile Picture Upload */}
            <div className="flex flex-col gap-2">
              <Label className="text-cyan-300 font-medium">
                Profile Picture <span className="text-xs text-gray-400">(Recommended)</span>
              </Label>
              
              <div className="flex flex-col gap-3">
                {/* Preview */}
                {imagePreview && (
                  <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-1">
                      <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <label className="relative inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition-colors cursor-pointer">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-300">Upload & Crop</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <p className="text-xs text-gray-400 text-center">Max 5MB • Will be circular</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hidden inputs to ensure form data is submitted with state values */}
      {shouldShowSteps && (
        <>
          <input type="hidden" name="username" value={formState.username} />
          <input type="hidden" name="fullName" value={formState.fullName} />
          <input type="hidden" name="notMytxEmail" value={formState.notMytxEmail} />
          <input type="hidden" name="phoneNumber" value={formState.phoneNumber} />
          <input type="hidden" name="password" value={formState.password} />
        </>
      )}

      {/* Hidden input to pass image data to form - always present */}
      {includeProfileFields && (
        <input
          type="hidden"
          name="profileImageData"
          value={imagePreview || ""}
        />
      )}

      {/* Step Navigation for modal */}
      {shouldShowSteps && (
        <div className="flex gap-2 justify-between items-center mt-4">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyan-500/50 transition-colors text-sm text-zinc-300"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex gap-1">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`h-2 w-2 rounded-full transition-colors ${
                  step === currentStep ? "bg-cyan-400" : "bg-zinc-600"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextStep}
            disabled={currentStep === 2 || !isCurrentStepValid()}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 transition-all text-sm text-cyan-300 ${
              currentStep === 2 || !isCurrentStepValid() ? "opacity-0 cursor-not-allowed" : "opacity-100"
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Only show children (submit button) on last step or if not stepped */}
      {(!shouldShowSteps || currentStep === 2) && children}

      {/* Image Crop Modal */}
      {tempImageUrl && (
        <ImageCropModal
          isOpen={isCropModalOpen}
          imageUrl={tempImageUrl}
          onClose={() => {
            setIsCropModalOpen(false);
            setTempImageUrl(null);
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </form>
  );
}
