import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Gift, Star, Clock, Trophy, Target } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: string;
  completed: boolean;
  difficulty: "easy" | "medium" | "hard";
}

export const DailyChallenge = () => {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([
    {
      id: "daily_5_correct",
      title: "Günlük 5 Doğru",
      description: "Bugün 5 soruyu doğru cevapla",
      target: 5,
      current: 3,
      reward: "50 XP",
      completed: false,
      difficulty: "easy"
    },
    {
      id: "streak_3_days",
      title: "3 Gün Seri",
      description: "3 gün üst üste oyna",
      target: 3,
      current: 3,
      reward: "100 XP + Rozet",
      completed: true,
      difficulty: "medium"
    },
    {
      id: "perfect_round",
      title: "Mükemmel Tur",
      description: "10 soruda 10 doğru cevap",
      target: 10,
      current: 7,
      reward: "200 XP",
      completed: false,
      difficulty: "hard"
    }
  ]);

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}sa ${minutes}dk`);
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const handleClaimReward = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, completed: true }
        : challenge
    ));
    showSuccess("Ödülünüz alındı! Tebrikler! 🎉");
  };

  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalProgress = challenges.reduce((acc, challenge) => 
    acc + (challenge.current / challenge.target) * 100, 0
  ) / challenges.length;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="shadow-xl border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold text-purple-600 flex items-center justify-center">
            <Calendar className="w-6 h-6 mr-2" />
            Günlük Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Timer */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="font-bold">Yeni challenge: {timeLeft}</span>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Genel İlerleme</span>
              <span className="text-gray-600">{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-3" />
            <div className="text-center mt-2">
              <span className="text-sm text-gray-600">
                {completedChallenges} / {challenges.length} challenge tamamlandı
              </span>
            </div>
          </div>

          {/* Challenges List */}
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <Card 
                key={challenge.id} 
                className={`transition-all duration-300 ${
                  challenge.completed 
                    ? "border-2 border-green-400 bg-green-50" 
                    : "border-2 border-purple-200"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{challenge.title}</h3>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <Gift className="w-4 h-4" />
                        <span className="font-bold text-sm">{challenge.reward}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>İlerleme</span>
                      <span>{challenge.current}/{challenge.target}</span>
                    </div>
                    <Progress 
                      value={(challenge.current / challenge.target) * 100} 
                      className="h-2"
                    />
                  </div>

                  {challenge.current >= challenge.target && !challenge.completed && (
                    <div className="mt-3 text-center">
                      <Button 
                        onClick={() => handleClaimReward(challenge.id)}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold"
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Ödülü Al
                      </Button>
                    </div>
                  )}

                  {challenge.completed && (
                    <div className="mt-3 text-center">
                      <div className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-full">
                        <Trophy className="w-4 h-4" />
                        <span className="font-bold">Tamamlandı!</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Rewards Summary */}
          <Card className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
            <CardContent className="p-4">
              <h3 className="font-bold text-purple-600 mb-3 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Bugünün Ödülleri
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">150</div>
                  <div className="text-sm text-gray-600">Toplam XP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div className="text-sm text-gray-600">Rozet</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">1</div>
                  <div className="text-sm text-gray-600">Özel Ödül</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};