import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { showSuccess, showError } from "@/utils/toast";

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

const GAME_ROUNDS = 10;
const ROUND_DURATION = 10; // seconds

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
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setUserAnswer("");
    setFeedbackMessage(null);
    setIsCorrectAnswer(null);
    inputRef.current?.focus();
  };

  const processRoundEnd = () => {
    const updatedPlayers = players.map((player, index) => {
      if (index === 0) { // Kullanıcı oyuncusu
        return player; // Kullanıcının puanı handleAnswer'da güncelleniyor
      } else { // Bilgisayar oyuncuları
        const newPlayer = { ...player };
        const randomAnswer = Math.random() > 0.3 ? currentQuestion.answer : currentQuestion.answer + Math.floor(Math.random() * 3) - 1;
        if (randomAnswer === currentQuestion.answer) {
          newPlayer.score += 10;
        }
        return newPlayer;
      }
    });
    setPlayers(updatedPlayers);

    if (round < GAME_ROUNDS) {
      setTimeout(() => {
        setRound(prev => prev + 1);
        setTimeLeft(ROUND_DURATION);
        generateQuestion();
      }, 1500); // Geri bildirim süresi
    } else {
      setGameStarted(false); // Oyun bitti
      showSuccess("Oyun Bitti! Sonuçlar açıklandı.");
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameStarted) {
      processRoundEnd();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, round]); // round'u bağımlılıklara ekledik

  const handleAnswer = () => {
    if (!gameStarted || userAnswer === "") return;

    const isCorrect = parseInt(userAnswer) === currentQuestion.answer;
    setIsCorrectAnswer(isCorrect);
    setFeedbackMessage(isCorrect ? "🎉 Doğru cevap! 🎉" : `❌ Yanlış! Doğru cevap: ${currentQuestion.answer} ❌`);

    if (isCorrect) {
      setPlayers(prevPlayers => prevPlayers.map(p => p.id === "1" ? { ...p, score: p.score + 10 } : p));
    } else {
      showError("Yanlış cevap!");
    }
    
    // Kullanıcı cevapladığında turu bitir ve bir sonraki tura geç
    setTimeLeft(0); // Zamanı sıfırlayarak processRoundEnd'i tetikle
  };

  const startGame = () => {
    setGameStarted(true);
    setRound(1);
    setPlayers(players.map(p => ({ ...p, score: 0 }))); // Skorları sıfırla
    generateQuestion();
    setTimeLeft(ROUND_DURATION);
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-600 mb-2">Çok Oyunculu Yarışma</h1>
          <p className="text-lg sm:text-xl text-gray-600">Hızlı Matematik Yarışması</p>
        </div>

        {!gameStarted ? (
          <Card className="max-w-md mx-auto shadow-xl border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-center text-xl sm:text-2xl text-purple-600">Yarışmaya Katıl</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4 text-base sm:text-lg text-gray-700">4 oyuncu ile yarış!</p>
              <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl">
                Yarışmaya Başla
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="shadow-xl border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-center text-xl sm:text-2xl text-purple-600">Tur {round} / {GAME_ROUNDS}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-purple-700 mb-4">
                    {currentQuestion.question}
                  </div>
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                    <span className="text-2xl sm:text-3xl font-bold text-red-500">{timeLeft}s</span>
                  </div>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleAnswer(); }}
                    className="w-32 h-16 text-2xl sm:text-3xl text-center border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="?"
                    ref={inputRef}
                  />
                  <Button onClick={handleAnswer} className="ml-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl">
                    Cevapla
                  </Button>
                </div>
                {feedbackMessage && (
                  <div className={`mt-4 text-center text-lg font-bold p-3 rounded-lg ${isCorrectAnswer ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {feedbackMessage}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {sortedPlayers.map((player, index) => (
                <Card key={player.id} className={`shadow-xl border-2 ${index === 0 ? "border-yellow-400" : "border-gray-200"}`}>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl sm:text-3xl">{player.avatar}</span>
                        <div>
                          <div className="font-bold text-base sm:text-lg">{player.name}</div>
                          <div className="text-sm text-gray-500">Puan: {player.score}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {index === 0 && <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />}
                        <span className="ml-2 text-lg sm:text-xl font-bold">#{index + 1}</span>
                      </div>
                    </div>
                    <Progress value={(player.score / (GAME_ROUNDS * 10)) * 100} className="mt-2 h-2 sm:h-3" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {round === GAME_ROUNDS && !gameStarted && ( // Oyun bittiğinde bu kartı göster
              <Card className="text-center shadow-xl border-2 border-purple-200">
                <CardContent className="p-6 sm:p-8">
                  <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2">Yarışma Bitti!</h3>
                  <p className="text-lg sm:text-xl">Kazanan: {sortedPlayers[0].name} 🎉</p>
                  <Button onClick={startGame} className="mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl">
                    Tekrar Oyna
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}