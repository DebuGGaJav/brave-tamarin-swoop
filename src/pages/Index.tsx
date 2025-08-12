import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Shapes, Hash, Equal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "@/utils/toast";

const Index = () => {
  const navigate = useNavigate();

  const topics = [
    {
      title: "Toplama",
      icon: <Plus className="w-8 h-8" />,
      description: "Eğlenceli toplama işlemleri",
      path: "/toplama"
    },
    {
      title: "Çıkarma",
      icon: <Minus className="w-8 h-8" />,
      description: "Eğlenceli çıkarma işlemleri",
      path: "/cikarma"
    },
    {
      title: "Sayılar",
      icon: <Hash className="w-8 h-8" />,
      description: "Sayıları öğrenelim",
      path: "/sayilar"
    },
    {
      title: "Şekiller",
      icon: <Shapes className="w-8 h-8" />,
      description: "Geometrik şekiller",
      path: "/sekiller"
    },
    {
      title: "Eşitlik",
      icon: <Equal className="w-8 h-8" />,
      description: "Eşitlik kavramı",
      path: "/esitlik"
    }
  ];

  const handleStart = (path: string) => {
    showSuccess("Harika! Hadi öğrenmeye başlayalım!");
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-purple-600 mb-2">
          Matematik Dünyası
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          1. Sınıf Matematik Eğlencesi
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 bg-white border-2 border-purple-200"
            >
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
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
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Başla
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;