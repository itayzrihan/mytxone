import { useChat } from "ai/react";
import { Globe, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MeditationLanguageSelectorProps {
  type: string;
  intention?: string;
  chatHistory?: string;
  chatId?: string;
}

export function MeditationLanguageSelector({ 
  type, 
  intention, 
  chatHistory, 
  chatId 
}: MeditationLanguageSelectorProps) {
  const chat = useChat({
    id: chatId || 'default-id',
    body: chatId ? { id: chatId } : undefined,
    maxSteps: 5,
  });

  const hasChatId = Boolean(chatId);

  const handleLanguageSelection = (language: 'hebrew' | 'english') => {
    if (hasChatId && chat) {
      const baseContent = intention 
        ? `Please create a ${type} meditation with this intention: "${intention}"` 
        : `Please create a ${type} meditation based on our recent conversation and interactions.`;
      
    const languageInstruction = language === 'hebrew' 
      ? ' צּוֹר אֶת תֹּכֶן הַמֶּדִיטַצְיָה בְּעִבְרִית עִם נִקּוּד מָלֵא לְכָל מִלָּה.'
      : ' Generate the meditation content in English.';
      
      chat.append({
        role: "user",
        content: baseContent + languageInstruction,
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="mr-2 size-5 text-blue-500" />
          Choose Language / בחר שפה
        </CardTitle>
        <CardDescription>
          Select the language for your {type} meditation.
          <br />
          בחר את השפה לעשות המדיטציה שלך.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full h-auto min-h-fit p-4 flex flex-col items-start space-y-2 hover:bg-accent/50 transition-colors text-wrap"
          onClick={() => handleLanguageSelection('hebrew')}
        >
          <div className="flex items-center space-x-2 w-full">
            <MessageSquare className="size-5 text-blue-600 flex-shrink-0" />
            <span className="font-medium text-left">עברית (Hebrew)</span>
          </div>          <p className="text-sm text-muted-foreground text-left w-full whitespace-normal">
הַמֵּדִיטַצְיָה תִּוָּצֵר בְּעִבְרִית עִם נִקּוּד מָלֵא לְכָל מִלָּה לַהֲקָלַת הַקְּרִיאָה וַהֲגִיָּה.

            <br />
            The meditation will be generated in Hebrew with complete niqqud (vowel marks) for enhanced readability and pronunciation.
          </p>
        </Button>

        <Button
          variant="outline"
          className="w-full h-auto min-h-fit p-4 flex flex-col items-start space-y-2 hover:bg-accent/50 transition-colors text-wrap"
          onClick={() => handleLanguageSelection('english')}
        >
          <div className="flex items-center space-x-2 w-full">
            <MessageSquare className="size-5 text-green-600 flex-shrink-0" />
            <span className="font-medium text-left">English</span>
          </div>
          <p className="text-sm text-muted-foreground text-left w-full whitespace-normal">
            The meditation will be generated in English language.
            <br />
            המדיטציה תיווצר בשפה האנגלית.
          </p>
        </Button>
      </CardContent>
    </Card>
  );
}
