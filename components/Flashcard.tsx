"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

// This component's props are for the FRONT and BACK of a SINGLE card.
interface FlashcardProps {
  front: React.ReactNode;
  back: React.ReactNode;
}

export default function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full h-64 [perspective:1000px] cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700",
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        )}
      >
        {/* Front of the card */}
        <Card className="absolute w-full h-full [backface-visibility:hidden] flex flex-col justify-center items-center p-6">
          <CardContent className="text-center">
            <p className="text-xl font-semibold">{front}</p>
          </CardContent>
          <div className="absolute bottom-4 right-4 text-muted-foreground group-hover:text-primary transition-colors">
            <RefreshCw className="h-5 w-5" />
          </div>
        </Card>

        {/* Back of the card */}
        <Card className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-center items-center p-6 bg-secondary">
          <CardContent className="text-center">
            <p className="text-lg">{back}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
