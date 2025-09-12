"use client";

import { useChat, type Message } from "ai/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { cn, generateUUID } from "@/lib/utils";

import { Message as PreviewMessage } from "./message";
import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";
import { useScrollToBottom } from "./use-scroll-to-bottom";

// Extend the Message type to include attachments
interface ExtendedMessage extends Message {
  attachments?: Array<any>;
  experimental_attachments?: Array<any>;
}

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const path = usePathname();
  const [chatId, setChatId] = useState(id ?? generateUUID());
  const [attachments, setAttachments] = useState<Array<any>>([]);
  const [remainingMessages, setRemainingMessages] = useState<number | null>(null);
  const [dailyLimit, setDailyLimit] = useState<number | null>(null);
  
  // Use the scroll hook
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  const {
    messages,
    input,
    setInput,
    isLoading,
    stop,
    append,
    handleSubmit,
  } = useChat({
    api: '/aichat/api/chat', // Use the new API endpoint
    initialMessages,
    id: chatId,
    body: {
      id: chatId,
    },
    onResponse(response) {
      // Read rate limit headers
      const remaining = response.headers.get("X-RateLimit-Remaining");
      const limit = response.headers.get("X-RateLimit-Limit");
      
      if (remaining) {
        setRemainingMessages(parseInt(remaining, 10));
      }
      if (limit) {
        setDailyLimit(parseInt(limit, 10));
      }

      if (response.status === 401) {
        toast.error(response.statusText);
      } else if (response.status === 429) {
        toast.error("Rate limit exceeded. Please try again later.");
      }
    },
    onFinish() {
      // Update URL immediately when chat finishes (first message or any message)
      // Check if we're on the general /aichat page (not already on a specific chat page)
      if (path === "/aichat" || !path.includes("/aichat/chat/")) {
        window.history.pushState({}, "", `/aichat/chat/${chatId}`);
      }
      
      // Trigger a refresh of the history sidebar to show the new chat
      // This dispatches a custom event that the history component can listen to
      window.dispatchEvent(new CustomEvent('chatSaved', { detail: { chatId } }));
    },
    onError(error) {
      if (error.message.includes('400')) {
        toast.error(`Input exceeds the maximum length allowed.`);
      } else if (!error.message.includes('429')) {
        toast.error("An error occurred. Please try again.");
      }
      console.error("Chat error:", error);
    },
  });

  // Reset counters when chat ID changes
  useEffect(() => {
    if (id !== chatId) {
      setRemainingMessages(null);
      setDailyLimit(null);
      setChatId(id ?? generateUUID());
    }
  }, [id, chatId]);

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 h-full w-dvw items-center overflow-y-scroll"
        >
          {messages.length === 0 && <Overview />}

          {messages.map((message) => (
            <PreviewMessage
              key={message.id || `${chatId}-${message.role}-${message.content.substring(0, 10)}`}
              chatId={chatId}
              role={message.role}
              content={message.content}
              attachments={(message as ExtendedMessage).experimental_attachments}
              toolInvocations={message.toolInvocations}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        <div className="w-full md:max-w-[500px] max-w-[calc(100dvw-32px)] px-4 md:px-0">
          {/* Display message counter when available */}
          {remainingMessages !== null && dailyLimit !== null && (
            <div className="text-center text-xs text-muted-foreground mb-1">
              {remainingMessages} / {dailyLimit} messages remaining today
            </div>
          )}
          
          <form className="flex flex-row gap-2 relative items-end w-full">
            <MultimodalInput
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              append={append}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
