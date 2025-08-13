import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Star, Trophy } from "lucide-react";
import ProgressTracker from "@/components/ProgressTracker";
import { MathCharacter } from "@/components/MathCharacter";
import { DifficultySelector } from "@/components/DifficultySelector";
import { ScoreBoard } from "@/components/ScoreBoard";
import { useSoundFeedback } from "@/components/SoundFeedback";
import CandyCrushGame from "@/components/CandyCrushGame";
import NumberOrderingGame from "@/components/NumberOrderingGame";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { showSuccess } from "@/utils/toast";

const ToplamaPage = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0); // This will now track session-specific correct answers
  const [totalQuestions, setTotalQuestions] = useState(0); // This will now track session-specific total questions
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [characterMood, setCharacterMood] = useState<"happy" | "sad" | "neutral" | "excited">("neutral");
  const { playSuccessSound, playErrorSound } = useSoundFeedback();
  const [sessionPoints, setSessionPoints] = useState(0); // Points earned in current session
  const [showCandyCrush, setShowCandyCrush] = useState(false);
  const [showNumberOrdering, setShowNumberOrdering] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0); // Track consecutive correct answers

  const generateNumbers = () => {
    let max = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 20;
    setNum1(Math.floor(Math.random() * max) + 1);
    setNum2(Math.floor(Math.random() * max) + 1);
    setUserAnswer("");
    setFeedback(null);
  };

  const checkAnswer = () => {
    const correct = parseInt(userAnswer) === num1 + num2;
    setFeedback(correct);
    setTotalQuestions(prev => prev + 1); // Update session total questions
    
    if (correct) {
      setCorrectAnswers(prev => prev + 1); // Update session correct answers
      setSessionPoints(prev => prev + 10); // Update session points
      setCharacterMood("happy");
      playSuccessSound();
      setConsecutiveCorrect(prev => prev + 1); // Increment consecutive correct
    } else {
      setCharacterMood("sad");
      playErrorSound();
      setConsecutiveCorrect(0); // Reset consecutive correct on wrong answer
    }
  };

  const nextQuestion = () => {
    // Call the global update function to persist session data
    if (typeof window !== 'undefined' && (window as any).updateStudentStats) {
      (window as any).updateStudentStats(correctAnswers, totalQuestions, sessionPoints);
    }

    generateNumbers();
    setCharacterMood("neutral");
    
    // Reset session stats for the new question/round
    setCorrectAnswers(0);
    setTotalQuestions(0);
    // setSessionPoints(0); // DO NOT RESET sessionPoints here, let them accumulate

    // Mini oyunları tetikleme mantığı (bu kısım StudentProfile'dan gelen totalPoints'e göre ayarlanmalı)
    // Şimdilik sessionPoints üzerinden devam edelim, ancak gerçekte StudentProfile'daki totalPoints kullanılmalı
    // Bu kısım için StudentProfile'dan totalPoints'i çekmek için bir mekanizma gerekebilir (Context API gibi)
    // Veya mini oyun tetikleme mantığını StudentProfile içine taşımak daha mantıklı olabilir.
    // Şimdilik, basitlik adına sessionPoints'i kullanmaya devam edelim.
    if (sessionPoints >= 50 && sessionPoints < 100 && !showCandyCrush) {
      setShowCandyCrush(true);
    } else if (sessionPoints >= 100 && !showNumberOrdering) {
      setShowNumberOrdering(true);
    }
  };

  useEffect(() => {
    generateNumbers();
  }, [difficulty]); // Regenerate on difficulty change

  // Automatic difficulty level-up logic
  useEffect(() => {
    if (consecutiveCorrect >= 5) { // Example: 5 consecutive correct answers to level up
      if (difficulty === "easy") {
        setDifficulty("medium");
        showSuccess("Tebrikler! Zorluk seviyesi 'Orta'ya yükseltildi! 🎉");
        setConsecutiveCorrect(0); // Reset for new difficulty
      } else if (difficulty === "medium") {
        setDifficulty("hard");
        showSuccess("Harika! Zorluk seviyesi 'Zor'a yükseltildi! 🚀");
        setConsecutiveCorrect(0); // Reset for new difficulty
      }
    }
  }, [consecutiveCorrect, difficulty]);

  const handleCandyCrushEnd = (gameScore: number) => {
    if (typeof window !== 'undefined' && (window as any).updateStudentStats) {
      (window as any).updateStudentStats(0, 0, gameScore); // Only add game score
    }
    setShowCandyCrush(false);
  };

  const handleNumberOrderingEnd = (gameScore: number) => {
    if (typeof window !== 'undefined' && (window as any).updateStudentStats) {
      (window as any).updateStudentStats(0, 0, gameScore); // Only add game score
    }
    setShowNumberOrdering(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-600 mb-2">Toplama İşlemleri</h1>
          <p className="text-lg sm:text-xl text-gray-600">Eğlenceli toplama öğrenelim!</p>
        </div>

        <ScoreBoard correctAnswers={correctAnswers} totalQuestions={totalQuestions} />
        <DifficultySelector onSelect={setDifficulty} currentLevel={difficulty} />

        <Card className="mb-4 shadow-xl border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-center text-purple-600 text-xl sm:text-2xl">Toplama Sorusu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <img src="/images/apple.png" alt="Apples" className="mx-auto mb-4 w-24 h-24 sm:w-32 sm:h-32 object-contain" />
              <div className="flex justify-center items-center space-x-3 sm:space-x-4 mb-6">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">{num1}</div>
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">{num2}</div>
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
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
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

        <ProgressTracker topic="Toplama" correctAnswers={correctAnswers} totalQuestions={totalQuestions} />
        
        <div className="mt-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-600">Oturum Puanı: {sessionPoints}</h2>
          {sessionPoints >= 50 && !showCandyCrush && !showNumberOrdering && (
            <Button 
              onClick={() => setShowCandyCrush(true)} 
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg"
            >
              Mini Oyunu Oyna! (Şeker Patlatma)
            </Button>
          )}
          {sessionPoints >= 100 && !showNumberOrdering && (
            <Button 
              onClick={() => setShowNumberOrdering(true)} 
              className="mt-4 ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg"
            >
              Mini Oyunu Oyna! (Sayı Sıralama)
            </Button>
          )}

          <Dialog open={showCandyCrush} onOpenChange={setShowCandyCrush}>
            <DialogContent className="max-w-sm sm:max-w-2xl p-0 border-none">
              <CandyCrushGame onGameEnd={handleCandyCrushEnd} onClose={() => setShowCandyCrush(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={showNumberOrdering} onOpenChange={setShowNumberOrdering}>
            <DialogContent className="max-w-sm sm:max-w-2xl p-0 border-none">
              <NumberOrderingGame onGameEnd={handleNumberOrderingEnd} onClose={() => setShowNumberOrdering(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ToplamaPage;