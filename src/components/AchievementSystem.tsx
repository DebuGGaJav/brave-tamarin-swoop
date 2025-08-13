import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Target, Zap, Award, Crown } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const AchievementSystem = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_correct",
      name: "İlk Doğru",
      description: "İlk doğru cevabını ver",
      icon: <Star className="w-6 h-6" />,
      unlocked: true,
      progress: 1,
      maxProgress: 1
    },
    {
      id: "math_master",
      name: "Matematik Ustası",
      description: "100 doğru cevap ver",
      icon: <Trophy className="w-6 h-6" />,
      unlocked: false,
      progress: 45,
      maxProgress: 100
    },
    {
      id: "speed_demon",
      name: "Hız Canavarı",
      description: "10 saniyeden kısa sürede 5 cevap ver",
      icon: <Zap className="w-6 h-6" />,
      unlocked: false,
      progress: 3,
      maxProgress: 5
    },
    {
      id: "topic_master",
      name: "Konu Uzmanı",
      description: "Tüm konularda 80% başarı",
      icon: <Target className="w-6 h-6" />,
      unlocked: false,
      progress: 4,
      maxProgress: 6
    },
    {
      id: "perfect_round",
      name: "Mükemmel Tur",
      description: "10 soruda 10 doğru cevap",
      icon: <Award className="w-6 h-6" />,
      unlocked: false,
      progress: 7,
      maxProgress: 10
    },
    {
      id: "math_king",
      name: "Matematik Kralı",
      description: "500 doğru cevap ver",
      icon: <Crown className="w-6 h-6" />,
      unlocked: false,
      progress: 45,
      maxProgress: 500
    }
  ]);

  const [showNewAchievement, setShowNewAchievement] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowNewAchievement(null), 3000);
    return () => clearTimeout(timer);
  }, [showNewAchievement]);

  const getRarityColor = (achievement: Achievement) => {
    if (achievement.maxProgress <= 10) return "border-yellow-400 bg-yellow-50";
    if (achievement.maxProgress <= 100) return "border-blue-400 bg-blue-50";
    return "border-purple-400 bg-purple-50";
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-600 mb-2">Başarılar</h1>
        <p className="text-gray-600">Kazandığın rozetler ve ilerleme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id}
            className={`relative transition-all duration-300 ${
              achievement.unlocked 
                ? getRarityColor(achievement) + " border-2" 
                : "opacity-75"
            } ${showNewAchievement === achievement.id ? "animate-bounce" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-full ${
                  achievement.unlocked ? "bg-white" : "bg-gray-100"
                }`}>
                  {achievement.icon}
                </div>
                {achievement.unlocked && (
                  <div className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                    Açıldı!
                  </div>
                )}
              </div>
              
              <h3 className="font-bold text-sm mb-1">{achievement.name}</h3>
              <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>İlerleme</span>
                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                </div>
                <Progress 
                  value={(achievement.progress / achievement.maxProgress) * 100} 
                  className="h-1"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-center">İstatistikler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {achievements.filter(a => a.unlocked).length}
              </div>
              <div className="text-sm text-gray-600">Açılan Rozet</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {achievements.reduce((acc, a) => acc + a.progress, 0)}
              </div>
              <div className="text-sm text-gray-600">Toplam İlerleme</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Tamamlanma</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {achievements.filter(a => !a.unlocked).length}
              </div>
              <div className="text-sm text-gray-600">Kilitli Rozet</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementSystem;