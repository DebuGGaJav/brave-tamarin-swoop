import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";
import { ScoreBoard } from "@/components/ScoreBoard";

const problems = [
  {
    question: "Ali'nin 3 elması var. Ayşe 2 elma daha verdi. Ali'nin kaç elması var?",
    answer: 5,
    image: "🍎🍎🍎 + 🍎🍎 = ?"
  },
  {
    question: "Sınıfta 4 kız öğrenci var. 2 erkek öğrenci daha geldi. Kaç öğrenci var?",
    answer: 6,
    image: "👧👧👧👧 + 👦👦 = ?"
  },
  {
    question: "5 balondan 2'si patladı. Kaç balon kaldı?",
    answer: 3,
    image: "🎈🎈🎈🎈🎈 - 💥💥 = ?"
  },
  {
    question: "7 arabadan 3'ü gitti. Kaç araba kaldı?",
    answer: 4,
    image: "🚗🚗🚗🚗🚗🚗🚗 - 🚗🚗🚗 = ?"
  },
];

const ProblemCozmePage = () => {
  const navigate = useNavigate();
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const currentProblemData = problems[currentProblem];

  const checkAnswer = () => {
    const userAnswerNum = parseInt(userAnswer);
    setTotalQuestions(totalQuestions + 1);
    
    if (userAnswerNum === currentProblemData.answer) {
      showSuccess("Harika! Problem çözmeyi çok iyi biliyorsun!");
      setIsCorrect(true);
      setCorrectAnswers(correctAnswers + 1);
      
      setTimeout(() => {
        if (currentProblem < problems.length - 1) {
          setCurrentProblem(currentProblem + 1);
          setUserAnswer("");
          setIsCorrect(null);
        } else {
          showSuccess("Tebrikler! Tüm problemleri çözdün!");
          setTimeout(() => navigate("/"), 2000);
        }
      }, 1500);
    } else {
      showError("Bir daha düşünelim!");
      setIsCorrect(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Button 
          onClick={() => navigate("/")}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="mr-2" /> Geri Dön
        </Button>

        <h1 className="text-3xl font-bold text-center text-purple-600 mb-4">
          Problem Çözme
        </h1>

        <ScoreBoard correctAnswers={correctAnswers} totalQuestions={totalQuestions} />

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <p className="text-xl text-gray-700 mb-4">
              {currentProblemData.question}
            </p>
            <div className="text-4xl mb-4">
              {currentProblemData.image}
            </div>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-32 h-16 text-2xl text-center border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="?"
            />
          </div>

          {isCorrect !== null && (
            <div className={`text-center text-2xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? <Check className="inline mr-2" /> : <X className="inline mr-2" />}
              {isCorrect ? 'Doğru cevap!' : 'Yanlış, tekrar deneyin!'}
            </div>
          )}

          <div className="flex justify-center">
            <Button
              onClick={checkAnswer}
              className="bg-purple-600 hover:bg-purple-700 text-xl px-8 py-4"
            >
              Kontrol Et
            </Button>
          </div>

          <div className="text-center mt-4 text-sm text-gray-500">
            Problem {currentProblem + 1} / {problems.length}
          </div>
        </div>

        <div className="text-center text-gray-500">
          Günlük problemleri çözmek çok eğlenceli!
        </div>
      </div>
    </div>
  );
};

export default ProblemCozmePage;