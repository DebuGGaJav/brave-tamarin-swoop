import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";

const ToplamaPage = () => {
  const navigate = useNavigate();
  const [num1, setNum1] = useState(Math.floor(Math.random() * 5) + 1);
  const [num2, setNum2] = useState(Math.floor(Math.random() * 5) + 1);
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkAnswer = () => {
    const userAnswer = parseInt(answer);
    if (userAnswer === num1 + num2) {
      showSuccess("Tebrikler! Doğru cevap!");
      setIsCorrect(true);
      setTimeout(() => {
        setNum1(Math.floor(Math.random() * 5) + 1);
        setNum2(Math.floor(Math.random() * 5) + 1);
        setAnswer("");
        setIsCorrect(null);
      }, 1500);
    } else {
      showError("Tekrar deneyelim!");
      setIsCorrect(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        <Button 
          onClick={() => navigate("/")}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="mr-2" /> Geri Dön
        </Button>

        <h1 className="text-3xl font-bold text-center text-purple-600 mb-8">
          Toplama İşlemleri
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="text-5xl font-bold text-purple-700">{num1}</div>
            <div className="text-5xl font-bold text-purple-700">+</div>
            <div className="text-5xl font-bold text-purple-700">{num2}</div>
            <div className="text-5xl font-bold text-purple-700">=</div>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-20 h-20 text-3xl text-center border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {isCorrect !== null && (
            <div className={`text-center text-2xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? <Check className="inline mr-2" /> : <X className="inline mr-2" />}
              {isCorrect ? 'Doğru!' : 'Yanlış!'}
            </div>
          )}

          <Button
            onClick={checkAnswer}
            className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-xl"
          >
            Kontrol Et
          </Button>
        </div>

        <div className="text-center text-gray-500">
          Toplamayı öğrenmek çok eğlenceli!
        </div>
      </div>
    </div>
  );
};

export default ToplamaPage;