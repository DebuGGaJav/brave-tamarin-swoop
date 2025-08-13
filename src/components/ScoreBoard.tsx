import { useState, useEffect } from "react";
import { Star, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ScoreBoardProps {
  correctAnswers: number;
  totalQuestions: number;
}

export const ScoreBoard = ({ correctAnswers, totalQuestions }: ScoreBoardProps) => {
  const [stars, setStars] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const newStars = Math.floor(correctAnswers / 3);
    if (newStars > stars) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 1000);
    }
    setStars(newStars);
  }, [correctAnswers, stars]);

  const getTrophyColor = () => {
    if (totalQuestions === 0) return "text-gray-400";
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage >= 80) return "text-yellow-500";
    if (percentage >= 60) return "text-blue-500";
    if (percentage >= 40) return "text-green-500";
    return "text-gray-400";
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Trophy className={`w-6 h-6 ${getTrophyColor()}`} />
            <span className="text-lg font-bold">{correctAnswers}/{totalQuestions}</span>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= stars
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                } ${showAnimation && star === stars ? "animate-bounce" : ""}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};