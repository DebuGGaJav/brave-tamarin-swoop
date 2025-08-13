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
      case "happy": return "from-green-400 to-green-500";
      case "sad": return "from-red-400 to-red-500";
      case "excited": return "from-yellow-400 to-yellow-500";
      default: return "from-blue-400 to-blue-500";
    }
  };

  const getCharacterIcon = () => {
    switch (mood) {
      case "happy": return <ThumbsUp className="w-6 h-6 text-white" />;
      case "sad": return <ThumbsDown className="w-6 h-6 text-white" />;
      case "excited": return <Star className="w-6 h-6 text-white" />;
      default: return <Heart className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className={`text-center transition-all duration-500 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
      <div className="relative inline-block">
        <div className={`text-8xl mb-4 bg-gradient-to-r ${getCharacterColor()} bg-clip-text text-transparent`}>
          {getCharacterEmoji()}
        </div>
        <div className="absolute -top-2 -right-2">
          <div className={`p-2 rounded-full bg-gradient-to-r ${getCharacterColor()} shadow-lg`}>
            {getCharacterIcon()}
          </div>
        </div>
      </div>
      {message && (
        <div className="bg-white rounded-xl shadow-xl p-4 max-w-xs mx-auto border-2 border-purple-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-700 font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};