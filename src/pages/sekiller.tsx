import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shapes, Star, Trophy } from "lucide-react";
import ProgressTracker from "@/components/ProgressTracker";
import { MathCharacter } from "@/components/MathCharacter";
import { DifficultySelector } from "@/components/DifficultySelector";
import { ScoreBoard } from "@/components/ScoreBoard";
import { useSoundFeedback } from "@/components/SoundFeedback";
import CandyCrushGame from "@/components/CandyCrushGame";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { showSuccess } from "@/utils/toast";

interface ShapeQuestion {
  shape: string;
  emoji: string;
  options: string[];
  correctAnswer: string;
}

const SekillerPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState<ShapeQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [sessionCorrectAnswers, setSessionCorrectAnswers] = useState(0); // Session-specific
  const [sessionTotalQuestions, setSessionTotalQuestions] = useState(0); // Session-specific
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [characterMood, setCharacterMood] = useState<"happy" | "sad" | "neutral" | "excited">("neutral");
  const { playSuccessSound, playErrorSound } = useSoundFeedback();
  const [sessionPoints, setSessionPoints] = useState(0); // Session-specific
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0); // Track consecutive correct answers

  const shapeQuestions: ShapeQuestion[] = [
    {
      shape: "kare",
      emoji: "⬜",
      options: ["kare", "daire", "üçgen", "dikdörtgen"],
      correctAnswer: "kare"
    },
    {
      shape: "daire",
      emoji: "⭕",
      options: ["daire", "kare", "üçgen", "elmas"],
      correctAnswer: "daire"
    },
    {
      shape: "üçgen",
      emoji: "🔺",
      options: ["üçgen", "kare", "daire", "dikdörtgen"],
      correctAnswer: "üçgen"
    },
    {
      shape: "dikdörtgen",
      emoji: "▭",
      options: ["dikdörtgen", "kare", "üçgen", "daire"],
      correctAnswer: "dikdörtgen"
    },
    {
      shape: "elmas", // Yamuk yerine elmas
      emoji: "🔷",
      options: ["elmas", "kare", "üçgen", "daire"],
      correctAnswer: "elmas"
    },
    {
      shape: "kalp",
      emoji: "❤️",
      options: ["kalp", "yıldız", "daire", "kare"],
      correctAnswer: "kalp"
    },
    {
      shape: "yıldız",
      emoji: "⭐",
      options: ["yıldız", "kalp", "üçgen", "kare"],
      correctAnswer: "yıldız"
    },
    {
      shape: "altıgen",
      emoji: "⬡",
      options: ["altıgen", "kare", "daire", "üçgen"],
      correctAnswer: "altıgen"
    }
  ];

  const generateQuestion = () => {
    const availableQuestions = currentQuestion 
      ? shapeQuestions.filter(q => q.shape !== currentQuestion.shape)
      : shapeQuestions;
    
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    const shuffledOptions = [...randomQuestion.options].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      ...randomQuestion,
      options: shuffledOptions
    });
    
    setUserAnswer("");
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    const correct = userAnswer === currentQuestion.correctAnswer;
    setFeedback(correct);
    setSessionTotalQuestions(prev => prev + 1);
    
    if (correct) {
      setSessionCorrectAnswers(prev => prev + 1);
      setSessionPoints(prev => prev + 10);
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
    if (typeof window !== 'undefined' && (window as any).updateStudentStats) {
      (window as any).updateStudentStats(sessionCorrectAnswers, sessionTotalQuestions, sessionPoints);
    }
    generateQuestion();
    setCharacterMood("neutral");
    setSessionCorrectAnswers(0); // Reset for next session
    setSessionTotalQuestions(0); // Reset for next session
    // setSessionPoints(0); // DO NOT RESET sessionPoints here, let them accumulate

    // Check if mini-game should be unlocked (using a placeholder for global points)
    if (sessionPoints >= 50 && !showMiniGame) {
      setShowMiniGame(true);
    }
  };

  useEffect(() => {
    generateQuestion();
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

  const handleMiniGameEnd = (gameScore: number) => {
    if (typeof window !== 'undefined' && (window as any).updateStudentStats) {
      (window as any).updateStudentStats(0, 0, gameScore); // Only add game score
    }
    setShowMiniGame(false);
  };

  if (!currentQuestion) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-600 mb-2">Şekiller</h1>
          <p className="text-lg sm:text-xl text-gray-600">Geometrik şekilleri öğrenelim!</p>
        </div>

        <ScoreBoard correctAnswers={sessionCorrectAnswers} totalQuestions={sessionTotalQuestions} />
        <DifficultySelector onSelect={setDifficulty} currentLevel={difficulty} />

        <Card className="mb-4 shadow-xl border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-center text-purple-600 text-xl sm:text-2xl">Şekil Tanıma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-7xl sm:text-8xl mb-6">{currentQuestion.emoji}</div>
              
              <div className="mb-4">
                <p className="text-lg sm:text-xl text-gray-700 mb-4">Bu şekil hangisidir?</p>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-xs sm:max-w-md mx-auto">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option}
                      onClick={() => setUserAnswer(option)}
                      className={`p-3 sm:p-4 h-auto text-base sm:text-lg font-medium transition-all duration-200 ${
                        userAnswer === option
                          ? "bg-purple-600 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-md"
                      }`}
                      disabled={feedback !== null}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
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
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
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

        <ProgressTracker topic="Şekiller" correctAnswers={sessionCorrectAnswers} totalQuestions={sessionTotalQuestions} />

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

export default SekillerPage;