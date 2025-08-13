import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Problem {
  question: string;
  answer: number;
  image?: string;
}

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
];

export const ProblemSolver = () => {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const checkAnswer = () => {
    const correct = parseInt(userAnswer) === problems[currentProblem].answer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const nextProblem = () => {
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(currentProblem + 1);
      setUserAnswer("");
      setShowResult(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-center text-purple-600">
            Problem Çözme
          </CardTitle>
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
              className="w-32 h-16 text-2xl text-center border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="?"
            />
          </div>

          {showResult && (
            <div className={`text-center text-xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? 'Doğru cevap!' : 'Yanlış, tekrar deneyin!'}
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
              currentProblem < problems.length - 1 && (
                <Button
                  onClick={nextProblem}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Sonraki Problem
                </Button>
              )
            )}
          </div>

          <div className="text-center mt-4 text-sm text-gray-500">
            Problem {currentProblem + 1} / {problems.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};