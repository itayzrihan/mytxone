"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Mail, User, Phone, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ImageCropModal } from "@/components/custom/image-crop-modal";

interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  phoneNumber: string | null;
  notMytxEmail: string | null;
  profileImageUrl: string | null;
  subscription: string;
}

interface PageProps {
  params: {
    username: string;
  };
}

export default function ProfilePage({ params }: PageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    notMytxEmail: "",
    profileImageUrl: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/user/profile/${params.username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data: UserProfile = await response.json();
        setProfile(data);
        
        // Check if this is the current user's profile
        if (session?.user?.email === data.email) {
          setIsOwnProfile(true);
        }
        
        setFormData({
          fullName: data.fullName || "",
          phoneNumber: data.phoneNumber || "",
          notMytxEmail: data.notMytxEmail || "",
          profileImageUrl: data.profileImageUrl || "",
        });
        if (data.profileImageUrl) {
          setImagePreview(data.profileImageUrl);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, params.username, session?.user?.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageUrl(reader.result as string);
        setIsCropModalOpen(true);
        setError(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare FormData for file upload
      const submitData = new FormData();
      submitData.append("fullName", formData.fullName);
      submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("notMytxEmail", formData.notMytxEmail);

      if (imageFile) {
        submitData.append("profileImage", imageFile);
      }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        body: submitData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setFormData({
        fullName: updatedProfile.fullName || "",
        phoneNumber: updatedProfile.phoneNumber || "",
        notMytxEmail: updatedProfile.notMytxEmail || "",
        profileImageUrl: updatedProfile.profileImageUrl || "",
      });
      setImageFile(null);
      setSuccess(true);
      toast.success("Profile updated successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-400" />
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
          <p className="text-white">User not found</p>
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              {isOwnProfile ? "My Profile" : `${params.username}'s Profile`}
            </span>
          </h1>
          <p className="text-gray-300">{isOwnProfile ? "Manage your account details" : "View user profile"}</p>
        </div>

        {/* Main Profile Card */}
        <div className="relative">
          {/* Neon border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl p-0.5 opacity-75 blur-lg" />
          
          <div className="relative bg-gray-900 rounded-2xl p-8 md:p-12 border border-cyan-500/20">
            {isOwnProfile ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center gap-6 pb-8 border-b border-cyan-500/10">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-1">
                      <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-16 h-16 text-cyan-400" />
                        )}
                      </div>
                    </div>
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-600 p-2 rounded-full cursor-pointer transition-colors"
                    >
                      <ImageIcon className="w-5 h-5 text-white" />
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isSaving}
                      />
                    </label>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Upload a profile picture</p>
                    <p className="text-xs text-gray-500">Max 5MB</p>
                  </div>
                </div>

                {/* Email Display (Read-only) */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
                    <Mail className="w-4 h-4" />
                    MyTX Email Address
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-cyan-500/20 text-white font-mono text-sm flex items-center justify-between">
                    <span>{profile.email}</span>
                    <span className="text-xs text-gray-400">(Read-only)</span>
                  </div>
                  <p className="text-xs text-gray-500">This is your MyTX.one account email</p>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    disabled={isSaving}
                    className="bg-gray-800/50 border-cyan-500/20 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/30"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    disabled={isSaving}
                    className="bg-gray-800/50 border-cyan-500/20 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/30"
                  />
                </div>

                {/* External Email */}
                <div className="space-y-2">
                  <label htmlFor="notMytxEmail" className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
                    <Mail className="w-4 h-4" />
                    External Email Address
                  </label>
                  <Input
                    id="notMytxEmail"
                    name="notMytxEmail"
                    type="email"
                    value={formData.notMytxEmail}
                    onChange={handleInputChange}
                    placeholder="Enter your external email"
                    disabled={isSaving}
                    className="bg-gray-800/50 border-cyan-500/20 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/30"
                  />
                  <p className="text-xs text-gray-500">Your personal or business email address</p>
                </div>

                {/* Plan Display */}
                <div className="space-y-2 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-gray-400">Current Plan</p>
                  <p className="text-lg font-bold text-purple-400">{profile.subscription.toUpperCase()}</p>
                </div>

                {/* Error and Success Messages */}
                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-300">Profile updated successfully!</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-cyan-500/10">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    disabled={isSaving}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              // View-only mode for other users' profiles
              <div className="space-y-8">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center gap-6 pb-8 border-b border-cyan-500/10">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-1">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-cyan-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                {formData.fullName && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <p className="text-white">{formData.fullName}</p>
                  </div>
                )}

                {/* Phone Number */}
                {formData.phoneNumber && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <p className="text-white">{formData.phoneNumber}</p>
                  </div>
                )}

                {/* External Email */}
                {formData.notMytxEmail && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
                      <Mail className="w-4 h-4" />
                      External Email Address
                    </label>
                    <p className="text-white">{formData.notMytxEmail}</p>
                  </div>
                )}

                {/* Plan Display */}
                <div className="space-y-2 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-gray-400">Plan</p>
                  <p className="text-lg font-bold text-purple-400">{profile.subscription.toUpperCase()}</p>
                </div>

                {/* Back Button */}
                <div className="pt-4 border-t border-cyan-500/10">
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                  >
                    Go Back
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
    </div>
  );
}
