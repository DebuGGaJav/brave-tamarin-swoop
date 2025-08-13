import { useState, useEffect } from "react";
import { Heart, Star, ThumbsUp, ThumbsDown } from "lucide-react";

interface MathCharacterProps {
  mood: "happy" | "sad" | "neutral" | "excited";
  message?: string;
}

export const MathCharacter = ({ mood, message }: MathCharacterProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [mood]);

  const getCharacterEmoji = () => {
    switch (mood) {
      case "happy": return "😊";
      case "sad": return "😢";
      case "excited": return "🤩";
      default: return "🙂";
    }
  };

  const getCharacterColor = () => {
    switch (mood) {
      case "happy": return "text-green-500";
      case "sad": return "text-red-500";
      case "excited": return "text-yellow-500";
      default: return "text-blue-500";
    }
  };

  return (
    <div className={`text-center transition-transform duration-500 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
      <div className={`text-6xl mb-2 ${getCharacterColor()}`}>
        {getCharacterEmoji()}
      </div>
      {message && (
        <div className="bg-white rounded-lg p-3 shadow-md max-w-xs mx-auto">
          <p className="text-sm text-gray-700">{message}</p>
        </div>
      )}
    </div>
  );
};