"use client";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import cx from "classnames";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { Chat } from "@/db/schema";
import { fetcher, getTitleFromChat } from "@/lib/utils";
import { useAuth } from "./auth-context";
import { useAdmin } from "@/contexts/admin-context";
import { useUserPlan } from "./user-plan-context";

import {
  CalendarIcon,
  FileIcon,
  InfoIcon,
  InfographicIcon,
  MenuIcon,
  MoreHorizontalIcon,
  PencilEditIcon,
  TrashIcon,
  UsersIcon,
  WorkflowIcon,
  ShareIcon,
} from "./icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

export const History = ({ user }: { user: User | undefined }) => {
  const { id } = useParams();
  const pathname = usePathname();
  const { openAuthModal } = useAuth();
  const { shouldShowAdminElements, viewMode } = useAdmin();
  const { userPlan } = useUserPlan();

  // Check if the current path is in the aichat section
  const isInAiChatSection = pathname === '/aichat' || pathname.startsWith('/aichat/');

  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const {
    data: history,
    isLoading,
    mutate,
  } = useSWR<Array<Chat>>(user ? "/aichat/api/history" : null, fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  // Listen for chat save events to refresh history
  useEffect(() => {
    const handleChatSaved = () => {
      mutate();
    };

    window.addEventListener('chatSaved', handleChatSaved);
    return () => {
      window.removeEventListener('chatSaved', handleChatSaved);
    };
  }, [mutate]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    const deletePromise = fetch(`/aichat/api/chat?id=${deleteId}`, {
      method: "DELETE",
    });

    toast.promise(deletePromise, {
      loading: "Deleting chat...",
      success: () => {
        mutate((history) => {
          if (history) {
            return history.filter((h) => h.id !== id);
          }
        });
        return "Chat deleted successfully";
      },
      error: "Failed to delete chat",
    });

    setShowDeleteDialog(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className="p-1.5 h-fit bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 text-white"
        onClick={() => {
          setIsHistoryVisible(true);
        }}
      >
        <MenuIcon />
      </Button>

      <Sheet
        open={isHistoryVisible}
        onOpenChange={(state) => {
          setIsHistoryVisible(state);
        }}
      >
        <SheetContent side="left" className="p-3 w-80 bg-black/80 backdrop-blur-xl border-r border-white/20 shadow-2xl shadow-black/50">
          <SheetHeader>
            <VisuallyHidden.Root>
              <SheetTitle className="text-left">History</SheetTitle>
              <SheetDescription className="text-left">
                {history === undefined ? "loading" : history.length} chats
              </SheetDescription>
            </VisuallyHidden.Root>
          </SheetHeader>

          <div className="text-sm flex flex-row items-center justify-between">
            <div className="flex flex-row gap-2">
              <div className="text-cyan-300 font-medium">Navigation</div>
              {isInAiChatSection && (
                <>
                  <div className="text-cyan-300 font-medium">• History</div>
                  <div className="text-zinc-400">
                    {history === undefined ? "loading" : history.length} chats
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-10 flex flex-col">
            {/* Admin-only buttons */}
            {shouldShowAdminElements && viewMode === "admin" && (
              <>
                <Button
                  className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                  asChild
                >
                  <Link href="/social/upload-video">
                    <div>Social Media Manager</div>
                    <ShareIcon size={14} />
                  </Link>
                </Button>
                <Button
                  className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                  asChild
                >
                  <Link href="/infographic">
                    <div>Generate new infographic</div>
                    <InfographicIcon size={14} />
                  </Link>
                </Button>
                <Button
                  className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                  asChild
                >
                  <Link href="/workflows">
                    <div>Marketing Workflows</div>
                    <WorkflowIcon size={14} />
                  </Link>
                </Button>
                <Button
                  className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                  asChild
                >
                  <Link href="/quotes">
                    <div>Quote Proposals</div>
                    <FileIcon size={14} />
                  </Link>
                </Button>
                <Button
                  className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                  asChild
                >
                  <Link href="/mytx/create-community">
                    <div>Create community</div>
                    <UsersIcon size={14} />
                  </Link>
                </Button>
                <Button
                  className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                  asChild
                >
                  <Link href="/scripts">
                    <div>Scripts</div>
                    <FileIcon size={14} />
                  </Link>
                </Button>
                <Button
                  className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                  asChild
                >
                  <Link href="/prompts">
                    <div>Prompt Engineering</div>
                    <FileIcon size={14} />
                  </Link>
                </Button>
                <Button
                  className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                  asChild
                >
                  <Link href="/hosting">
                    <div>Hosting Plans</div>
                    <InfoIcon size={14} />
                  </Link>
                </Button>
                <Button
                  className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                  asChild
                >
                  <Link href="/caricature">
                    <div>Caricature</div>
                    <FileIcon size={14} />
                  </Link>
                </Button>
                <Button
                  className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                  asChild
                >
                  <Link href="/odh">
                    <div>ODH</div>
                    <FileIcon size={14} />
                  </Link>
                </Button>
              </>
            )}

            {/* Always visible buttons */}
            <Button
              className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
              asChild
            >
              <Link href="/communities">
                <div>Communities</div>
                <UsersIcon size={14} />
              </Link>
            </Button>
            <Button
              className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
              asChild
            >
              <Link href="/owned-meetings">
                <div>My Meetings</div>
                <CalendarIcon size={14} />
              </Link>
            </Button>
            <Button
              className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
              asChild
            >
              <Link href="/attending-meetings">
                <div>Attending Meetings</div>
                <CalendarIcon size={14} />
              </Link>
            </Button>
            <Button
              className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
              asChild
            >
              <Link href={userPlan === "basic" || userPlan === "pro" ? "/owned-meetings" : "/mytx/create-meeting"}>
                <div>Create new meeting</div>
                <CalendarIcon size={14} />
              </Link>
            </Button>
            <Button
              className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
              asChild
            >
              <Link href="/mytx-hosting">
                <div>Hosting</div>
                <ShareIcon size={14} />
              </Link>
            </Button>
            <Button
              className="font-normal text-sm flex flex-row justify-between text-white mb-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
              asChild
            >
              <Link href="/about">
                <div>About us</div>
                <InfoIcon size={14} />
              </Link>
            </Button>
            
            {/* Admin-only buttons */}
            {user && shouldShowAdminElements && viewMode === "admin" && (
              <Button
                className="font-normal text-sm flex flex-row justify-between text-white bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300"
                asChild
              >
                <Link href="/aichat">
                  <div>Start a new chat</div>
                  <PencilEditIcon size={14} />
                </Link>
              </Button>
            )}

            {isInAiChatSection && (
              <div className="flex flex-col overflow-y-scroll p-1 h-[calc(100dvh-124px)]">
                {!user ? (
                  <div className="text-zinc-400 h-dvh w-full flex flex-col justify-center items-center text-sm gap-4">
                    <div className="flex flex-row gap-2 items-center">
                      <InfoIcon />
                      <div>Login to save and revisit previous chats!</div>
                    </div>
                    <div className="flex flex-col gap-2 w-full max-w-xs">
                      <Button
                        className="font-normal text-sm text-white bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300"
                        onClick={() => openAuthModal("login")}
                      >
                        Sign In
                      </Button>
                      <Button
                        className="font-normal text-sm text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                        onClick={() => openAuthModal("register")}
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                ) : null}

                {!isLoading && history?.length === 0 && user ? (
                  <div className="text-zinc-400 h-dvh w-full flex flex-row justify-center items-center text-sm gap-2">
                    <InfoIcon />
                    <div>No chats found</div>
                  </div>
                ) : null}

                {isLoading && user ? (
                  <div className="flex flex-col">
                    {[44, 32, 28, 52].map((item) => (
                      <div key={item} className="p-2 my-[2px]">
                        <div
                          className={`w-${item} h-[20px] rounded-md bg-white/10 animate-pulse`}
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {history &&
                  history.map((chat) => (
                  <div
                    key={chat.id}
                    className={cx(
                      "flex flex-row items-center gap-6 hover:bg-white/10 backdrop-blur-sm rounded-lg pr-2 border border-transparent transition-all duration-200",
                      { "bg-white/10 backdrop-blur-md border-white/20 shadow-lg": chat.id === id },
                    )}
                  >
                    <Button
                      variant="ghost"
                      className={cx(
                        "hover:bg-transparent justify-between p-0 text-sm font-normal flex flex-row items-center gap-2 pr-2 w-full transition-none text-white",
                      )}
                      asChild
                    >
                      <Link
                        href={`/aichat/chat/${chat.id}`}
                        className="text-ellipsis overflow-hidden text-left py-2 pl-2 rounded-lg outline-cyan-400"
                      >
                        {getTitleFromChat(chat)}
                      </Link>
                    </Button>

                    <DropdownMenu modal={true}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="p-0 h-fit font-normal text-zinc-400 transition-none hover:bg-white/10 hover:text-white rounded-lg"
                          variant="ghost"
                        >
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left" className="z-[60] bg-black/90 backdrop-blur-md border-white/20">
                        <DropdownMenuItem asChild>
                          <Button
                            className="flex flex-row gap-2 items-center justify-start w-full h-fit font-normal p-1.5 rounded-sm text-white hover:bg-white/10"
                            variant="ghost"
                            onClick={() => {
                              setDeleteId(chat.id);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <TrashIcon />
                            <div>Delete</div>
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              chat and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
