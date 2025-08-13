import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Shapes, Hash, Equal, Brain, Trophy, Sparkles, Users, Award, UserCheck, User, X, Divide, Shuffle, Clock } from "lucide-react"; // Clock icon eklendi
import { useNavigate } from "react-router-dom";
import { showSuccess } from "@/utils/toast";
import { MathCharacter } from "@/components/MathCharacter";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [characterMood, setCharacterMood] = useState<"happy" | "excited">("happy");

  const topics = [
    {
      title: "Toplama",
      icon: <Plus className="w-8 h-8" />,
      description: "Eğlenceli toplama işlemleri",
      path: "/toplama",
      color: "bg-gradient-to-r from-green-400 to-green-500",
      borderColor: "border-green-400",
      hoverColor: "hover:from-green-500 hover:to-green-600"
    },
    {
      title: "Çıkarma",
      icon: <Minus className="w-8 h-8" />,
      description: "Eğlenceli çıkarma işlemleri",
      path: "/cikarma",
      color: "bg-gradient-to-r from-red-400 to-red-500",
      borderColor: "border-red-400",
      hoverColor: "hover:from-red-500 hover:to-red-600"
    },
    {
      title: "Çarpma",
      icon: <X className="w-8 h-8" />,
      description: "Eğlenceli çarpma işlemleri",
      path: "/carpma",
      color: "bg-gradient-to-r from-orange-400 to-orange-500",
      borderColor: "border-orange-400",
      hoverColor: "hover:from-orange-500 hover:to-orange-600"
    },
    {
      title: "Bölme",
      icon: <Divide className="w-8 h-8" />,
      description: "Eğlenceli bölme işlemleri",
      path: "/bolme",
      color: "bg-gradient-to-r from-indigo-400 to-indigo-500",
      borderColor: "border-indigo-400",
      hoverColor: "hover:from-indigo-500 hover:to-indigo-600"
    },
    {
      title: "Karışık İşlemler",
      icon: <Shuffle className="w-8 h-8" />,
      description: "Tüm işlemler bir arada",
      path: "/karisik-islemler",
      color: "bg-gradient-to-r from-purple-600 to-pink-600",
      borderColor: "border-purple-600",
      hoverColor: "hover:from-purple-700 hover:to-pink-700"
    },
    {
      title: "Sayılar",
      icon: <Hash className="w-8 h-8" />,
      description: "Sayıları öğrenelim",
      path: "/sayilar",
      color: "bg-gradient-to-r from-blue-400 to-blue-500",
      borderColor: "border-blue-400",
      hoverColor: "hover:from-blue-500 hover:to-blue-600"
    },
    {
      title: "Şekiller",
      icon: <Shapes className="w-8 h-8" />,
      description: "Geometrik şekiller",
      path: "/sekiller",
      color: "bg-gradient-to-r from-purple-400 to-purple-500",
      borderColor: "border-purple-400",
      hoverColor: "hover:from-purple-500 hover:to-purple-600"
    },
    {
      title: "Eşitlik",
      icon: <Equal className="w-8 h-8" />,
      description: "Eşitlik kavramı",
      path: "/esitlik",
      color: "bg-gradient-to-r from-yellow-400 to-yellow-500",
      borderColor: "border-yellow-400",
      hoverColor: "hover:from-yellow-500 hover:to-yellow-600"
    },
    {
      title: "Problem Çözme",
      icon: <Brain className="w-8 h-8" />,
      description: "Günlük problemler",
      path: "/problem-cozme",
      color: "bg-gradient-to-r from-pink-400 to-pink-500",
      borderColor: "border-pink-400",
      hoverColor: "hover:from-pink-500 hover:to-pink-600"
    }
  ];

  const specialFeatures = [
    {
      title: "Zamanlı Yarışma",
      icon: <Clock className="w-8 h-8" />,
      description: "Süreye karşı yarış!",
      path: "/zamanli-yarisma",
      color: "bg-gradient-to-r from-green-400 to-green-500",
      borderColor: "border-green-400",
      hoverColor: "hover:from-green-500 hover:to-green-600"
    },
    {
      title: "Profilim",
      icon: <User className="w-8 h-8" />,
      description: "İlerlemeni gör",
      path: "/profile",
      color: "bg-gradient-to-r from-indigo-400 to-indigo-500",
      borderColor: "border-indigo-400",
      hoverColor: "hover:from-indigo-500 hover:to-indigo-600"
    },
    {
      title: "Çok Oyunculu",
      icon: <Users className="w-8 h-8" />,
      description: "Arkadaşlarınla yarış",
      path: "/multiplayer",
      color: "bg-gradient-to-r from-purple-400 to-purple-500",
      borderColor: "border-purple-400",
      hoverColor: "hover:from-purple-500 hover:to-purple-600"
    },
    {
      title: "Başarılar",
      icon: <Award className="w-8 h-8" />,
      description: "Rozetleri topla",
      path: "/achievements",
      color: "bg-gradient-to-r from-orange-400 to-orange-500",
      borderColor: "border-orange-400",
      hoverColor: "hover:from-orange-500 hover:to-orange-600"
    }
    // Removed Teacher Dashboard card
  ];

  const handleStart = (path: string) => {
    setCharacterMood("excited");
    showSuccess("Harika! Hadi öğrenmeye başlayalım!");
    setTimeout(() => navigate(path), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <div className="mb-4 sm:mb-6">
            <MathCharacter 
              mood={characterMood} 
              message="Merhaba! Matematik dünyasına hoş geldin!"
            />
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-4 flex items-center justify-center">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 text-yellow-500" />
            Matematik Dünyası
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 ml-2 sm:ml-3 text-yellow-500" />
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-4 sm:mb-6">
            1. Sınıf Matematik Eğlencesi
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-3 sm:p-4 rounded-full shadow-lg">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce" />
            </div>
          </div>
        </div>

        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-6 sm:mb-8 text-center">Matematik Konuları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {topics.map((topic, index) => (
              <Card 
                key={index} 
                className={`group transition-all duration-300 bg-white border-2 ${topic.borderColor} hover:shadow-2xl hover:scale-105 transform`}
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className={`p-3 sm:p-4 rounded-full ${topic.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {topic.icon}
                    </div>
                  </div>
                  <CardTitle className="text-center text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="text-center text-sm sm:text-base text-gray-600 font-medium">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pt-0">
                  <Button 
                    onClick={() => handleStart(topic.path)}
                    className={`${topic.color} ${topic.hoverColor} text-white font-bold px-6 py-2 sm:px-8 sm:py-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105`}
                  >
                    Başla
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-6 sm:mb-8 text-center">Özel Özellikler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {specialFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className={`group transition-all duration-300 bg-white border-2 ${feature.borderColor} hover:shadow-2xl hover:scale-105 transform`}
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className={`p-3 sm:p-4 rounded-full ${feature.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-center text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-center text-sm sm:text-base text-gray-600 font-medium">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pt-0">
                  <Button 
                    onClick={() => handleStart(feature.path)}
                    className={`${feature.color} ${feature.hoverColor} text-white font-bold px-6 py-2 sm:px-8 sm:py-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105`}
                  >
                    Keşfet
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-2xl p-6 sm:p-8 text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Bugünün Hedefi</h3>
            <p className="text-base sm:text-lg opacity-90">5 doğru cevap = 1 yıldız kazanırsın!</p>
            <div className="flex justify-center mt-3 sm:mt-4">
              <div className="flex space-x-1 sm:space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base">★</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;