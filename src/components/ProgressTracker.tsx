import { useState, useEffect } from "react";
import { Trophy, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  topic: string;
  correctAnswers: number;
  totalQuestions: number;
}

export default function ProgressTracker({ topic, correctAnswers, totalQuestions }: ProgressTrackerProps) {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (totalQuestions > 0 && correctAnswers === totalQuestions && totalQuestions % 5 === 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  }, [correctAnswers, totalQuestions]);

  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center">
          <Target className="w-5 h-5 mr-2" />
          {topic} İlerleme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Doğru Cevaplar</span>
              <span>{correctAnswers}/{totalQuestions}</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
          
          <div className="flex justify-center items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
              <div className="text-xs text-gray-500">Başarı Oranı</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-xs text-gray-500">Doğru</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
              <div className="text-xs text-gray-500">Yanlış</div>
            </div>
          </div>

          {showCelebration && (
            <div className="text-center text-yellow-500 animate-bounce">
              <Trophy className="w-8 h-8 mx-auto" />
              <p className="text-sm font-bold">Harika! Devam et!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}