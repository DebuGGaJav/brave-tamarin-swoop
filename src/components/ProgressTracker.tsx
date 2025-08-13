import { useState, useEffect } from "react";
import { Trophy, Target, CheckCircle, XCircle } from "lucide-react";
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

  const getProgressColor = () => {
    if (percentage >= 80) return "from-green-400 to-green-500";
    if (percentage >= 60) return "from-blue-400 to-blue-500";
    if (percentage >= 40) return "from-yellow-400 to-yellow-500";
    return "from-red-400 to-red-500";
  };

  const getLevelBadge = () => {
    if (percentage >= 80) return { text: "Uzman", color: "bg-green-500" };
    if (percentage >= 60) return { text: "İyi", color: "bg-blue-500" };
    if (percentage >= 40) return { text: "Orta", color: "bg-yellow-500" };
    return { text: "Başlangıç", color: "bg-red-500" };
  };

  const levelBadge = getLevelBadge();

  return (
    <Card className="mt-6 shadow-xl border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center text-xl font-bold text-purple-600">
          <Target className="w-6 h-6 mr-2 text-purple-500" />
          {topic} İlerleme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-3">
              <span className="font-medium text-gray-700">Doğru Cevaplar</span>
              <span className="font-bold text-gray-800">{correctAnswers}/{totalQuestions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${getProgressColor()}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
              <div className="text-xs text-blue-500 font-medium">Başarı Oranı</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-xs text-green-500 font-medium">Doğru</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
              <div className="text-3xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
              <div className="text-xs text-red-500 font-medium">Yanlış</div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className={`px-4 py-2 rounded-full text-white font-bold text-sm ${levelBadge.color}`}>
              {levelBadge.text}
            </div>
          </div>

          {showCelebration && (
            <div className="text-center animate-bounce">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-full shadow-lg">
                <Trophy className="w-6 h-6" />
                <span className="font-bold">Harika! Devam et!</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}