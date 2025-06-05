import { CheckCircle, Heart, Trash2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MeditationConfirmationProps {
  meditationId: string;
  title?: string;
  type?: string;
  status: 'created' | 'deleted';
}

export function MeditationConfirmation({ 
  meditationId, 
  title, 
  type, 
  status 
}: MeditationConfirmationProps) {
  const isCreated = status === 'created';
  const isDeleted = status === 'deleted';

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          {isCreated ? (
            <>
              <CheckCircle className="mr-2 size-5 text-green-500" />
              Meditation Saved
            </>
          ) : (
            <>
              <Trash2 className="mr-2 size-5 text-red-500" />
              Meditation Deleted
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isCreated
            ? `Your ${type} meditation "${title}" has been saved successfully.`
            : `The meditation has been deleted from your collection.`}
        </CardDescription>
      </CardHeader>
      {/* Optionally add more details or actions here */}
      {/* <CardContent>
        <p className="text-xs text-muted-foreground">Meditation ID: {meditationId}</p>
      </CardContent> */}
    </Card>
  );
}
