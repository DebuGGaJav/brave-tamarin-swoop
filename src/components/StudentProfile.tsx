import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Zap, Award, Crown, TrendingUp, Calendar, BookOpen } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface StudentStats {
  name: string;
  level: number;
  experience: number;
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  joinDate: string;
  favoriteTopic: string;
  achievements: {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    icon: React.ReactNode;
  }[];
}

export const StudentProfile = () => {
  const [stats, setStats] = useState<StudentStats>({
    name: "Ali",
    level: 5,
    experience: 750,
    totalQuestions: 156,
    correctAnswers: 132,
    streak: 7,
    joinDate: "15.10.2024",
    favoriteTopic: "Toplama",
    achievements: [
      {
        id: "first_correct",
        name: "İlk Adım",
        description: "İlk doğru cevabı ver",
        unlocked: true,
        icon: <Star className="w-6 h-6" />
      },
      {
        id: "streak_master",
        name: "Serbest Usta",
        description: "7 gün üst üste oyna",
        unlocked: true,
        icon: <TrendingUp className="w-6 h-6" />
      },
      {
        id: "math_master",
        name: "Matematik Ustası",
        description: "100 doğru cevap ver",
        unlocked: true,
        icon: <Trophy className="w-6 h-6" />
      },
      {
        id: "speed_demon",
        name: "Hız Canavarı",
        description: "10 saniyeden kısa sürede 5 cevap ver",
        unlocked: false,
        icon: <Zap className="w-6 h-6" />
      },
      {
        id: "perfect_round",
        name: "Mükemmel Tur",
        description: "10 soruda 10 doğru cevap",
        unlocked: false,
        icon: <Award className="w-6 h-6" />
      },
      {
        id: "math_king",
        name: "Matematik Kralı",
        description: "500 doğru cevap ver",
        unlocked: false,
        icon: <Crown className="w-6 h-6" />
      }
    ]
  });

  const [showLevelUp, setShowLevelUp] = useState(false);

  const getExperienceForNextLevel = () => {
    return stats.level * 200;
  };

  const getAccuracy = () => {
    return stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;
  };

  const getLevelColor = () => {
    if (stats.level >= 10) return "text-purple-600";
    if (stats.level >= 7) return "text-blue-600";
    if (stats.level >= 4) return "text-green-600";
    return "text-yellow-600";
  };

  const handleShareProgress = () => {
    const message = `Matematik Dünyası'nda ${stats.level}. seviyeye ulaştım! 🎉 Başarı oranım: ${getAccuracy()}%`;
    if (navigator.share) {
      navigator.share({
        title: 'Matematik Başarım',
        text: message,
      });
    } else {
      navigator.clipboard.writeText(message);
      showSuccess("İlerlemeniz panoya kopyalandı!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Öğrenci Profili</h1>
          <p className="text-xl text-gray-600">Matematik macerandaki ilerlemen</p>
        </div>

        {/* Profile Header */}
        <Card className="mb-6 shadow-xl border-2 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {stats.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{stats.name}</h2>
                  <p className="text-gray-600">Seviye {stats.level} Öğrenci</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span className="text-lg font-bold text-orange-500">{stats.streak} gün seri</span>
                </div>
                <p className="text-sm text-gray-500">Katılım: {stats.joinDate}</p>
              </div>
            </div>

            {/* Experience Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Seviye {stats.level}</span>
                <span className="text-gray-600">{stats.experience}/{getExperienceForNextLevel()} XP</span>
              </div>
              <Progress 
                value={(stats.experience / getExperienceForNextLevel()) * 100} 
                className="h-3"
              />
            </div>

            <Button onClick={handleShareProgress} className="w-full bg-purple-600 hover:bg-purple-700">
              İlerlememi Paylaş
            </Button>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-xl border-2 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{getAccuracy()}%</div>
              <div className="text-sm text-gray-600">Başarı Oranı</div>
              <Target className="w-8 h-8 text-green-500 mx-auto mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-xl border-2 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.correctAnswers}</div>
              <div className="text-sm text-gray-600">Doğru Cevap</div>
              <BookOpen className="w-8 h-8 text-blue-500 mx-auto mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-xl border-2 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalQuestions}</div>
              <div className="text-sm text-gray-600">Toplam Soru</div>
              <Calendar className="w-8 h-8 text-purple-500 mx-auto mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="shadow-xl border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-purple-600 flex items-center">
              <Trophy className="w-6 h-6 mr-2" />
              Başarılar ve Rozetler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    achievement.unlocked
                      ? "border-yellow-400 bg-yellow-50 shadow-md"
                      : "border-gray-200 bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      achievement.unlocked ? "bg-yellow-400" : "bg-gray-300"
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${
                        achievement.unlocked ? "text-yellow-700" : "text-gray-600"
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <div className="text-yellow-500">✓</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full">
                <Star className="w-5 h-5" />
                <span className="font-bold">
                  {stats.achievements.filter(a => a.unlocked).length} / {stats.achievements.length} Başarı Açıldı
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Topic */}
        <Card className="mt-6 shadow-xl border-2 border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-purple-600 mb-4">En Sevdiğin Konu</h3>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white text-2xl mb-2">
                  +
                </div>
                <p className="font-bold text-green-600">{stats.favoriteTopic}</p>
                <p className="text-sm text-gray-600">En çok çalıştığın konu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};