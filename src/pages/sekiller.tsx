import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";

const shapes = [
  { name: "Kare", sides: 4, color: "bg-red-400" },
  { name: "Üçgen", sides: 3, color: "bg-blue-400" },
  { name: "Daire", sides: 0, color: "bg-green-400 rounded-full" },
  { name: "Dikdörtgen", sides: 4, color: "bg-yellow-400 w-32 h-20" },
];

const SekillerPage = () => {
  const navigate = useNavigate();
  const [currentShape, setCurrentShape] = useState(shapes[Math.floor(Math.random() * shapes.length)]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkAnswer = () => {
    if (userAnswer.toLowerCase() === currentShape.name.toLowerCase()) {
      showSuccess("Bravo! Doğru şekil!");
      setIsCorrect(true);
      setTimeout(() => {
        setCurrentShape(shapes[Math.floor(Math.random() * shapes.length)]);
        setUserAnswer("");
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
          Şekilleri Öğrenelim
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col items-center mb-8">
            <div className={`w-24 h-24 ${currentShape.color} flex items-center justify-center mb-6`}>
              {currentShape.sides > 0 && (
                <div className="text-white text-xl font-bold">{currentShape.sides}</div>
              )}
            </div>
            <p className="text-xl text-gray-600 mb-4">Bu şeklin adı nedir?</p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full p-4 text-xl text-center border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Şeklin adını yaz..."
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
          Şekiller dünyasını keşfedelim!
        </div>
      </div>
    </div>
  );
};

export default SekillerPage;