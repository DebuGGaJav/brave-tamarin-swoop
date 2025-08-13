import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Equal, Star, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ProgressTracker from "@/components/ProgressTracker";
import { MathCharacter } from "@/components/MathCharacter";
import { DifficultySelector } from "@/components/DifficultySelector";
import { ScoreBoard } from "@/components/ScoreBoard";
import { useSoundFeedback } from "@/components/SoundFeedback";

const EsitlikPage = () => {
  const [leftSide, setLeftSide] = useState(0);
  const [rightSide, setRightSide] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [characterMood, setCharacterMood] = useState<"happy" | "sad" | "neutral" | "excited">("neutral");
  const { playSuccessSound, playErrorSound } = useSoundFeedback();

  const generateEquation = () => {
    let max = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 20;
    const left = Math.floor(Math.random() * max) + 1;
    const right = Math.floor(Math.random() * max) + 1;
    setLeftSide(left);
    setRightSide(right);
    setUserAnswer("");
    setShowResult(false);
  };

  const checkAnswer = () => {
    const userValue = userAnswer.toLowerCase();
    const correct = leftSide === rightSide ? "eşit" : "eşit değil";
    const isAnswerCorrect = userValue === correct;
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    setTotalQuestions(totalQuestions + 1);
    
    if (isAnswerCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setCharacterMood("happy");
      playSuccessSound();
    } else {
      setCharacterMood("sad");
      playErrorSound();
    }
  };

  const nextQuestion = () => {
    generateEquation();
    setCharacterMood("neutral");
  };

  useState(() => {
    generateEquation();
  });

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
                <div className="text-4xl font-bold text-yellow-600">{leftSide}</div>
                <Equal className="w-8 h-8 text-yellow-600" />
                <div className="text-4xl font-bold text-yellow-600">{rightSide}</div>
              </div>
              
              <div className="mb-4">
                <p className="text-lg text-gray-700 mb-4">Bu iki sayı birbirine eşit mi?</p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => setUserAnswer("eşit")}
                    className={`p-4 h-auto ${
                      userAnswer === "eşit"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    Eşit
                  </Button>
                  <Button
                    onClick={() => setUserAnswer("eşit değil")}
                    className={`p-4 h-auto ${
                      userAnswer === "eşit değil"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    Eşit Değil
                  </Button>
                </div>
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
                    className="bg-yellow-600 hover:bg-yellow-700"
                    disabled={!userAnswer}
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

        <ProgressTracker topic="Eşitlik" correctAnswers={correctAnswers} totalQuestions={totalQuestions} />
      </div>
    </div>
  );
};

export default EsitlikPage;