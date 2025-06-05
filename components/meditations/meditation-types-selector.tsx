import { useChat } from "ai/react";
import { Brain, Heart, Moon, Lotus, Sparkles, Wind, MessageSquare, Target, User, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  },
  {
    type: "mindfulness",
    title: "Mindfulness",
    description: "Present moment awareness and observation",
    icon: Lotus,
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
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lotus className="mr-2 size-6 text-green-500" />
          Choose Your Meditation Type
        </CardTitle>
        <CardDescription>
          Select the type of meditation that resonates with your current needs and intentions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meditationTypes.map((meditation) => {
            const IconComponent = meditation.icon;
            return (
              <Button
                key={meditation.type}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-accent/50 transition-colors"
                onClick={() => handleTypeSelection(meditation.type, meditation.title)}
              >
                <div className="flex items-center space-x-2 w-full">
                  <IconComponent className={`size-5 ${meditation.color}`} />
                  <span className="font-medium text-left">{meditation.title}</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  {meditation.description}
                </p>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
