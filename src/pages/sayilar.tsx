import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";

const SayilarPage = () => {
  const navigate = useNavigate();
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [currentNumber, setCurrentNumber] = useState(numbers[Math.floor(Math.random() * numbers.length)]);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkAnswer = () => {
    if (userInput === currentNumber.toString()) {
      showSuccess("Harika! Doğru sayı!");
      setIsCorrect(true);
      setTimeout(() => {
        setCurrentNumber(numbers[Math.floor(Math.random() * numbers.length)]);
        setUserInput("");
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
          Sayıları Öğrenelim
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col items-center mb-8">
            <div className="text-8xl font-bold text-purple-700 mb-6">
              {currentNumber}
            </div>
            <p className="text-xl text-gray-600 mb-4">Bu sayıyı yaz:</p>
            <input
              type="number"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-32 h-20 text-4xl text-center border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          Sayıları öğrenmek çok kolay!
        </div>
      </div>
    </div>
  );
};

export default SayilarPage;