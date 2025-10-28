"use client";

import { Loader2, Trash2, Copy, Shield, Eye, EyeOff, Crown } from "lucide-react";
import { Session } from "next-auth";
import { useState, useEffect } from "react";
import Link from "next/link";

import {
  logout,
  getApiKeysForUser,
  createApiKey,
  deleteApiKey,
} from "@/app/(auth)/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { ThemeToggle } from "./theme-toggle";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { useUserPlan } from "./user-plan-context";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

interface UserMenuProps {
  session: Session; // Pass session data from the server component
}

// Define type for API Key data fetched from server action
type ApiKeyInfo = {
  id: string;
  name: string | null;
  createdAt: Date | null;
  lastUsedAt: Date | null;
};

export function UserMenu({ session }: UserMenuProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [isDeletingKey, setIsDeletingKey] = useState<string | null>(null); // Store ID of key being deleted
  const [newKeyInfo, setNewKeyInfo] = useState<{ key: string; name: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState(""); // State for the new key name input
  const [isTogglingPlan, setIsTogglingPlan] = useState(false); // State for plan toggle loading

  // Use the centralized admin status hook
  const { shouldShowViewModeToggle, viewMode, isLoading: isCheckingAdmin } = useAdminStatus(session.user?.id);
  const { userPlan, refreshPlan, isLoading: isPlanLoading } = useUserPlan();

  // Initialize display plan state - will be set once context loads
  const [displayPlan, setDisplayPlan] = useState<"free" | "basic" | "pro">("free");

  // Update display plan whenever userPlan changes from context
  useEffect(() => {
    if (userPlan && !isPlanLoading) {
      console.log('Syncing display plan with context:', userPlan);
      setDisplayPlan(userPlan);
    }
  }, [userPlan, isPlanLoading]);

  // Monitor userPlan changes
  useEffect(() => {
    console.log('userPlan updated in useUserPlan hook:', userPlan);
  }, [userPlan]);

  // Handle view mode toggle events
  useEffect(() => {
    const handleToggleViewMode = async () => {
      try {
        const newMode = viewMode === 'admin' ? 'user' : 'admin';

        const response = await fetch('/api/auth/view-mode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: newMode }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to toggle view mode');
          return;
        }

        // The hook will automatically update the viewMode state
        setError(null);
      } catch (error) {
        console.error('Error toggling view mode:', error);
        setError('Failed to toggle view mode');
      }
    };

    window.addEventListener('toggle-view-mode', handleToggleViewMode);
    return () => window.removeEventListener('toggle-view-mode', handleToggleViewMode);
  }, [viewMode]);

  // Extract username from email (part before @)
  const getUsername = (email: string | null | undefined) => {
    if (!email) return '';
    return email.split('@')[0];
  };

  // Fetch keys when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      fetchKeys();
      setNewKeyInfo(null); // Clear any previously generated key
      setError(null); // Clear previous errors
      setNewKeyName(""); // Clear name input
    }
  }, [isDialogOpen]);

  const fetchKeys = async () => {
    setIsLoadingKeys(true);
    setError(null);
    const result = await getApiKeysForUser();
    if (result.error) {
      setError(result.error);
      setApiKeys([]);
    } else {
      // Ensure dates are Date objects
      const formattedKeys = result.keys.map(key => ({
        ...key,
        createdAt: key.createdAt ? new Date(key.createdAt) : null,
        lastUsedAt: key.lastUsedAt ? new Date(key.lastUsedAt) : null,
      }));
      setApiKeys(formattedKeys);
    }
    setIsLoadingKeys(false);
  };

  const handleCreateKey = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreatingKey(true);
    setError(null);
    setNewKeyInfo(null);

    const formData = new FormData(event.currentTarget);
    const result = await createApiKey(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success && result.newKey) {
      setNewKeyInfo({ key: result.newKey, name: result.name || null });
      setNewKeyName(""); // Clear input after creation
      await fetchKeys(); // Refresh the list
    }
    setIsCreatingKey(false);
  };

  const handleDeleteKey = async (keyId: string) => {
    setIsDeletingKey(keyId);
    setError(null);
    const formData = new FormData();
    formData.append("keyId", keyId);
    const result = await deleteApiKey(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      await fetchKeys(); // Refresh the list
    }
    setIsDeletingKey(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Optional: Show a temporary success message/indicator
      console.log("Copied to clipboard");
    }).catch(err => {
      console.error("Failed to copy:", err);
      setError("Failed to copy key to clipboard.");
    });
  };

  const handleTogglePlan = async () => {
    const plans = ['free', 'basic', 'pro'] as const;
    const currentIndex = plans.indexOf(displayPlan);
    const nextPlan = plans[(currentIndex + 1) % plans.length];

    console.log('=== PLAN TOGGLE STARTED ===');
    console.log('Current plan from display state:', displayPlan);
    console.log('Next plan to set:', nextPlan);

    setIsTogglingPlan(true);
    setError(null);

    try {
      // Step 1: Update the plan on the server
      console.log('Step 1: Sending PUT request to update plan to:', nextPlan);
      const updateResponse = await fetch('/api/user/plan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: nextPlan }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error('PUT request failed:', errorData);
        setError(errorData.error || 'Failed to update plan');
        setIsTogglingPlan(false);
        return;
      }

      const updateData = await updateResponse.json();
      console.log('Step 1 SUCCESS: API response:', updateData);

      // Step 2: Immediately update the display state
      console.log('Step 2: Updating display plan to:', nextPlan);
      setDisplayPlan(nextPlan);

      // Step 3: Wait a moment for database to ensure the update is written
      console.log('Step 3: Waiting 300ms for database write...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Step 4: Refresh the plan context to fetch the updated plan
      console.log('Step 4: Calling refreshPlan()...');
      await refreshPlan();
      
      console.log('Step 4 SUCCESS: Plan refresh complete');
      console.log('=== PLAN TOGGLE COMPLETED ===');
      setError(null);
    } catch (error) {
      console.error('Error updating plan:', error);
      setError('Failed to update plan');
      // Revert display plan on error
      setDisplayPlan(displayPlan);
    } finally {
      setIsTogglingPlan(false);
    }
  };  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="py-1.5 px-2 h-fit font-normal bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            variant="ghost"
          >
            {getUsername(session.user?.email)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56"> {/* Increased width */}
          <DropdownMenuItem className="p-0"> {/* Remove padding */}
            <ThemeToggle />
          </DropdownMenuItem>
          <DropdownMenuSeparator /> {/* Separator */}
          
          {/* View Mode Toggle - Only show for admin users */}
          {!isCheckingAdmin && shouldShowViewModeToggle && (
            <>
              <DropdownMenuItem 
                className="cursor-pointer flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                onClick={() => {
                  // Dispatch the toggle event handled by the navbar (which validates and toggles)
                  window.dispatchEvent(new CustomEvent('toggle-view-mode'));
                }}
              >
                {viewMode === 'admin' ? (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Switch to User View</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Back to Admin View</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Plan Toggle - Only show for admin users */}
          {!isCheckingAdmin && shouldShowViewModeToggle && (
            <>
              <DropdownMenuItem 
                className={`cursor-pointer flex items-center gap-2 ${
                  isTogglingPlan 
                    ? 'text-purple-300/50 pointer-events-none' 
                    : 'text-purple-400 hover:text-purple-300'
                }`}
                onClick={() => !isTogglingPlan && handleTogglePlan()}
              >
                <Crown className="w-4 h-4" />
                <span>
                  {isTogglingPlan ? (
                    <>
                      <Loader2 className="w-3 h-3 inline mr-1 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>Plan: {displayPlan.toUpperCase()}</>
                  )}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          {/* Profile Link */}
          <Link href={`/user/${session.user?.email?.split('@')[0]}`}>
            <DropdownMenuItem className="cursor-pointer">
              My Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator /> {/* Separator */}
          
          {/* Use DialogTrigger for the API Keys item */}
          <DialogTrigger asChild>
            <DropdownMenuItem className="cursor-pointer">
              Manage API Keys
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator /> {/* Separator */}
          <DropdownMenuItem className="p-0 text-red-500 focus:text-red-600 focus:bg-red-50"> {/* Remove padding & style */}
            <form
              className="w-full"
              action={logout} // Use the imported server action
            >
              <button
                type="submit"
                className="w-full text-left px-2 py-1.5" // Add padding back here
              >
                Sign out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog Content */}
      <DialogContent className="sm:max-w-[625px]"> {/* Wider dialog */}
        <DialogHeader>
          <DialogTitle>Manage API Keys</DialogTitle>
          <DialogDescription>
            Create and manage API keys to interact with the MyTX AI API from external applications.
            Treat your keys like passwords.
          </DialogDescription>
        </DialogHeader>

        {/* Display Newly Created Key */}
        {newKeyInfo && (
          <div className="mt-4 p-4 border border-green-500 bg-green-50 rounded-md">
            <p className="font-semibold text-green-700">New API Key Generated:</p>
            <p className="text-sm text-green-600 mb-2">
              Please copy this key now. You will not be able to see it again.
              {newKeyInfo.name && ` (Name: ${newKeyInfo.name})`}
            </p>
            <div className="flex items-center space-x-2 bg-muted p-2 rounded">
              <code className="grow break-all text-sm">{newKeyInfo.key}</code>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(newKeyInfo.key)}>
                <Copy className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Create New Key Form */}
        <form onSubmit={handleCreateKey} className="mt-4 space-y-2">
          <Input
            name="name"
            placeholder="Optional key name (e.g., 'My Integration')"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            disabled={isCreatingKey}
          />
          <Button type="submit" disabled={isCreatingKey}>
            {isCreatingKey ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Generating...
              </>
            ) : (
              "Generate New API Key"
            )}
          </Button>
        </form>

        {/* Display Existing Keys */}
        <div className="mt-6 space-y-3 max-h-60 overflow-y-auto pr-2"> {/* Scrollable area */}
          <h3 className="text-lg font-medium">Your Keys</h3>
          {isLoadingKeys ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : apiKeys.length === 0 && !error ? (
            <p className="text-sm text-muted-foreground">You haven&apos;t created any API keys yet.</p>
          ) : (
            apiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">{key.name || <span className="text-muted-foreground italic">Unnamed Key</span>}</p>
                  <p className="text-xs text-muted-foreground">
                    Created: {key.createdAt ? key.createdAt.toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last Used: {key.lastUsedAt ? key.lastUsedAt.toLocaleString() : 'Never'}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">ID: {key.id}</p> {/* Show ID */}
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteKey(key.id)}
                  disabled={isDeletingKey === key.id}
                  aria-label="Delete API Key"
                >
                  {isDeletingKey === key.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Error Display */}
        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}