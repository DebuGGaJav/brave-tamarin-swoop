import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Player {
  id: string;
  name: string;
  score: number;
  avatar: string;
}

interface Question {
  question: string;
  answer: number;
  type: "toplama" | "cikarma";
}

export default function MultiplayerGame() {
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Sen", score: 0, avatar: "👨‍🎓" },
    { id: "2", name: "Bilgisayar 1", score: 0, avatar: "🤖" },
    { id: "3", name: "Bilgisayar 2", score: 0, avatar: "🤖" },
    { id: "4", name: "Bilgisayar 3", score: 0, avatar: "🤖" }
  ]);

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: "2 + 3 = ?",
    answer: 5,
    type: "toplama"
  });
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(1);

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const isAddition = Math.random() > 0.5;
    
    if (isAddition) {
      setCurrentQuestion({
        question: `${num1} + ${num2} = ?`,
        answer: num1 + num2,
        type: "toplama"
      });
    } else {
      const max = Math.max(num1, num2);
      const min = Math.min(num1, num2);
      setCurrentQuestion({
        question: `${max} - ${min} = ?`,
        answer: max - min,
        type: "cikarma"
      });
    }
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [timeLeft, gameStarted]);

  const handleTimeUp = () => {
    const updatedPlayers = [...players];
    updatedPlayers.forEach((player, index) => {
      if (index > 0) {
        const randomAnswer = Math.random() > 0.3 ? currentQuestion.answer : currentQuestion.answer + Math.floor(Math.random() * 3) - 1;
        if (randomAnswer === currentQuestion.answer) {
          player.score += 10;
        }
      }
    });
    setPlayers(updatedPlayers);
    
    if (round < 10) {
      setTimeout(() => {
        setRound(round + 1);
        generateQuestion();
        setTimeLeft(10);
        setUserAnswer("");
      }, 2000);
    }
  };

  const handleAnswer = () => {
    if (parseInt(userAnswer) === currentQuestion.answer) {
      const updatedPlayers = [...players];
      updatedPlayers[0].score += 10;
      setPlayers(updatedPlayers);
    }
    handleTimeUp();
  };

  const startGame = () => {
    setGameStarted(true);
    generateQuestion();
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Çok Oyunculu Yarışma</h1>
          <p className="text-xl text-gray-600">Hızlı Matematik Yarışması</p>
        </div>

        {!gameStarted ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Yarışmaya Katıl</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">4 oyuncu ile yarış!</p>
              <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
                Yarışmaya Başla
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Tur {round} / 10</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-700 mb-4">
                    {currentQuestion.question}
                  </div>
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <Clock className="w-6 h-6 text-red-500" />
                    <span className="text-2xl font-bold text-red-500">{timeLeft}s</span>
                  </div>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-32 h-16 text-2xl text-center border-2 border-purple-300 rounded-lg"
                    placeholder="?"
                  />
                  <Button onClick={handleAnswer} className="ml-4 bg-purple-600">
                    Cevapla
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedPlayers.map((player, index) => (
                <Card key={player.id} className={index === 0 ? "border-2 border-yellow-400" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{player.avatar}</span>
                        <div>
                          <div className="font-bold">{player.name}</div>
                          <div className="text-sm text-gray-500">Puan: {player.score}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                        <span className="ml-2 text-lg font-bold">#{index + 1}</span>
                      </div>
                    </div>
                    <Progress value={(player.score / 100) * 100} className="mt-2 h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {round === 10 && (
              <Card className="text-center">
                <CardContent className="p-6">
                  <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Yarışma Bitti!</h3>
                  <p className="text-lg">Kazanan: {sortedPlayers[0].name} 🎉</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}