import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shapes, Star, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ProgressTracker from "@/components/ProgressTracker";
import { MathCharacter } from "@/components/MathCharacter";
import { DifficultySelector } from "@/components/DifficultySelector";
import { ScoreBoard } from "@/components/ScoreBoard";
import { useSoundFeedback } from "@/components/SoundFeedback";

const SekillerPage = () => {
  const [currentShape, setCurrentShape] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [characterMood, setCharacterMood] = useState<"happy" | "sad" | "neutral" | "excited">("neutral");
  const { playSuccessSound, playErrorSound } = useSoundFeedback();

  const shapes = ["kare", "daire", "üçgen", "dikdörtgen", "yamuk"];
  const shapeEmojis = {
    kare: "⬜",
    daire: "⭕",
    üçgen: "🔺",
    dikdörtgen: "▭",
    yamuk: "🔷"
  };

  const generateShape = () => {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    setCurrentShape(shape);
    
    const wrongOptions = shapes.filter(s => s !== shape).sort(() => 0.5 - Math.random()).slice(0, 3);
    const allOptions = [shape, ...wrongOptions].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    
    setUserAnswer("");
    setShowResult(false);
  };

  const checkAnswer = () => {
    const correct = userAnswer === currentShape;
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
    generateShape();
    setCharacterMood("neutral");
  };

  useState(() => {
    generateShape();
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Şekiller</h1>
          <p className="text-xl text-gray-600">Geometrik şekilleri öğrenelim!</p>
        </div>

        <ScoreBoard correctAnswers={correctAnswers} totalQuestions={totalQuestions} />
        <DifficultySelector onSelect={setDifficulty} currentLevel={difficulty} />

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-center text-purple-600">Şekil Tanıma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-8xl mb-6">
                {shapeEmojis[currentShape as keyof typeof shapeEmojis]}
              </div>
              
              <div className="mb-4">
                <p className="text-lg text-gray-700 mb-4">Bu şekil hangisidir?</p>
                <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                  {options.map((option) => (
                    <Button
                      key={option}
                      onClick={() => setUserAnswer(option)}
                      className={`p-4 h-auto ${
                        userAnswer === option
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {option}
                    </Button>
                  ))}
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
                    className="bg-purple-600 hover:bg-purple-700"
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

        <ProgressTracker topic="Şekiller" correctAnswers={correctAnswers} totalQuestions={totalQuestions} />
      </div>
    </div>
  );
};

export default SekillerPage;