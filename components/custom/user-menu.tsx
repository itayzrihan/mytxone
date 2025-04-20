// filepath: components/custom/user-menu.tsx
"use client";

import { Session } from "next-auth";
import { logout } from "@/app/(auth)/actions"; // Import the server action
import { useState, useEffect } from "react";
import {
  getApiKeysForUser,
  createApiKey,
  deleteApiKey,
} from "@/app/(auth)/actions"; // Import API key actions

import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";
import { Input } from "../ui/input"; // Import Input
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog"; // Import Dialog components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator, // Import Separator
} from "../ui/dropdown-menu";
import { Loader2, Trash2, Copy } from "lucide-react"; // Import icons

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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="py-1.5 px-2 h-fit font-normal"
            variant="secondary"
          >
            {session.user?.email}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56"> {/* Increased width */}
          <DropdownMenuItem className="p-0"> {/* Remove padding */}
            <ThemeToggle />
          </DropdownMenuItem>
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
              <code className="flex-grow break-all text-sm">{newKeyInfo.key}</code>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(newKeyInfo.key)}>
                <Copy className="h-4 w-4" />
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
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
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : apiKeys.length === 0 && !error ? (
            <p className="text-sm text-muted-foreground">You haven't created any API keys yet.</p>
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
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
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