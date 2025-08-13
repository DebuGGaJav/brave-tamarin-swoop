import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Equal, Star, Trophy } from "lucide-react";
import ProgressTracker from "@/components/ProgressTracker";
import { MathCharacter } from "@/components/MathCharacter";
import { DifficultySelector } from "@/components/DifficultySelector";
import { ScoreBoard } from "@/components/ScoreBoard";
import { useSoundFeedback } from "@/components/SoundFeedback";
import CandyCrushGame from "@/components/CandyCrushGame";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface EqualityQuestion {
  leftSide: number;
  rightSide: number;
  correctAnswer: "eşit" | "eşit değil";
}

const EsitlikPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState<EqualityQuestion | null>(null);
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
    let max = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 20;
    const left = Math.floor(Math.random() * max) + 1;
    const right = Math.floor(Math.random() * max) + 1;
    
    const correctAnswer = left === right ? "eşit" : "eşit değil";
    
    setCurrentQuestion({
      leftSide: left,
      rightSide: right,
      correctAnswer: correctAnswer
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
    setSessionPoints(0); // Reset for next session

    // Check if mini-game should be unlocked (using a placeholder for global points)
    if (sessionPoints >= 50 && !showMiniGame) {
      setShowMiniGame(true);
    }
  };

  useEffect(() => {
    generateQuestion();
  }, [difficulty]); // Regenerate on difficulty change

  if (!currentQuestion) {
    return <div>Yükleniyor...</div>;
  }

  const handleMiniGameEnd = (gameScore: number) => {
    if (typeof window !== 'undefined' && (window as any).updateStudentStats) {
      (window as any).updateStudentStats(0, 0, gameScore); // Only add game score
    }
    setShowMiniGame(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-600 mb-2">Eşitlik</h1>
          <p className="text-lg sm:text-xl text-gray-600">Eşitlik kavramını öğrenelim!</p>
        </div>

        <ScoreBoard correctAnswers={sessionCorrectAnswers} totalQuestions={sessionTotalQuestions} />
        <DifficultySelector onSelect={setDifficulty} currentLevel={difficulty} />

        <Card className="mb-4 shadow-xl border-2 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-center text-yellow-600 text-xl sm:text-2xl">Eşitlik Kontrolü</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <img src="/images/equal_balance.png" alt="Balance" className="mx-auto mb-4 w-24 h-24 sm:w-32 sm:h-32 object-contain" />
              <div className="flex justify-center items-center space-x-3 sm:space-x-4 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 min-w-[80px] sm:min-w-[100px]">
                  <div className="text-4xl sm:text-5xl font-bold text-yellow-600">{currentQuestion.leftSide}</div>
                </div>
                <Equal className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-600" />
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 min-w-[80px] sm:min-w-[100px]">
                  <div className="text-4xl sm:text-5xl font-bold text-yellow-600">{currentQuestion.rightSide}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-lg sm:text-xl text-gray-700 mb-4">Bu iki sayı birbirine eşit mi?</p>
                <div className="flex justify-center space-x-3 sm:space-x-4">
                  <Button
                    onClick={() => setUserAnswer("eşit")}
                    className={`p-3 sm:p-4 h-auto text-base sm:text-lg font-bold transition-all duration-200 ${
                      userAnswer === "eşit"
                        ? "bg-green-600 text-white shadow-lg transform scale-105"
                        : "bg-gray-100 hover:bg-gray-200 hover:shadow-md"
                    }`}
                    disabled={feedback !== null}
                  >
                    Eşit
                  </Button>
                  <Button
                    onClick={() => setUserAnswer("eşit değil")}
                    className={`p-3 sm:p-4 h-auto text-base sm:text-lg font-bold transition-all duration-200 ${
                      userAnswer === "eşit değil"
                        ? "bg-red-600 text-white shadow-lg transform scale-105"
                        : "bg-gray-100 hover:bg-gray-200 hover:shadow-md"
                    }`}
                    disabled={feedback !== null}
                  >
                    Eşit Değil
                  </Button>
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
                    className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
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

        <ProgressTracker topic="Eşitlik" correctAnswers={sessionCorrectAnswers} totalQuestions={sessionTotalQuestions} />

        <div className="mt-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-yellow-600">Oturum Puanı: {sessionPoints}</h2>
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
            </Dialog<dyad-problem-report summary="2 problems">
<problem file="src/pages/cikarma.tsx" line="6" column="26" code="1005">'from' expected.</problem>
<problem file="src/pages/cikarma.tsx" line="6" column="26" code="1141">String literal expected.</problem>
</dyad-problem-report>You're right! It looks like there's a syntax error in the import statement for `MathCharacter` in `src/pages/cikarma.tsx`. The `=>` syntax is incorrect for imports. It should be a standard import.

I will fix this import statement in `src/pages/cikarma.tsx`.

<dyad-write path="src/pages/cikarma.tsx" description="Fixing the import statement for MathCharacter in cikarma.tsx">
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Star, Trophy } from "lucide-react";
import ProgressTracker from "@/components/ProgressTracker";
import { MathCharacter } from "@/components/MathCharacter";
import { DifficultySelector } from "@/components/DifficultySelector";
import { ScoreBoard } from "@/components/ScoreBoard";
import { useSoundFeedback } from "@/components/SoundFeedback";
import CandyCrushGame from "@/components/CandyCrushGame";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

const CikarmaPage = () => {
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
    let max = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 20;
    const n1 = Math.floor(Math.random() * max) + 1;
    const n2 = Math.floor(Math.random() * n1) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer("");
    setFeedback(null);
  };

  const checkAnswer = () => {
    const correct = parseInt(userAnswer) === num1 - num2;
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
    setSessionPoints(0); // Reset for next session

    // Check if mini-game should be unlocked (using a placeholder for global points)
    // In a real app, you'd fetch global points from StudentProfile or context
    if (sessionPoints >= 50 && !showMiniGame) {
      setShowMiniGame(true);
    }
  };

  useEffect(() => {
    generateNumbers();
  }, [difficulty]); // Regenerate on difficulty change

  const handleMiniGameEnd = (gameScore: number) => {
    if (typeof window !== 'undefined' && (window as any).updateStudentStats) {
      (window as any).updateStudentStats(0, 0, gameScore); // Only add game score
    }
    setShowMiniGame(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-600 mb-2">Çıkarma İşlemleri</h1>
          <p className="text-lg sm:text-xl text-gray-600">Eğlenceli çıkarma öğrenelim!</p>
        </div>

        <ScoreBoard correctAnswers={sessionCorrectAnswers} totalQuestions={sessionTotalQuestions} />
        <DifficultySelector onSelect={setDifficulty} currentLevel={difficulty} />

        <Card className="mb-4 shadow-xl border-2 border-red-200">
          <CardHeader>
            <CardTitle className="text-center text-red-600 text-xl sm:text-2xl">Çıkarma Sorusu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <img src="/images/balloons.png" alt="Balloons" className="mx-auto mb-4 w-24 h-24 sm:w-32 sm:h-32 object-contain" />
              <div className="flex justify-center items-center space-x-3 sm:space-x-4 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 min-w-[80px] sm:min-w-[100px]">
                  <div className="text-4xl sm:text-5xl font-bold text-red-600">{num1}</div>
                </div>
                <Minus className="w-8 h-8 sm:w-12 sm:h-12 text-red-600" />
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 min-w-[80px] sm:min-w-[100px]">
                  <div className="text-4xl sm:text-5xl font-bold text-red-600">{num2}</div>
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-gray-400">=</div>
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
                    className="bg-red-600 hover:bg-red-700 text-base sm:text-lg px-6 py-2 sm:px-8 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Kontrol Et
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    className="bg-green-600 hover:bg-green-700 text-base sm:text-lg px-6 py-2 sm:px-8 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Sonraki Soru
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <ProgressTracker topic="Çıkarma" correctAnswers={sessionCorrectAnswers} totalQuestions={sessionTotalQuestions} />

        <div className="mt-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-red-600">Oturum Puanı: {sessionPoints}</h2>
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

export default CikarmaPage;