import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, X, Divide, Clock, Trophy } from "lucide-react";
import { MathCharacter } from "@/components/MathCharacter";
import { useSoundFeedback } from "@/components/SoundFeedback";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

type Operation = "toplama" | "cikarma" | "carpma" | "bolme";

interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}

const GAME_DURATION = 60; // seconds

const TimedChallengePage = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [sessionCorrectAnswers, setSessionCorrectAnswers] = useState(0); // Session-specific
  const [sessionTotalQuestions, setSessionTotalQuestions] = useState(0); // Session-specific
  const [characterMood, setCharacterMood] = useState<"happy" | "sad" | "neutral" | "excited">("neutral");
  const { playSuccessSound, playErrorSound } = useSoundFeedback();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionPoints, setSessionPoints] = useState(0); // Session-specific

  const generateQuestion = () => {
    const maxNum = 15;
    const operations: Operation[] = ["toplama", "cikarma", "carpma", "bolme"];
    const randomOperation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    switch (randomOperation) {
      case "toplama":
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * maxNum) + 1;
        answer = num1 + num2;
        break;
      case "cikarma":
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case "carpma":
        num1 = Math.floor(Math.random() * (maxNum / 2)) + 1;
        num2 = Math.floor(Math.random() * (maxNum / 2)) + 1;
        answer = num1 * num2;
        break;
      case "bolme":
        let divisorMax = Math.floor(maxNum / 3);
        if (divisorMax < 1) divisorMax = 1;
        num2 = Math.floor(Math.random() * divisorMax) + 1;
        num1 = num2 * (Math.floor(Math.random() * (maxNum / num2)) + 1);
        answer = num1 / num2;
        break;
      default:
        num1 = 0; num2 = 0; answer = 0;
    }
    setCurrentQuestion({ num1, num2, operation: randomOperation, answer });
    setUserAnswer("");
    setCharacterMood("neutral");
    setIsCorrect(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameStarted) {
      setGameEnded(true);
      setGameStarted(false);
      setCharacterMood("excited");
      if (typeof window !== 'undefined' && (window as any).updateStudentStats) {
        (window as any).updateStudentStats(sessionCorrectAnswers, sessionTotalQuestions, sessionPoints);
      }
    }
  }, [gameStarted, timeLeft]);

  useEffect(() => {
    if (gameStarted) {
      generateQuestion();
    }
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setGameEnded(false);
    setTimeLeft(GAME_DURATION);
    setSessionCorrectAnswers(0);
    setSessionTotalQuestions(0);
    setSessionPoints(0);
    generateQuestion();
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion) return;
    setSessionTotalQuestions((prev) => prev + 1);
    const correct = parseInt(userAnswer) === currentQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      setSessionCorrectAnswers((prev) => prev + 1);
      setSessionPoints((prev) => prev + 10);
      setCharacterMood("happy");
      playSuccessSound();
    } else {
      setCharacterMood("sad");
      playErrorSound();
    }
    setTimeout(() => {
      generateQuestion();
    }, 500);
  };

  const getOperationSymbol = (operation: Operation) => {
    switch (operation) {
      case "toplama": return <Plus className="w-8 h-8 text-purple-600" />;
      case "cikarma": return <Minus className="w-8 h-8 text-red-600" />;
      case "carpma": return <X className="w-8 h-8 text-orange-600" />;
      case "bolme": return <Divide className="w-8 h-8 text-indigo-600" />;
      default: return null;
    }
  };

  const getOperationColor = (operation: Operation) => {
    switch (operation) {
      case "toplama": return "text-purple-600";
      case "cikarma": return "text-red-600";
      case "carpma": return "text-orange-600";
      case "bolme": return "text-indigo-600";
      default: return "text-gray-600";
    }
  };

  const getCardBorderColor = (operation: Operation) => {
    switch (operation) {
      case "toplama": return "border-purple-200";
      case "cikarma": return "border-red-200";
      case "carpma": return "border-orange-200";
      case "bolme": return "border-indigo-200";
      default: return "border-gray-200";
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-2">Zamanlı Yarışma</h1>
          <p className="text-lg sm:text-xl text-gray-600">Süre bitmeden ne kadar soru çözebilirsin?</p>
        </div>

        {!gameStarted && !gameEnded && (
          <Card className="max-w-md mx-auto shadow-xl border-2 border-green-200">
            <CardHeader>
              <CardTitle className="text-center text-xl sm:text-2xl text-green-600">Hazır mısın?</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4 text-base sm:text-lg text-gray-700">
                {GAME_DURATION} saniye içinde olabildiğince çok matematik sorusu çöz!
              </p>
              <Button onClick={startGame} className="bg-green-600 hover:bg-green-700 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl">
                Başla!
              </Button>
            </CardContent>
          </Card>
        )}

        {gameStarted && currentQuestion && (
          <Card className={`mb-4 shadow-xl border-2 ${getCardBorderColor(currentQuestion.operation)}`}>
            <CardHeader>
              <CardTitle className={`text-center ${getOperationColor(currentQuestion.operation)} text-xl sm:text-2xl`}>
                {currentQuestion.operation.charAt(0).toUpperCase() + currentQuestion.operation.slice(1)} Sorusu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2 text-lg sm:text-xl font-bold text-gray-700">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Doğru: {sessionCorrectAnswers}</span>
                </div>
                <div className="flex items-center space-x-2 text-lg sm:text-xl font-bold text-red-600">
                  <Clock className="w-5 h-5" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
              <Progress value={(timeLeft / GAME_DURATION) * 100} className="h-2 mb-6" />

              <div className="text-center mb-6">
                <div className="flex justify-center items-center space-x-3 sm:space-x-4 mb-6">
                  <div className={`text-3xl sm:text-4xl font-bold ${getOperationColor(currentQuestion.operation)}`}>{currentQuestion.num1}</div>
                  {getOperationSymbol(currentQuestion.operation)}
                  <div className={`text-3xl sm:text-4xl font-bold ${getOperationColor(currentQuestion.operation)}`}>{currentQuestion.num2}</div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-400">=</div>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleCheckAnswer(); }}
                    className="w-24 h-12 sm:w-32 sm:h-16 text-xl sm:text-2xl text-center border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="?"
                    ref={inputRef}
                  />
                </div>

                <MathCharacter mood={characterMood} />

                <AnimatePresence>
                  {userAnswer !== "" && (
                    <motion.div
                      key={sessionTotalQuestions}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className={`text-center text-lg sm:text-xl font-bold mb-4 p-3 sm:p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-600 border-2 border-green-300' : 'bg-red-100 text-red-600 border-2 border-red-300'}`}
                    >
                      {isCorrect ? '🎉 Doğru cevap! 🎉' : `❌ Yanlış! Doğru cevap: ${currentQuestion.answer} ❌`}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={handleCheckAnswer}
                    className={`bg-purple-600 hover:bg-purple-700 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200`}
                    disabled={userAnswer === ""}
                  >
                    Cevapla
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {gameEnded && (
          <Card className="max-w-md mx-auto shadow-xl border-2 border-green-200">
            <CardHeader>
              <CardTitle className="text-center text-xl sm:text-2xl text-green-600">Yarışma Bitti!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                {sessionCorrectAnswers} / {sessionTotalQuestions} Doğru Cevap!
              </p>
              <p className="text-lg sm:text-xl text-gray-600 mb-4">
                Başarı Oranı: {sessionTotalQuestions > 0 ? Math.round((sessionCorrectAnswers / sessionTotalQuestions) * 100) : 0}%
              </p>
              <Button onClick={startGame} className="bg-green-600 hover:bg-green-700 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl">
                Tekrar Oyna
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TimedChallengePage;