import { useState, useEffect } from "react";
import { Star, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion"; // framer-motion import edildi

interface ScoreBoardProps {
  correctAnswers: number;
  totalQuestions: number;
}

export const ScoreBoard = ({ correctAnswers, totalQuestions }: ScoreBoardProps) => {
  const [stars, setStars] = useState(0);
  const [showStarAnimation, setShowStarAnimation] = useState(false);
  const [previousCorrectAnswers, setPreviousCorrectAnswers] = useState(correctAnswers);

  useEffect(() => {
    const newStars = Math.floor(correctAnswers / 3);
    if (newStars > stars) {
      setShowStarAnimation(true);
      setTimeout(() => setShowStarAnimation(false), 1000);
    }
    setStars(newStars);

    // Puan artışı animasyonu için
    if (correctAnswers > previousCorrectAnswers) {
      // Burada puan artışı animasyonu tetiklenebilir
      // Örneğin, puan div'ine bir sınıf ekleyip kaldırabiliriz
    }
    setPreviousCorrectAnswers(correctAnswers);
  }, [correctAnswers, stars, previousCorrectAnswers]);

  const getTrophyColor = () => {
    if (totalQuestions === 0) return "text-gray-400";
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage >= 80) return "text-yellow-500";
    if (percentage >= 60) return "text-blue-500";
    if (percentage >= 40) return "text-green-500";
    return "text-gray-400";
  };

  const getProgressColor = () => {
    if (totalQuestions === 0) return "bg-gray-300";
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage >= 80) return "bg-gradient-to-r from-yellow-400 to-yellow-500";
    if (percentage >= 60) return "bg-gradient-to-r from-blue-400 to-blue-500";
    if (percentage >= 40) return "bg-gradient-to-r from-green-400 to-green-500";
    return "bg-gradient-to-r from-gray-400 to-gray-500";
  };

  const progressPercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  return (
    <Card className="mb-6 shadow-xl border-2 border-purple-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-500">
              <Trophy className={`w-6 h-6 ${getTrophyColor()}`} />
            </div>
            <div>
              <motion.div
                key={correctAnswers} // correctAnswers değiştiğinde animasyonu tetikle
                initial={{ scale: 1 }}
                animate={{ scale: correctAnswers > previousCorrectAnswers ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold text-gray-800"
              >
                {correctAnswers}/{totalQuestions}
              </motion.div>
              <div className="text-sm text-gray-500">Doğru Cevap</div>
            </div>
          </div>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`relative transition-all duration-300 ${
                  star <= stars
                    ? "text-yellow-400"
                    : "text-gray-300"
                } ${showStarAnimation && star === stars ? "animate-bounce" : ""}`}
              >
                <Star className="w-8 h-8" />
                {star <= stars && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full opacity-30 animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>0%</span>
          <span className="font-bold">{Math.round(progressPercentage)}%</span>
          <span>100%</span>
        </div>
      </CardContent>
    </Card>
  );
};