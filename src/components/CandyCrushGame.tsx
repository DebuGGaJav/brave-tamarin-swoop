import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gem, Sparkles, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { showSuccess, showError } from '@/utils/toast';

const candies = ['🍬', '🍭', '🍫', '🍩', '🍪', '🧁'];
const BOARD_SIZE = 8;
const MIN_MATCH = 3;

type Board = string[][];
type Position = { r: number; c: number };

const generateInitialBoard = (): Board => {
  let board: Board;
  do {
    board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      board.push([]);
      for (let j = 0; j < BOARD_SIZE; j++) {
        let newCandy: string;
        do {
          newCandy = candies[Math.floor(Math.random() * candies.length)];
        } while (
          (j >= MIN_MATCH - 1 && board[i][j - 1] === newCandy && board[i][j - 2] === newCandy) ||
          (i >= MIN_MATCH - 1 && board[i - 1][j] === newCandy && board[i - 2][j] === newCandy)
        );
        board[i].push(newCandy);
      }
    }
  } while (findMatches(board).length > 0); // Ensure no initial matches
  return board;
};

const findMatches = (board: Board): Position[] => {
  const matches: Position[] = [];

  // Check horizontal matches
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE - (MIN_MATCH - 1); c++) {
      const currentCandy = board[r][c];
      if (currentCandy === '') continue; // Skip empty cells
      let matchCount = 1;
      for (let k = 1; k < MIN_MATCH; k++) {
        if (board[r][c + k] === currentCandy) {
          matchCount++;
        } else {
          break;
        }
      }
      if (matchCount >= MIN_MATCH) {
        for (let k = 0; k < matchCount; k++) {
          matches.push({ r, c: c + k });
        }
      }
    }
  }

  // Check vertical matches
  for (let c = 0; c < BOARD_SIZE; c++) {
    for (let r = 0; r < BOARD_SIZE - (MIN_MATCH - 1); r++) {
      const currentCandy = board[r][c];
      if (currentCandy === '') continue; // Skip empty cells
      let matchCount = 1;
      for (let k = 1; k < MIN_MATCH; k++) {
        if (board[r + k][c] === currentCandy) {
          matchCount++;
        } else {
          break;
        }
      }
      if (matchCount >= MIN_MATCH) {
        for (let k = 0; k < matchCount; k++) {
          matches.push({ r: r + k, c });
        }
      }
    }
  }
  return matches;
};

const clearMatches = (board: Board, matches: Position[]): Board => {
  const newBoard = board.map(row => [...row]);
  matches.forEach(({ r, c }) => {
    newBoard[r][c] = ''; // Clear matched candies
  });
  return newBoard;
};

const applyGravity = (board: Board): Board => {
  const newBoard = board.map(row => [...row]);
  for (let c = 0; c < BOARD_SIZE; c++) {
    let emptyRow = BOARD_SIZE - 1;
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      if (newBoard[r][c] !== '') {
        newBoard[emptyRow][c] = newBoard[r][c];
        if (emptyRow !== r) {
          newBoard[r][c] = '';
        }
        emptyRow--;
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
  const [board, setBoard] = useState<Board>(generateInitialBoard());
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(20); // Increased moves for better playability
  const [selectedCandy, setSelectedCandy] = useState<Position | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // To prevent rapid clicks during animation

  const processBoard = useCallback(async (currentBoard: Board) => {
    setIsProcessing(true);
    let boardChanged = true;
    let tempScore = 0;

    while (boardChanged) {
      boardChanged = false;
      const matches = findMatches(currentBoard);
      if (matches.length > 0) {
        tempScore += matches.length * 10; // Score based on number of candies cleared
        currentBoard = clearMatches(currentBoard, matches);
        setBoard(currentBoard); // Update UI to show cleared candies
        await new Promise(resolve => setTimeout(resolve, 300)); // Short delay for visual effect

        currentBoard = applyGravity(currentBoard);
        setBoard(currentBoard); // Update UI to show gravity
        await new Promise(resolve => setTimeout(resolve, 300));

        currentBoard = fillEmptyCells(currentBoard);
        setBoard(currentBoard); // Update UI to show new candies
        await new Promise(resolve => setTimeout(resolve, 300));
        
        boardChanged = true; // Keep looping if new matches formed
      }
    }
    setScore(prev => prev + tempScore);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    // Initial board processing to clear any accidental matches from generation
    processBoard(board);
  }, []); // Run only once on mount

  const handleCandyClick = async (r: number, c: number) => {
    if (isProcessing || movesLeft <= 0) return;

    if (selectedCandy) {
      const [r1, c1] = [selectedCandy.r, selectedCandy.c];
      const [r2, c2] = [r, c];

      // Check if adjacent
      const isAdjacent = (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);

      if (isAdjacent) {
        const newBoard = board.map(row => [...row]);
        [newBoard[r1][c1], newBoard[r2][c2]] = [newBoard[r2][c2], newBoard[r1][c1]];
        setBoard(newBoard); // Optimistically update UI

        const matchesAfterSwap = findMatches(newBoard);
        if (matchesAfterSwap.length > 0) {
          setMovesLeft(prev => prev - 1);
          setSelectedCandy(null);
          await processBoard(newBoard); // Process cascades
        } else {
          // If no match, swap back
          showError("Geçersiz hamle! Eşleşme yok.");
          [newBoard[r1][c1], newBoard[r2][c2]] = [newBoard[r2][c2], newBoard[r1][c1]]; // Swap back
          setBoard(newBoard); // Update UI to swap back
          setSelectedCandy(null);
        }
      } else {
        showError("Sadece bitişik şekerleri değiştirebilirsin.");
        setSelectedCandy({ r, c }); // Select new candy if not adjacent
      }
    } else {
      setSelectedCandy({ r, c });
    }
  };

  useEffect(() => {
    if (movesLeft <= 0 && !isProcessing) {
      showSuccess(`Oyun bitti! Puanınız: ${score}`);
      onGameEnd(score);
    }
  }, [movesLeft, score, onGameEnd, isProcessing]);

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
                key={`${r}-${c}-${candy}`} // Unique key for animation
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-2xl sm:text-3xl rounded-md cursor-pointer transition-all duration-100 ${
                  isSelected ? 'ring-4 ring-blue-500 scale-110' : ''
                } ${isProcessing ? 'pointer-events-none opacity-70' : ''}`}
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