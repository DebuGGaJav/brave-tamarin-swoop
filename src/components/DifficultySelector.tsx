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
      color: "bg-gradient-to-r from-green-400 to-green-500 text-white",
      borderColor: "border-green-400",
      hoverColor: "hover:from-green-500 hover:to-green-600"
    },
    {
      id: "medium" as const,
      name: "Orta",
      icon: <Brain className="w-6 h-6" />,
      description: "1-10 arası sayılar",
      color: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white",
      borderColor: "border-yellow-400",
      hoverColor: "hover:from-yellow-500 hover:to-yellow-600"
    },
    {
      id: "hard" as const,
      name: "Zor",
      icon: <Zap className="w-6 h-6" />,
      description: "1-20 arası sayılar",
      color: "bg-gradient-to-r from-red-400 to-red-500 text-white",
      borderColor: "border-red-400",
      hoverColor: "hover:from-red-500 hover:to-red-600"
    }
  ];

  return (
    <Card className="mb-6 shadow-xl border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold text-purple-600">Zorluk Seviyesi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {levels.map((level) => (
            <Button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`flex flex-col items-center p-4 h-auto space-y-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                currentLevel === level.id
                  ? `${level.color} ${level.borderColor} border-2 ring-2 ring-offset-2`
                  : "bg-gray-100 hover:bg-gray-200 border-2 border-gray-300"
              } ${level.hoverColor}`}
            >
              <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                {level.icon}
              </div>
              <span className="text-sm font-bold">{level.name}</span>
              <span className="text-xs opacity-90">{level.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};