import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Star, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ProgressTracker from "@/components/ProgressTracker";
import { MathCharacter } from "@/components/MathCharacter";
import { DifficultySelector } from "@/components/DifficultySelector";
import { ScoreBoard } from "@/components/ScoreBoard";
import { useSoundFeedback } from "@/components/SoundFeedback";

interface Problem {
  question: string;
  answer: number;
}

const ProblemCozmePage = () => {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [characterMood, setCharacterMood] = useState<"happy" | "sad" | "neutral" | "excited">("neutral");
  const { playSuccessSound, playErrorSound } = useSoundFeedback();

  const problems: Problem[] = [
    {
      question: "Ali'nin 3 elması var. Ayşe 2 elma daha verdi. Ali'nin kaç elması var?",
      answer: 5,
    },
    {
      question: "Sınıfta 4 kız öğrenci var. 2 erkek öğrenci daha geldi. Kaç öğrenci var?",
      answer: 6,
    },
    {
      question: "5 balondan 2'si patladı. Kaç balon kaldı?",
      answer: 3,
    },
    {
      question: "7 arabadan 3'ü gitti. Kaç araba kaldı?",
      answer: 4,
    },
    {
      question: "Kutuda 8 kalem var. 3 tanesini kullandım. Kaç kalem kaldı?",
      answer: 5,
    },
  ];

  const checkAnswer = () => {
    const correct = parseInt(userAnswer) === problems[currentProblem].answer;
    setIsCorrect(correct);
    setShowResult(true);
    setTotalQuestions(totalQuestions + 1);
    
    if (correct) {
      setCorrectAnswers(correctAnswers + 1);
      setCharacterMood("happy");
      playSuccessSound();
    } else {
      setCharacterMood("sad");
      playErrorSound();
    }
  };

  const nextProblem = () => {
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(currentProblem + 1);
      setUserAnswer("");
      setShowResult(false);
      setCharacterMood("neutral");
    }
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

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-center text-green-600">Problem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-lg text-gray-700 mb-4">
                {problems[currentProblem].question}
              </p>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-32 h-16 text-2xl text-center border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="?"
              />

              <MathCharacter mood={characterMood} />

              {showResult && (
                <div className={`text-center text-xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? 'Doğru cevap! 🎉' : 'Yanlış, tekrar deneyin!'}
                </div>
              )}

              <div className="flex justify-center space-x-4">
                {!showResult ? (
                  <Button
                    onClick={checkAnswer}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Kontrol Et
                  </Button>
                ) : (
                  currentProblem < problems.length - 1 && (
                    <Button
                      onClick={nextProblem}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Sonraki Problem
                    </Button>
                  )
                )}
              </div>

              <div className="text-center mt-4 text-sm text-gray-500">
                Problem {currentProblem + 1} / {problems.length}
              </div>
            </div>
          </CardContent>
        </Card>

        <ProgressTracker topic="Problem Çözme" correctAnswers={correctAnswers} totalQuestions={totalQuestions} />
      </div>
    </div>
  );
};

export default ProblemCozmePage;