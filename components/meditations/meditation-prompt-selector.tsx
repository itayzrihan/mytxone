import { useChat } from "ai/react";
import { MessageCircle, Edit3, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MeditationPromptSelectorProps {
  type: string;
  chatId?: string;
}

export function MeditationPromptSelector({ type, chatId }: MeditationPromptSelectorProps) {
  const chat = useChat({
    id: chatId || 'default-id',
    body: chatId ? { id: chatId } : undefined,
    maxSteps: 5,
  });

  const hasChatId = Boolean(chatId);

  const handleChatHistoryOption = () => {
    if (hasChatId && chat) {
      chat.append({
        role: "user",
        content: `Please create a ${type} meditation based on our recent conversation and interactions.`,
      });
    }
  };

  const handleCustomIntentionOption = () => {
    if (hasChatId && chat) {
      chat.append({
        role: "user",
        content: `I want to create a ${type} meditation with a custom intention. Please ask me what specific intention, goal, or focus I'd like for this meditation.`,
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 size-5 text-purple-500" />
          Personalize Your {type.charAt(0).toUpperCase() + type.slice(1)} Meditation
        </CardTitle>        <CardDescription>
          Choose how you&apos;d like to create your meditation content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">        <Button
          variant="outline"
          className="w-full h-auto min-h-fit p-4 flex flex-col items-start space-y-2 hover:bg-accent/50 transition-colors text-wrap"
          onClick={handleChatHistoryOption}
        >
          <div className="flex items-center space-x-2 w-full">
            <MessageCircle className="size-5 text-blue-500 flex-shrink-0" />
            <span className="font-medium text-left">Based on Our Conversation</span>
          </div>
          <p className="text-sm text-muted-foreground text-left w-full whitespace-normal">
            Create a meditation tailored to our recent chat history and the topics we&apos;ve discussed.
          </p>
        </Button>        <Button
          variant="outline"
          className="w-full h-auto min-h-fit p-4 flex flex-col items-start space-y-2 hover:bg-accent/50 transition-colors text-wrap"
          onClick={handleCustomIntentionOption}
        >
          <div className="flex items-center space-x-2 w-full">
            <Edit3 className="size-5 text-green-500 flex-shrink-0" />
            <span className="font-medium text-left">Custom Intention</span>
          </div>
          <p className="text-sm text-muted-foreground text-left w-full whitespace-normal">
            Provide your own specific intention, goal, or focus area for a personalized meditation.
          </p>
        </Button>
      </CardContent>
    </Card>
  );
}
