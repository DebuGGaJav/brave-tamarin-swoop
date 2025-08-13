import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";
import { MathCharacter } from "@/components/MathCharacter";
import { DifficultySelector } from "@/components/DifficultySelector";
import { ProgressTracker } from "@/components/ProgressTracker";
import { useSoundFeedback } from "@/components/SoundFeedback";

const ToplamaPage = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [characterMood, setCharacterMood] = useState<"happy" | "excited" | "sad">("happy");
  const { playSuccessSound, playErrorSound } = useSoundFeedback();

  const getMaxNumber = () => {
    switch (difficulty) {
      case "easy": return 5;
      case "medium": return 10;
      case "hard": return 20;
    }
  };

  const generateNumbers = () => {
    const max = getMaxNumber();
    setNum1(Math.floor(Math.random() * max) + 1);
    setNum2(Math.floor(Math.random() * max) + 1);
  };

  useEffect(() => {
    generateNumbers();
  }, [difficulty]);

  const checkAnswer = () => {
    const userAnswer = parseInt(answer);
    setTotalQuestions(totalQuestions + 1);
    
    if (userAnswer === num1 + num2) {
      playSuccessSound();
      setCharacterMood("excited");
      showSuccess("Tebrikler! Doğru cevap!");
      setIsCorrect(true);
      setCorrectAnswers(correctAnswers + 1);
      
      setTimeout(() => {
        generateNumbers();
        setAnswer("");
        setIsCorrect(null);
        setCharacterMood("happy");
      }, 2000);
    } else {
      playErrorSound();
      setCharacterMood("sad");
      showError("Tekrar deneyelim!");
      setIsCorrect(false);
      
      setTimeout(() => {
        setIsCorrect(null);
        setCharacterMood("happy");
      }, 2000);
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
          Toplama İşlemleri
        </h1>

        <ProgressTracker 
          topic="Toplama" 
          correctAnswers={correctAnswers} 
          totalQuestions={totalQuestions} 
        />
        
        <DifficultySelector 
          onSelect={setDifficulty} 
          currentLevel={difficulty} 
        />

        <div className="bg-white rounded-xl shadow-lg p-8 mb-4">
          <div className="flex justify-center mb-6">
            <MathCharacter 
              mood={characterMood} 
              message={isCorrect === true ? "Harika! Devam et!" : isCorrect === false ? "Bir daha dene!" : "Hadi toplayalım!"}
            />
          </div>

          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="text-6xl font-bold text-purple-700 animate-pulse">{num1}</div>
            <div className="text-5xl font-bold text-purple-700">+</div>
            <div className="text-6xl font-bold text-purple-700 animate-pulse">{num2}</div>
            <div className="text-5xl font-bold text-purple-700">=</div>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-24 h-24 text-4xl text-center border-4 border-purple-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all duration-300"
            />
          </div>

          {isCorrect !== null && (
            <div className={`text-center text-3xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? <Check className="inline mr-2" /> : <X className="inline mr-2" />}
              {isCorrect ? 'Doğru!' : 'Yanlış!'}
            </div>
          )}

          <Button
            onClick={checkAnswer}
            className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-xl transform hover:scale-105 transition-transform duration-300"
          >
            Kontrol Et
          </Button>
        </div>

        <div className="text-center text-gray-500">
          <p className="text-lg">Toplamayı öğrenmek çok eğlenceli!</p>
          <p className="text-sm mt-2">Zorluk: {difficulty === "easy" ? "Kolay" : difficulty === "medium" ? "Orta" : "Zor"}</p>
        </div>
      </div>
    </div>
  );
};

export default ToplamaPage;