import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gem, Sparkles, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { showSuccess, showError } from '@/utils/toast';

const candies = ['🍬', '🍭', '🍫', '🍩', '🍪', '🧁'];
const BOARD_SIZE = 8;

type Board = string[][];

const generateBoard = (): Board => {
  const board: Board = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    board.push([]);
    for (let j = 0; j < BOARD_SIZE; j++) {
      board[i].push(candies[Math.floor(Math.random() * candies.length)]);
    }
  }
  return board;
};

const checkMatches = (board: Board): { newBoard: Board, matchesFound: boolean } => {
  let newBoard = board.map(row => [...row]);
  let matchesFound = false;

  // Check horizontal matches
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE - 2; c++) {
      if (newBoard[r][c] === newBoard[r][c+1] && newBoard[r][c+1] === newBoard[r][c+2]) {
        newBoard[r][c] = '';
        newBoard[r][c+1] = '';
        newBoard[r][c+2] = '';
        matchesFound = true;
      }
    }
  }

  // Check vertical matches
  for (let c = 0; c < BOARD_SIZE; c++) {
    for (let r = 0; r < BOARD_SIZE - 2; r++) {
      if (newBoard[r][c] === newBoard[r+1][c] && newBoard[r+1][c] === newBoard[r+2][c]) {
        newBoard[r][c] = '';
        newBoard[r+1][c] = '';
        newBoard[r+2][c] = '';
        matchesFound = true;
      }
    }
  }
  return { newBoard, matchesFound };
};

const applyGravity = (board: Board): Board => {
  const newBoard = board.map(row => [...row]);
  for (let c = 0; c < BOARD_SIZE; c++) {
    let emptyCells: number[] = [];
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      if (newBoard[r][c] === '') {
        emptyCells.push(r);
      } else if (emptyCells.length > 0) {
        newBoard[emptyCells.shift()!][c] = newBoard[r][c];
        newBoard[r][c] = '';
        emptyCells.push(r);
      }
    }
  }
  return newBoard;
};

const fillEmptyCells = (board: Board): Board => {
  const newBoard = board.map(row => [...row]);
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (newBoard[r][c] === '') {
        newBoard[r][c] = candies[Math.floor(Math.random() * candies.length)];
      }
    }
  }
  return newBoard;
};

interface CandyCrushGameProps {
  onGameEnd: (score: number) => void;
  onClose: () => void;
}

const CandyCrushGame: React.FC<CandyCrushGameProps> = ({ onGameEnd, onClose }) => {
  const [board, setBoard] = useState<Board>(generateBoard());
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(10);
  const [selectedCandy, setSelectedCandy] = useState<{ r: number, c: number } | null>(null);

  useEffect(() => {
    let currentBoard = board;
    let matchesFound = true;
    while (matchesFound) {
      const { newBoard, matchesFound: found } = checkMatches(currentBoard);
      currentBoard = applyGravity(newBoard);
      currentBoard = fillEmptyCells(currentBoard);
      matchesFound = found;
      if (found) {
        setScore(prev => prev + 10); // Score for each match
      }
    }
    setBoard(currentBoard);
  }, [board]);

  const handleCandyClick = (r: number, c: number) => {
    if (selectedCandy) {
      const [r1, c1] = [selectedCandy.r, selectedCandy.c];
      const [r2, c2] = [r, c];

      // Check if adjacent
      const isAdjacent = (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);

      if (isAdjacent) {
        const newBoard = board.map(row => [...row]);
        [newBoard[r1][c1], newBoard[r2][c2]] = [newBoard[r2][c2], newBoard[r1][c1]];
        
        const { matchesFound } = checkMatches(newBoard);
        if (matchesFound) {
          setBoard(newBoard);
          setMovesLeft(prev => prev - 1);
        } else {
          showError("Geçersiz hamle! Eşleşme yok.");
        }
      } else {
        showError("Sadece bitişik şekerleri değiştirebilirsin.");
      }
      setSelectedCandy(null);
    } else {
      setSelectedCandy({ r, c });
    }
  };

  useEffect(() => {
    if (movesLeft <= 0) {
      showSuccess(`Oyun bitti! Puanınız: ${score}`);
      onGameEnd(score);
    }
  }, [movesLeft, score, onGameEnd]);

  return (
    <Card className="w-full max-w-lg mx-auto bg-gradient-to-br from-pink-100 to-purple-100 shadow-2xl border-4 border-pink-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl sm:text-2xl font-bold text-purple-700 flex items-center">
          <Gem className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-pink-500" />
          Şeker Patlatma Oyunu
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XCircle className="w-6 h-6" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4 p-2 bg-white rounded-lg shadow-md">
          <div className="text-base sm:text-lg font-semibold text-gray-700">Puan: <span className="text-green-600">{score}</span></div>
          <div className="text-base sm:text-lg font-semibold text-gray-700">Hamle: <span className="text-blue-600">{movesLeft}</span></div>
        </div>

        <div className="grid gap-0.5 sm:gap-1" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
          {board.flat().map((candy, index) => {
            const r = Math.floor(index / BOARD_SIZE);
            const c = index % BOARD_SIZE;
            const isSelected = selectedCandy && selectedCandy.r === r && selectedCandy.c === c;
            return (
              <motion.div
                key={index}
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-2xl sm:text-3xl rounded-md cursor-pointer transition-all duration-100 ${
                  isSelected ? 'ring-4 ring-blue-500 scale-110' : ''
                }`}
                onClick={() => handleCandyClick(r, c)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: (r + c) * 0.02 }}
              >
                {candy}
              </motion.div>
            );
          })}
        </div>

        {movesLeft <= 0 && (
          <div className="text-center mt-6">
            <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-lg">
              Kapat
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CandyCrushGame;