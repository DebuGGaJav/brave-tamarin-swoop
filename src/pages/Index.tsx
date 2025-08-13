import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Shapes, Hash, Equal, Brain, Trophy, Sparkles, Users, Award, UserCheck } from "lucide-react";
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
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Çıkarma",
      icon: <Minus className="w-8 h-8" />,
      description: "Eğlenceli çıkarma işlemleri",
      path: "/cikarma",
      color: "bg-red-100 text-red-700"
    },
    {
      title: "Sayılar",
      icon: <Hash className="w-8 h-8" />,
      description: "Sayıları öğrenelim",
      path: "/sayilar",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Şekiller",
      icon: <Shapes className="w-8 h-8" />,
      description: "Geometrik şekiller",
      path: "/sekiller",
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "Eşitlik",
      icon: <Equal className="w-8 h-8" />,
      description: "Eşitlik kavramı",
      path: "/esitlik",
      color: "bg-yellow-100 text-yellow-700"
    },
    {
      title: "Problem Çözme",
      icon: <Brain className="w-8 h-8" />,
      description: "Günlük problemler",
      path: "/problem-cozme",
      color: "bg-pink-100 text-pink-700"
    }
  ];

  const specialFeatures = [
    {
      title: "Çok Oyunculu",
      icon: <Users className="w-8 h-8" />,
      description: "Arkadaşlarınla yarış",
      path: "/multiplayer",
      color: "bg-indigo-100 text-indigo-700"
    },
    {
      title: "Başarılar",
      icon: <Award className="w-8 h-8" />,
      description: "Rozetleri topla",
      path: "/achievements",
      color: "bg-orange-100 text-orange-700"
    },
    {
      title: "Öğretmen Paneli",
      icon: <UserCheck className="w-8 h-8" />,
      description: "İlerlemeyi takip et",
      path: "/teacher",
      color: "bg-teal-100 text-teal-700"
    }
  ];

  const handleStart = (path: string) => {
    setCharacterMood("excited");
    showSuccess("Harika! Hadi öğrenmeye başlayalım!");
    setTimeout(() => navigate(path), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="mb-4">
            <MathCharacter 
              mood={characterMood} 
              message="Merhaba! Matematik dünyasına hoş geldin!"
            />
          </div>
          
          <h1 className="text-4xl font-bold text-purple-600 mb-2 flex items-center justify-center">
            <Sparkles className="w-8 h-8 mr-2 text-yellow-500" />
            Matematik Dünyası
            <Sparkles className="w-8 h-8 ml-2 text-yellow-500" />
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            1. Sınıf Matematik Eğlencesi
          </p>
          <div className="flex justify-center">
            <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">Matematik Konuları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 bg-white border-2 border-purple-200 hover:border-purple-400 hover:scale-105 group"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${topic.color} group-hover:scale-110 transition-transform duration-300`}>
                      {topic.icon}
                    </div>
                  </div>
                  <CardTitle className="text-center text-purple-700">
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button 
                    onClick={() => handleStart(topic.path)}
                    className="bg-purple-600 hover:bg-purple-700 group-hover:scale-105 transition-transform duration-300"
                  >
                    Başla
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">Özel Özellikler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 bg-white border-2 border-indigo-200 hover:border-indigo-400 hover:scale-105 group"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-center text-indigo-700">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button 
                    onClick={() => handleStart(feature.path)}
                    className="bg-indigo-600 hover:bg-indigo-700 group-hover:scale-105 transition-transform duration-300"
                  >
                    Keşfet
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-purple-600 mb-2">Bugünün Hedefi</h3>
            <p className="text-gray-600">5 doğru cevap = 1 yıldız kazanırsın!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;