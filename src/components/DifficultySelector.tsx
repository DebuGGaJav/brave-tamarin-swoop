import { useState } from "react";
import { Star, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DifficultySelectorProps {
  onSelect: (level: "easy" | "medium" | "hard") => void;
  currentLevel: "easy" | "medium" | "hard";
}

export const DifficultySelector = ({ onSelect, currentLevel }: DifficultySelectorProps) => {
  const levels = [
    {
      id: "easy" as const,
      name: "Kolay",
      icon: <Star className="w-6 h-6" />,
      description: "1-5 arası sayılar",
      color: "bg-green-100 text-green-700"
    },
    {
      id: "medium" as const,
      name: "Orta",
      icon: <Brain className="w-6 h-6" />,
      description: "1-10 arası sayılar",
      color: "bg-yellow-100 text-yellow-700"
    },
    {
      id: "hard" as const,
      name: "Zor",
      icon: <Zap className="w-6 h-6" />,
      description: "1-20 arası sayılar",
      color: "bg-red-100 text-red-700"
    }
  ];

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-center text-lg">Zorluk Seviyesi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {levels.map((level) => (
            <Button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`flex flex-col items-center p-4 h-auto ${
                currentLevel === level.id
                  ? level.color + " ring-2 ring-offset-2"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {level.icon}
              <span className="text-sm mt-1">{level.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};