import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Divide, Star, Trophy } from "lucide-react";
import ProgressTracker from "@/components/ProgressTracker";
import { MathCharacter } from "@/components/MathCharacter";
import { DifficultySelector } from "@/components/DifficultySelector";
import { ScoreBoard } from "@/components/ScoreBoard";
import { useSoundFeedback } from "@/components/SoundFeedback";
import CandyCrushGame from "@/components/CandyCrushGame";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

const BolmePage = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [sessionCorrectAnswers, setSessionCorrectAnswers] = useState(0); // Session-specific
  const [sessionTotalQuestions, setSessionTotalQuestions] = useState(0); // Session-specific
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [characterMood, setCharacterMood] = useState<"happy" | "sad" | "neutral" | "excited">("neutral");
  const { playSuccessSound, playErrorSound } = useSoundFeedback();
  const [sessionPoints, setSessionPoints] = useState(0); // Session-specific
  const [showMiniGame, setShowMiniGame] = useState(false);

  const generateNumbers = () => {
    let max = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;
    let n1, n2;
    do {
      n2 = Math.floor(Math.random() * (max / 2)) + 1;
      n1 = n2 * (Math.floor(Math.random() * (max / n2)) + 1);
    } while (n1 === 0 || n2 === 0 || n1 / n2 > max);

    setNum1(n1);
    setNum2(n2);
    setUserAnswer("");
    setFeedback(null);
  };

  const checkAnswer = () => {
    const correct = parseInt(userAnswer) === num1 / num2;
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
    generateNumbers();
    setCharacterMood("neutral");
    setSessionCorrectAnswers(0); // Reset for next session
    setSessionTotalQuestions(0); // Reset for next session
    // setSessionPoints(0); // DO NOT RESET sessionPoints here, let them accumulate

    if (sessionPoints >= 50 && !showMiniGame) {
      setShowMiniGame(true);
    }
  };

  useEffect(() => {
    generateNumbers();
  }, [difficulty]); // Regenerate on difficulty change

  const handleMiniGameEnd = (gameScore: number) => {
    if (typeof window !== 'undefined' && (window as any).updateStudentStats) {
      (window as any).updateStudentStats(0, 0, gameScore);
    }
    setShowMiniGame(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-indigo-600 mb-2">Bölme İşlemleri</h1>
          <p className="text-lg sm:text-xl text-gray-600">Eğlenceli bölme öğrenelim!</p>
        </div>

        <ScoreBoard correctAnswers={sessionCorrectAnswers} totalQuestions={sessionTotalQuestions} />
        <DifficultySelector onSelect={setDifficulty} currentLevel={difficulty} />

        <Card className="mb-4 shadow-xl border-2 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-center text-indigo-600 text-xl sm:text-2xl">Bölme Sorusu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <img src="/images/apple.png" alt="Apples" className="mx-auto mb-4 w-24 h-24 sm:w-32 sm:h-32 object-contain" />
              <div className="flex justify-center items-center space-x-3 sm:space-x-4 mb-6">
                <div className="text-3xl sm:text-4xl font-bold text-indigo-600">{num1}</div>
                <Divide className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                <div className="text-3xl sm:text-4xl font-bold text-indigo-600">{num2}</div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-400">=</div>
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-24 h-12 sm:w-32 sm:h-16 text-xl sm:text-2xl text-center border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="?"
                />
              </div>

              <MathCharacter mood={characterMood} />

              {feedback !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-center text-lg sm:text-xl font-bold mb-4 p-3 sm:p-4 rounded-lg ${feedback ? 'bg-green-100 text-green-600 border-2 border-green-300' : 'bg-red-100 text-red-600 border-2 border-red-300'}`}>
                  {feedback ? '🎉 Doğru cevap! 🎉' : '❌ Yanlış, tekrar deneyin! ❌'}
                </motion.div>
              )}

              <div className="flex justify-center space-x-4">
                {feedback === null ? (
                  <Button
                    onClick={checkAnswer}
                    className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Kontrol Et
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    className="bg-green-600 hover:bg-green-700 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Sonraki Soru
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <ProgressTracker topic="Bölme" correctAnswers={sessionCorrectAnswers} totalQuestions={sessionTotalQuestions} />
        
        <div className="mt-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-600">Oturum Puanı: {sessionPoints}</h2>
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

export default BolmePage;