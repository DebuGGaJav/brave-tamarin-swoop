import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, X, Divide, Brain } from "lucide-react";
import ProgressTracker from "@/components/ProgressTracker";
import { MathCharacter } from "@/components/MathCharacter"; // Hata düzeltildi
import { DifficultySelector } from "@/components/DifficultySelector";
import { ScoreBoard } from "@/components/ScoreBoard";
import { useSoundFeedback } from "@/components/SoundFeedback";
import CandyCrushGame from "@/components/CandyCrushGame";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

type Operation = "toplama" | "cikarma" | "carpma" | "bolme";

interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  image?: string;
}

const MixedOperationsPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [sessionCorrectAnswers, setSessionCorrectAnswers] = useState(0); // Session-specific
  const [sessionTotalQuestions, setSessionTotalQuestions] = useState(0); // Session-specific
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [characterMood, setCharacterMood] = useState<"happy" | "sad" | "neutral" | "excited">("neutral");
  const { playSuccessSound, playErrorSound } = useSoundFeedback();
  const [sessionPoints, setSessionPoints] = useState(0); // Session-specific
  const [showMiniGame, setShowMiniGame] = useState(false);

  const generateQuestion = () => {
    let maxNum = 0;
    let operations: Operation[] = ["toplama", "cikarma"];

    if (difficulty === "easy") {
      maxNum = 5;
    } else if (difficulty === "medium") {
      maxNum = 10;
      operations.push("carpma");
    } else {
      maxNum = 20;
      operations.push("carpma", "bolme");
    }

    const randomOperation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    switch (randomOperation) {
      case "toplama":
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * maxNum) + 1;
        answer = num1 + num2;
        break;
      case "cikarma":
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case "carpma":
        num1 = Math.floor(Math.random() * (maxNum / 2)) + 1;
        num2 = Math.floor(Math.random() * (maxNum / 2)) + 1;
        answer = num1 * num2;
        break;
      case "bolme":
        let divisorMax = Math.floor(maxNum / 3);
        if (divisorMax < 1) divisorMax = 1;
        num2 = Math.floor(Math.random() * divisorMax) + 1;
        num1 = num2 * (Math.floor(Math.random() * (maxNum / num2)) + 1);
        answer = num1 / num2;
        break;
      default:
        num1 = 0; num2 = 0; answer = 0;
    }

    setCurrentQuestion({ num1, num2, operation: randomOperation, answer, image: "/images/math_character_excited.png" });
    setUserAnswer("");
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [difficulty]);

  const checkAnswer = () => {
    if (!currentQuestion) return;
    const correct = parseInt(userAnswer) === currentQuestion.answer;
    setFeedback(correct);
    setSessionTotalQuestions(prev => prev + 1);
    
    if (correct) {
      setSessionCorrectAnswers(prev => prev + 1);
      setSessionPoints(prev => prev + 10);
      setCharacterMood("happy");
      playSuccessSound();
    } else {
      setCharacterMood("sad");
      playErrorSound();
    }
  };

  const nextQuestion = () => {
    if (typeof window !== 'undefined' && (window as any).updateStudentStats) {
      (window as any).updateStudentStats(sessionCorrectAnswers, sessionTotalQuestions, sessionPoints);
    }
    generateQuestion();
    setCharacterMood("neutral");
    setSessionCorrectAnswers(0); // Reset for next session
    setSessionTotalQuestions(0); // Reset for next session
    // setSessionPoints(0); // DO NOT RESET sessionPoints here, let them accumulate

    if (sessionPoints >= 50 && !showMiniGame) {
      setShowMiniGame(true);
    }
  };

  const handleMiniGameEnd = (gameScore: number) => {
    if (typeof window !== 'undefined' && (window as any).updateStudentStats) {
      (window as any).updateStudentStats(0, 0, gameScore);
    }
    setShowMiniGame(false);
  };

  if (!currentQuestion) {
    return <div>Yükleniyor...</div>;
  }

  const getOperationSymbol = (operation: Operation) => {
    switch (operation) {
      case "toplama": return <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />;
      case "cikarma": return <Minus className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />;
      case "carpma": return <X className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />;
      case "bolme": return <Divide className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />;
      default: return null;
    }
  };

  const getOperationColor = (operation: Operation) => {
    switch (operation) {
      case "toplama": return "text-purple-600";
      case "cikarma": return "text-red-600";
      case "carpma": return "text-orange-600";
      case "bolme": return "text-indigo-600";
      default: return "text-gray-600";
    }
  };

  const getCardBorderColor = (operation: Operation) => {
    switch (operation) {
      case "toplama": return "border-purple-200";
      case "cikarma": return "border-red-200";
      case "carpma": return "border-orange-200";
      case "bolme": return "border-indigo-200";
      default: return "border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-600 mb-2">Karışık İşlemler</h1>
          <p className="text-lg sm:text-xl text-gray-600">Tüm matematik işlemlerini bir arada çözelim!</p>
        </div>

        <ScoreBoard correctAnswers={sessionCorrectAnswers} totalQuestions={sessionTotalQuestions} />
        <DifficultySelector onSelect={setDifficulty} currentLevel={difficulty} />

        <Card className={`mb-4 shadow-xl border-2 ${getCardBorderColor(currentQuestion.operation)}`}>
          <CardHeader>
            <CardTitle className={`text-center ${getOperationColor(currentQuestion.operation)} text-xl sm:text-2xl`}>
              {currentQuestion.operation.charAt(0).toUpperCase() + currentQuestion.operation.slice(1)} Sorusu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <img src={currentQuestion.image} alt="Math Operation" className="mx-auto mb-4 w-24 h-24 sm:w-32 sm:h-32 object-contain" />
              <div className="flex justify-center items-center space-x-3 sm:space-x-4 mb-6">
                <div className={`text-3xl sm:text-4xl font-bold ${getOperationColor(currentQuestion.operation)}`}>{currentQuestion.num1}</div>
                {getOperationSymbol(currentQuestion.operation)}
                <div className={`text-3xl sm:text-4xl font-bold ${getOperationColor(currentQuestion.operation)}`}>{currentQuestion.num2}</div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-400">=</div>
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-24 h-12 sm:w-32 sm:h-16 text-xl sm:text-2xl text-center border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="?"
                />
              </div>

              <MathCharacter mood={characterMood} />

              {feedback !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-center text-lg sm:text-xl font-bold mb-4 p-3 sm:p-4 rounded-lg ${feedback ? 'bg-green-100 text-green-600 border-2 border-green-300' : 'bg-red-100 text-red-600 border-2 border-red-300'}`}
                >
                  {feedback ? '🎉 Doğru cevap! 🎉' : '❌ Yanlış, tekrar deneyin! ❌'}
                </motion.div>
              )}

              <div className="flex justify-center space-x-4">
                {feedback === null ? (
                  <Button
                    onClick={checkAnswer}
                    className={`bg-purple-600 hover:bg-purple-700 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200`}
                  >
                    Kontrol Et
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    className={`bg-green-600 hover:bg-green-700 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200`}
                  >
                    Sonraki Soru
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <ProgressTracker topic="Karışık İşlemler" correctAnswers={sessionCorrectAnswers} totalQuestions={sessionTotalQuestions} />
        
        <div className="mt-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-600">Oturum Puanı: {sessionPoints}</h2>
          {sessionPoints >= 50 && (
            <Dialog open={showMiniGame} onOpenChange={setShowMiniGame}>
              <DialogTrigger asChild>
                <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg">
                  Mini Oyunu Oyna!
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm sm:max-w-2xl p-0 border-none">
                <CandyCrushGame onGameEnd={handleMiniGameEnd} onClose={() => setShowMiniGame(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default MixedOperationsPage;