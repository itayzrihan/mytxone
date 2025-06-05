import { useChat } from "ai/react";
import { Trash2, Eye, Clock, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Meditation {
  meditationId: string;
  type: string;
  title: string;
  duration?: string;
  createdAt: string;
}

interface ListMeditationsProps {
  meditations: Meditation[];
  chatId?: string;
}

export function ListMeditations({ meditations, chatId }: ListMeditationsProps) {
  const chat = useChat({
    id: chatId || 'default-id',
    body: chatId ? { id: chatId } : undefined,
    maxSteps: 5,
  });

  const hasChatId = Boolean(chatId);

  const handleViewMeditation = (meditation: Meditation) => {
    if (hasChatId && chat) {
      chat.append({
        role: "user",
        content: `Please show me the full content of my meditation "${meditation.title}"`,
      });
    }
  };

  const handleDeleteMeditation = (meditation: Meditation) => {
    if (hasChatId && chat) {
      chat.append({
        role: "user",
        content: `Please delete my meditation "${meditation.title}"`,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 size-6 text-purple-500" />
          Your Meditation Collection
        </CardTitle>
        <CardDescription>
          {meditations.length > 0
            ? `You have ${meditations.length} saved meditation${meditations.length !== 1 ? 's' : ''}.`
            : "You haven't saved any meditations yet."}
        </CardDescription>
      </CardHeader>
      {meditations.length > 0 && (
        <CardContent>
          <div className="space-y-3">
            {meditations.map((meditation) => (
              <div 
                key={meditation.meditationId} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium truncate">{meditation.title}</h4>
                    {meditation.duration && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 size-3" />
                        {meditation.duration}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <span className="capitalize">{meditation.type}</span>
                    <span>•</span>
                    <span>{formatDate(meditation.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewMeditation(meditation)}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="size-4" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMeditation(meditation)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
