import { useChat } from "ai/react";
import { Brain, Heart, Moon, Flower, Sparkles, Wind, MessageSquare, Target, User, Layers, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MeditationTypesSelectorProps {
  chatId?: string;
}

const meditationTypes = [
  {
    type: "visualization",
    title: "Visualization",
    description: "Guided imagery and mental visualization",
    icon: Brain,
    color: "text-purple-500"
  },  {
    type: "mindfulness",
    title: "Mindfulness",
    description: "Present moment awareness and observation",
    icon: Flower,
    color: "text-green-500"
  },
  {
    type: "sleep story",
    title: "Sleep Story",
    description: "Calming narratives for peaceful sleep",
    icon: Moon,
    color: "text-blue-500"
  },
  {
    type: "loving kindness",
    title: "Loving Kindness",
    description: "Compassion and love meditation",
    icon: Heart,
    color: "text-pink-500"
  },
  {
    type: "chakra balancing",
    title: "Chakra Balancing",
    description: "Energy center alignment and healing",
    icon: Sparkles,
    color: "text-yellow-500"
  },
  {
    type: "breath awareness",
    title: "Breath Awareness",
    description: "Focus on breathing patterns and rhythms",
    icon: Wind,
    color: "text-cyan-500"
  },
  {
    type: "affirmations",
    title: "Affirmations",
    description: "Positive self-talk and empowerment",
    icon: MessageSquare,
    color: "text-orange-500"
  },
  {
    type: "concentration",
    title: "Concentration",
    description: "Single-pointed focus and attention training",
    icon: Target,
    color: "text-red-500"
  },
  {
    type: "body scan",
    title: "Body Scan",
    description: "Progressive relaxation and body awareness",
    icon: User,
    color: "text-indigo-500"
  },
  {
    type: "memory palace enhancement",
    title: "Memory Palace",
    description: "Cognitive enhancement and memory techniques",
    icon: Layers,
    color: "text-teal-500"
  }
];

export function MeditationTypesSelector({ chatId }: MeditationTypesSelectorProps) {
  const chat = useChat({
    id: chatId || 'default-id',
    body: chatId ? { id: chatId } : undefined,
    maxSteps: 5,
  });

  const hasChatId = Boolean(chatId);

  const handleTypeSelection = (type: string, title: string) => {
    if (hasChatId && chat) {
      chat.append({
        role: "user",
        content: `I want to create a ${type} meditation. Please show me options to either create it based on our chat history or let me provide a custom intention.`,
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>        <CardTitle className="flex items-center">
          <Flower className="mr-2 size-6 text-green-500" />
          Choose Your Meditation Type
        </CardTitle>
        <CardDescription>
          Select the type of meditation that resonates with your current needs and intentions.
        </CardDescription>
      </CardHeader>      <CardContent>        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {meditationTypes.map((meditation) => {
            const IconComponent = meditation.icon;
            return (
              <div key={meditation.type} className="relative">
                <Button
                  variant="outline"
                  className="w-full h-16 px-4 py-3 flex items-center justify-start space-x-3 hover:bg-accent/50 transition-colors relative"
                  onClick={() => handleTypeSelection(meditation.type, meditation.title)}
                >
                  <IconComponent className={`size-5 flex-shrink-0 ${meditation.color}`} />
                  <span className="font-medium text-left text-sm sm:text-base truncate pr-8">
                    {meditation.title}
                  </span>
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-accent/70 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <IconComponent className={`size-5 ${meditation.color}`} />
                        <span>{meditation.title}</span>
                      </DialogTitle>
                      <DialogDescription className="text-left">
                        {meditation.description}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
