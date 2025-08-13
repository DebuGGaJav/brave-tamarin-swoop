import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Star, Trophy } from "lucide-react";
import ProgressTracker from "@/components/ProgressTracker";
import { MathCharacter } from "@/components/MathCharacter";
import { DifficultySelector } from "@/components/DifficultySelector";
import { ScoreBoard } from "@/components/ScoreBoard";
import { useSoundFeedback } from "@/components/SoundFeedback";

const ToplamaPage = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [characterMood, setCharacterMood] = useState<"happy" | "sad" | "neutral" | "excited">("neutral");
  const { playSuccessSound, playErrorSound } = useSoundFeedback();

  const generateNumbers = () => {
    let max = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 20;
    setNum1(Math.floor(Math.random() * max) + 1);
    setNum2(Math.floor(Math.random() * max) + 1);
    setUserAnswer("");
    setShowResult(false);
  };

  const checkAnswer = () => {
    const correct = parseInt(userAnswer) === num1 + num2;
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

  const nextQuestion = () => {
    generateNumbers();
    setCharacterMood("neutral");
  };

  useState(() => {
    generateNumbers();
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Toplama İşlemleri</h1>
          <p className="text-xl text-gray-600">Eğlenceli toplama öğrenelim!</p>
        </div>

        <ScoreBoard correctAnswers={correctAnswers} totalQuestions={totalQuestions} />
        <DifficultySelector onSelect={setDifficulty} currentLevel={difficulty} />

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-center text-purple-600">Toplama Sorusu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <img src="/images/apple.png" alt="Apples" className="mx-auto mb-4 w-32 h-32 object-contain" />
              <div className="flex justify-center items-center space-x-4 mb-6">
                <div className="text-4xl font-bold text-blue-600">{num1}</div>
                <Plus className="w-8 h-8 text-purple-600" />
                <div className="text-4xl font-bold text-blue-600">{num2}</div>
                <div className="text-4xl font-bold text-gray-400">=</div>
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-32 h-16 text-2xl text-center border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="?"
                />
              </div>

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
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Kontrol Et
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Sonraki Soru
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <ProgressTracker topic="Toplama" correctAnswers={correctAnswers} totalQuestions={totalQuestions} />
      </div>
    </div>
  );
};

export default ToplamaPage;