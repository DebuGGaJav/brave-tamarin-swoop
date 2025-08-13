import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hash, Star, Trophy } from "lucide-react";
import ProgressTracker from "@/components/ProgressTracker";
import { MathCharacter } from "@/components/MathCharacter";
import { DifficultySelector } from "@/components/DifficultySelector";
import { ScoreBoard } from "@/components/ScoreBoard";
import { useSoundFeedback } from "@/components/SoundFeedback";
import CandyCrushGame from "@/components/CandyCrushGame";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

const SayilarPage = () => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [sessionCorrectAnswers, setSessionCorrectAnswers] = useState(0); // Session-specific
  const [sessionTotalQuestions, setSessionTotalQuestions] = useState(0); // Session-specific
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [characterMood, setCharacterMood] = useState<"happy" | "sad" | "neutral" | "excited">("neutral");
  const { playSuccessSound, playErrorSound } = useSoundFeedback();
  const [sessionPoints, setSessionPoints] = useState(0); // Session-specific
  const [showMiniGame, setShowMiniGame] = useState(false);

  const generateNumber = () => {
    let max = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 20;
    const newNumber = Math.floor(Math.random() * max) + 1;
    setCurrentNumber(newNumber);
    setUserAnswer("");
    setFeedback(null);
  };

  const checkAnswer = () => {
    const correct = parseInt(userAnswer) === currentNumber;
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
    generateNumber();
    setCharacterMood("neutral");
    setSessionCorrectAnswers(0); // Reset for next session
    setSessionTotalQuestions(0); // Reset for next session
    setSessionPoints(0); // Reset for next session

    // Check if mini-game should be unlocked (using a placeholder for global points)
    if (sessionPoints >= 50 && !showMiniGame) {
      setShowMiniGame(true);
    }
  };

  useEffect(() => {
    generateNumber();
  }, [difficulty]); // Regenerate on difficulty change

  const renderNumberDisplay = () => {
    return (
      <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-6 max-w-md mx-auto">
        <img src="/images/counting_fingers.png" alt="Counting Fingers" className="mx-auto mb-4 w-24 h-24 sm:w-32 sm:h-32 object-contain" />
        {Array.from({ length: currentNumber }, (_, i) => (
          <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-md">
            {i + 1}
          </div>
        ))}
      </div>
    );
  };

  const handleMiniGameEnd = (gameScore: number) => {
    if (typeof window !== 'undefined' && (window as any).updateStudentStats) {
      (window as any).updateStudentStats(0, 0, gameScore); // Only add game score
    }
    setShowMiniGame(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-2">Sayılar</h1>
          <p className="text-lg sm:text-xl text-gray-600">Sayıları öğrenelim!</p>
        </div>

        <ScoreBoard correctAnswers={sessionCorrectAnswers} totalQuestions={sessionTotalQuestions} />
        <DifficultySelector onSelect={setDifficulty} currentLevel={difficulty} />

        <Card className="mb-4 shadow-xl border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-blue-600 text-xl sm:text-2xl">Sayı Sayma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              {renderNumberDisplay()}
              
              <div className="mb-4">
                <p className="text-lg sm:text-xl text-gray-700 mb-2">Bu sayı kaç?</p>
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-24 h-12 sm:w-32 sm:h-16 text-xl sm:text-2xl text-center border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                  placeholder="?"
                  disabled={feedback !== null}
                />
              </div>

              <MathCharacter mood={characterMood} />

              {feedback !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-center text-lg sm:text-xl font-bold mb-4 p-3 sm:p-4 rounded-lg ${
                    feedback 
                      ? 'bg-green-100 text-green-600 border-2 border-green-300' 
                      : 'bg-red-100 text-red-600 border-2 border-red-300'
                  }`}>
                  {feedback ? '🎉 Doğru cevap! 🎉' : '❌ Yanlış, tekrar deneyin! ❌'}
                </motion.div>
              )}

              <div className="flex justify-center space-x-4">
                {feedback === null ? (
                  <Button
                    onClick={checkAnswer}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={!userAnswer}
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

        <ProgressTracker topic="Sayılar" correctAnswers={sessionCorrectAnswers} totalQuestions={sessionTotalQuestions} />

        <div className="mt-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-600">Oturum Puanı: {sessionPoints}</h2>
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

export default SayilarPage;