import { useState, useEffect } from "react";
import { Trophy, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  topic: string;
  correctAnswers: number;
  totalQuestions: number;
}

export const ProgressTracker = ({ topic, correctAnswers, totalQuestions }: ProgressTrackerProps) => {
  const [progress, setProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const newProgress = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    setProgress(newProgress);
    
    if (newProgress === 100) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [correctAnswers, totalQuestions]);

  const getLevel = () => {
    if (progress >= 80) return { name: "Uzman", color: "text-green-600" };
    if (progress >= 60) return { name: "İleri", color: "text-blue-600" };
    if (progress >= 40) return { name: "Orta", color: "text-yellow-600" };
    return { name: "Başlangıç", color: "text-gray-600" };
  };

  const level = getLevel();

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-center text-lg flex items-center justify-center">
          <Target className="w-5 h-5 mr-2" />
          {topic} İlerleme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>İlerleme</span>
              <span className={level.color}>{level.name}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span>Doğru: {correctAnswers}</span>
            <span>Toplam: {totalQuestions}</span>
            <span className="font-bold">{Math.round(progress)}%</span>
          </div>

          {showCelebration && (
            <div className="text-center text-green-600 font-bold animate-bounce">
              <Trophy className="w-6 h-6 inline mr-2" />
              Tebrikler! Bu konuyu tamamladın!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};