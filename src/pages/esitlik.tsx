import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Equal, Star, Trophy } from "lucide-react";
import ProgressTracker from "@/components/ProgressTracker";
import { MathCharacter } from "@/components/MathCharacter";
import { DifficultySelector } from "@/components/DifficultySelector";
import { ScoreBoard } from "@/components/ScoreBoard";
import { useSoundFeedback } from "@/components/SoundFeedback";
import CandyCrushGame from "@/components/CandyCrushGame"; // Import the new game component
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EqualityQuestion {
  leftSide: number;
  rightSide: number;
  correctAnswer: "eşit" | "eşit değil";
}

const EsitlikPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState<EqualityQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [characterMood, setCharacterMood] = useState<"happy" | "sad" | "neutral" | "excited">("neutral");
  const { playSuccessSound, playErrorSound } = useSoundFeedback();
  const [totalPoints, setTotalPoints] = useState(0);
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
    setShowResult(false);
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    const correct = userAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    setTotalQuestions(totalQuestions + 1);
    
    if (correct) {
      setCorrectAnswers(correctAnswers + 1);
      setTotalPoints(prev => prev + 10); // Award points for correct answer
      setCharacterMood("happy");
      playSuccessSound();
    } else {
      setCharacterMood("sad");
      playErrorSound();
    }
  };

  const nextQuestion = () => {
    generateQuestion();
    setCharacterMood("neutral");
    // Check if mini-game should be unlocked
    if (totalPoints >= 50 && !showMiniGame) { // Example: unlock at 50 points
      setShowMiniGame(true);
    }
  };

  useState(() => {
    generateQuestion();
  });

  if (!currentQuestion) {
    return <div>Yükleniyor...</div>;
  }

  const handleMiniGameEnd = (gameScore: number) => {
    setTotalPoints(prev => prev + gameScore); // Add mini-game score to total points
    setShowMiniGame(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-600 mb-2">Eşitlik</h1>
          <p className="text-xl text-gray-600">Eşitlik kavramını öğrenelim!</p>
        </div>

        <ScoreBoard correctAnswers={correctAnswers} totalQuestions={totalQuestions} />
        <DifficultySelector onSelect={setDifficulty} currentLevel={difficulty} />

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-center text-yellow-600">Eşitlik Kontrolü</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="flex justify-center items-center space-x-4 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-6 min-w-[80px]">
                  <div className="text-4xl font-bold text-yellow-600">{currentQuestion.leftSide}</div>
                </div>
                <Equal className="w-8 h-8 text-yellow-600" />
                <div className="bg-white rounded-xl shadow-lg p-6 min-w-[80px]">
                  <div className="text-4xl font-bold text-yellow-600">{currentQuestion.rightSide}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-lg text-gray-700 mb-4">Bu iki sayı birbirine eşit mi?</p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => setUserAnswer("eşit")}
                    className={`p-4 h-auto text-lg font-bold transition-all duration-200 ${
                      userAnswer === "eşit"
                        ? "bg-green-600 text-white shadow-lg transform scale-105"
                        : "bg-gray-100 hover:bg-gray-200 hover:shadow-md"
                    }`}
                    disabled={showResult}
                  >
                    Eşit
                  </Button>
                  <Button
                    onClick={() => setUserAnswer("eşit değil")}
                    className={`p-4 h-auto text-lg font-bold transition-all duration-200 ${
                      userAnswer === "eşit değil"
                        ? "bg-red-600 text-white shadow-lg transform scale-105"
                        : "bg-gray-100 hover:bg-gray-200 hover:shadow-md"
                    }`}
                    disabled={showResult}
                  >
                    Eşit Değil
                  </Button>
                </div>
              </div>

              <MathCharacter mood={characterMood} />

              {showResult && (
                <div className={`text-center text-xl font-bold mb-4 p-4 rounded-lg ${
                  isCorrect 
                    ? 'bg-green-100 text-green-600 border-2 border-green-300' 
                    : 'bg-red-100 text-red-600 border-2 border-red-300'
                }`}>
                  {isCorrect ? '🎉 Doğru cevap! 🎉' : '❌ Yanlış, tekrar deneyin! ❌'}
                </div>
              )}

              <div className="flex justify-center space-x-4">
                {!showResult ? (
                  <Button
                    onClick={checkAnswer}
                    className="bg-yellow-600 hover:bg-yellow-700 px-8 py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={!userAnswer}
                  >
                    Kontrol Et
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Sonraki Soru
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <ProgressTracker topic="Eşitlik" correctAnswers={correctAnswers} totalQuestions={totalQuestions} />

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-yellow-600">Toplam Puan: {totalPoints}</h2>
          {totalPoints >= 50 && (
            <Dialog open={showMiniGame} onOpenChange={setShowMiniGame}>
              <DialogTrigger asChild>
                <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold">
                  Mini Oyunu Oyna!
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl p-0 border-none">
                <CandyCrushGame onGameEnd={handleMiniGameEnd} onClose={() => setShowMiniGame(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default EsitlikPage;