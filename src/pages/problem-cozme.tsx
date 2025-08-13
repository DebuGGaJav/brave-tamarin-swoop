import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Star, Trophy } from "lucide-react";
import ProgressTracker from "@/components/ProgressTracker";
import { MathCharacter } from "@/components/MathCharacter";
import { DifficultySelector } from "@/components/DifficultySelector";
import { ScoreBoard } from "@/components/ScoreBoard";
import { useSoundFeedback } from "@/components/SoundFeedback";
import CandyCrushGame from "@/components/CandyCrushGame"; // Import the new game component
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Problem {
  question: string;
  answer: number;
  image?: string; // Added image property
}

const ProblemCozmePage = () => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0); // Renamed to avoid conflict
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

  const problems: Problem[] = [
    {
      question: "Ali'nin 3 elması var. Ayşe 2 elma daha verdi. Ali'nin kaç elması var?",
      answer: 5,
      image: "/images/apple.png"
    },
    {
      question: "Sınıfta 4 kız öğrenci var. 2 erkek öğrenci daha geldi. Kaç öğrenci var?",
      answer: 6,
      image: "/images/students.png" // Assuming you'll add a students image
    },
    {
      question: "5 balondan 2'si patladı. Kaç balon kaldı?",
      answer: 3,
      image: "/images/balloons.png"
    },
    {
      question: "7 arabadan 3'ü gitti. Kaç araba kaldı?",
      answer: 4,
      image: "/images/car.png"
    },
    {
      question: "Kutuda 8 kalem var. 3 tanesini kullandım. Kaç kalem kaldı?",
      answer: 5,
      image: "/images/pencil.png"
    },
  ];

  const checkAnswer = () => {
    const correct = parseInt(userAnswer) === problems[currentProblemIndex].answer;
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

  const nextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setUserAnswer("");
      setShowResult(false);
      setCharacterMood("neutral");
    }
    // Check if mini-game should be unlocked
    if (totalPoints >= 50 && !showMiniGame) { // Example: unlock at 50 points
      setShowMiniGame(true);
    }
  };

  const handleMiniGameEnd = (gameScore: number) => {
    setTotalPoints(prev => prev + gameScore); // Add mini-game score to total points
    setShowMiniGame(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">Problem Çözme</h1>
          <p className="text-xl text-gray-600">Günlük hayat problemlerini çözelim!</p>
        </div>

        <ScoreBoard correctAnswers={correctAnswers} totalQuestions={totalQuestions} />
        <DifficultySelector onSelect={setDifficulty} currentLevel={difficulty} />

        <Card className="mb-4 shadow-xl border-2 border-green-200">
          <CardHeader>
            <CardTitle className="text-center text-green-600 text-2xl">Problem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              {problems[currentProblemIndex].image && (
                <img 
                  src={problems[currentProblemIndex].image} 
                  alt="Problem illustration" 
                  className="mx-auto mb-4 w-32 h-32 object-contain" 
                />
              )}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <p className="text-xl text-gray-700 font-semibold leading-relaxed">
                  {problems[currentProblemIndex].question}
                </p>
              </div>
              
              <div className="mb-6">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)} // Corrected onChange handler
                  className="w-32 h-16 text-2xl text-center border-2 border-purple-300 rounded-lg"
                  placeholder="?"
                />
              </div>

              <MathCharacter mood={characterMood} />

              {showResult && (
                <div className={`text-center text-2xl font-bold mb-6 p-4 rounded-lg ${
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
                    className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Kontrol Et
                  </Button>
                ) : (
                  currentProblemIndex < problems.length - 1 && (
                    <Button
                      onClick={nextProblem}
                      className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Sonraki Problem
                    </Button>
                  )
                )}
              </div>

              <div className="text-center mt-4 text-sm text-gray-500">
                Problem {currentProblemIndex + 1} / {problems.length}
              </div>
            </div>
          </CardContent>
        </Card>

        <ProgressTracker topic="Problem Çözme" correctAnswers={correctAnswers} totalQuestions={totalQuestions} />

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-green-600">Toplam Puan: {totalPoints}</h2>
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

export default ProblemCozmePage;