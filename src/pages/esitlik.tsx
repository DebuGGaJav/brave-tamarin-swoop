import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";

const equalityExamples = [
  { left: 3, right: 3, isEqual: true },
  { left: 5, right: 2, isEqual: false },
  { left: 4, right: 4, isEqual: true },
  { left: 7, right: 5, isEqual: false },
  { left: 2, right: 2, isEqual: true },
];

const EsitlikPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentExample = equalityExamples[currentIndex];

  const checkAnswer = (answer: boolean) => {
    setUserAnswer(answer);
    if (answer === currentExample.isEqual) {
      showSuccess("Harika! Eşitlik kavramını çok iyi anladın!");
      setIsCorrect(true);
      setTimeout(() => {
        if (currentIndex < equalityExamples.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setUserAnswer(null);
          setIsCorrect(null);
        } else {
          showSuccess("Tebrikler! Tüm eşitlik örneklerini tamamladın!");
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
      <div className="max-w-md mx-auto">
        <Button 
          onClick={() => navigate("/")}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="mr-2" /> Geri Dön
        </Button>

        <h1 className="text-3xl font-bold text-center text-purple-600 mb-8">
          Eşitlik Kavramı
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <p className="text-xl text-gray-600 mb-6">Bu sayılar eşit mi?</p>
            <div className="flex justify-center items-center space-x-8 mb-8">
              <div className="text-6xl font-bold text-purple-700">{currentExample.left}</div>
              <div className="text-4xl font-bold text-gray-500">=</div>
              <div className="text-6xl font-bold text-purple-700">{currentExample.right}</div>
            </div>
          </div>

          {isCorrect !== null && (
            <div className={`text-center text-2xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? <Check className="inline mr-2" /> : <X className="inline mr-2" />}
              {isCorrect ? 'Doğru!' : 'Yanlış!'}
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => checkAnswer(true)}
              className="bg-green-500 hover:bg-green-600 text-xl px-8 py-4"
            >
              Evet, Eşit
            </Button>
            <Button
              onClick={() => checkAnswer(false)}
              className="bg-red-500 hover:bg-red-600 text-xl px-8 py-4"
            >
              Hayır, Eşit Değil
            </Button>
          </div>

          <div className="text-center mt-4 text-sm text-gray-500">
            Soru {currentIndex + 1} / {equalityExamples.length}
          </div>
        </div>

        <div className="text-center text-gray-500">
          Eşitlik kavramını öğreniyoruz!
        </div>
      </div>
    </div>
  );
};

export default EsitlikPage;