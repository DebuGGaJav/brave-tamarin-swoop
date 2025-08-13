import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListOrdered, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError } from '@/utils/toast';

interface NumberOrderingGameProps {
  onGameEnd: (score: number) => void;
  onClose: () => void;
}

const generateNumbers = (count: number, maxNum: number): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * maxNum) + 1);
  }
  return Array.from(numbers);
};

const NumberOrderingGame: React.FC<NumberOrderingGameProps> = ({ onGameEnd, onClose }) => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState<boolean | null>(null); // true for correct, false for incorrect
  const maxRounds = 5;
  const numbersPerRound = 4;
  const maxNumberValue = 20;

  useEffect(() => {
    if (round <= maxRounds) {
      setNumbers(generateNumbers(numbersPerRound, maxNumberValue));
      setSelectedNumbers([]);
      setFeedback(null);
    } else {
      onGameEnd(score);
    }
  }, [round]);

  const handleNumberClick = (num: number) => {
    if (feedback !== null) return; // Prevent clicks after feedback is shown
    if (!selectedNumbers.includes(num)) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const checkOrder = () => {
    if (selectedNumbers.length !== numbers.length) {
      showError("Tüm sayıları seçmelisin!");
      return;
    }

    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const isCorrect = JSON.stringify(selectedNumbers) === JSON.stringify(sortedNumbers);
    setFeedback(isCorrect);

    if (isCorrect) {
      setScore(prev => prev + 20);
      showSuccess("Doğru sıralama! 🎉");
    } else {
      showError("Yanlış sıralama! Tekrar dene. ❌");
    }

    setTimeout(() => {
      setRound(prev => prev + 1);
    }, 1500); // Short delay before next round
  };

  const resetRound = () => {
    setSelectedNumbers([]);
    setFeedback(null);
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-gradient-to-br from-blue-100 to-purple-100 shadow-2xl border-4 border-blue-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl sm:text-2xl font-bold text-purple-700 flex items-center">
          <ListOrdered className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-500" />
          Sayı Sıralama Oyunu
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XCircle className="w-6 h-6" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4 p-2 bg-white rounded-lg shadow-md">
          <div className="text-base sm:text-lg font-semibold text-gray-700">Puan: <span className="text-green-600">{score}</span></div>
          <div className="text-base sm:text-lg font-semibold text-gray-700">Tur: <span className="text-blue-600">{round}/{maxRounds}</span></div>
        </div>

        {round <= maxRounds ? (
          <>
            <p className="text-center text-lg sm:text-xl font-semibold text-gray-800 mb-4">Sayıları küçükten büyüğe sırala:</p>
            <div className="flex justify-center flex-wrap gap-3 mb-6">
              {numbers.map((num) => (
                <motion.div
                  key={num}
                  className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-xl sm:text-2xl font-bold rounded-lg cursor-pointer transition-all duration-200
                    ${selectedNumbers.includes(num) ? 'bg-blue-500 text-white scale-110' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
                    ${feedback !== null ? 'pointer-events-none' : ''}
                  `}
                  onClick={() => handleNumberClick(num)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {num}
                </motion.div>
              ))}
            </div>

            <div className="mb-6 p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[60px] flex flex-wrap items-center gap-2">
              <p className="text-sm text-gray-600 mr-2">Sıralama:</p>
              {selectedNumbers.map((num, index) => (
                <motion.span
                  key={index}
                  className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {num}
                </motion.span>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={checkOrder}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-lg"
                disabled={selectedNumbers.length !== numbers.length || feedback !== null}
              >
                Sıralamayı Kontrol Et
              </Button>
              <Button
                onClick={resetRound}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700 font-bold py-2 px-6 rounded-full shadow-lg"
                disabled={feedback !== null}
              >
                Sıfırla
              </Button>
            </div>

            <AnimatePresence>
              {feedback !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-4 text-center text-lg font-bold p-3 rounded-lg ${feedback ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                >
                  {feedback ? '🎉 Doğru! 🎉' : '❌ Yanlış! ❌'}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Oyun Bitti!</h3>
            <p className="text-lg">Toplam Puanınız: {score}</p>
            <Button onClick={onClose} className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-lg">
              Kapat
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NumberOrderingGame;