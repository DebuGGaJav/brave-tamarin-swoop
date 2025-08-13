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
    const timer = setTimeout(() => setIsAnimating(false), 500); // Animasyon süresine uygun hale getirildi
    return () => clearTimeout(timer);
  }, [mood]);

  const getCharacterImage = () => {
    switch (mood) {
      case "happy": return "/images/math_character_happy.png";
      case "sad": return "/images/math_character_sad.png";
      case "excited": return "/images/math_character_excited.png";
      default: return "/images/math_character_happy.png"; // Default to happy
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
    <div className={`text-center transition-transform duration-300 ease-out ${isAnimating ? 'scale-110' : 'scale-100'}`}>
      <div className="relative inline-block">
        <img 
          src={getCharacterImage()} 
          alt="Math Character" 
          className="w-32 h-32 object-contain mb-4"
        />
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