import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, BookOpen, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StudentProgress {
  name: string;
  totalQuestions: number;
  correctAnswers: number;
  topics: {
    toplama: number;
    cikarma: number;
    sayilar: number;
    sekiller: number;
    esitlik: number;
    problemCozme: number;
  };
}

const TeacherDashboard = () => {
  const [students, setStudents] = useState<StudentProgress[]>([
    {
      name: "Ali",
      totalQuestions: 45,
      correctAnswers: 38,
      topics: { toplama: 85, cikarma: 78, sayilar: 92, sekiller: 88, esitlik: 75, problemCozme: 80 }
    },
    {
      name: "Ayşe",
      totalQuestions: 52,
      correctAnswers: 48,
      topics: { toplama: 95, cikarma: 90, sayilar: 98, sekiller: 85, esitlik: 88, problemCozme: 92 }
    },
    {
      name: "Mehmet",
      totalQuestions: 38,
      correctAnswers: 30,
      topics: { toplama: 75, cikarma: 70, sayilar: 80, sekiller: 85, esitlik: 65, problemCozme: 72 }
    }
  ]);

  const getOverallProgress = (student: StudentProgress) => {
    return Math.round((student.correctAnswers / student.totalQuestions) * 100);
  };

  const getLevel = (percentage: number) => {
    if (percentage >= 90) return { name: "Uzman", color: "text-green-600" };
    if (percentage >= 75) return { name: "İleri", color: "text-blue-600" };
    if (percentage >= 60) return { name: "Orta", color: "text-yellow-600" };
    return { name: "Başlangıç", color: "text-red-600" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Öğretmen Paneli</h1>
          <p className="text-xl text-gray-600">Öğrenci İlerleme Takibi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Toplam Öğrenci</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {students.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Ortalama Başarı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                {Math.round(students.reduce((acc, s) => acc + getOverallProgress(s), 0) / students.length)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Toplam Soru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                {students.reduce((acc, s) => acc + s.totalQuestions, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Aktif Konu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Toplama
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          {students.map((student, index) => {
            const progress = getOverallProgress(student);
            const level = getLevel(progress);
            
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Genel Başarı</span>
                        <span className={level.color}>{level.name}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      {Object.entries(student.topics).map(([topic, score]) => (
                        <div key={topic} className="space-y-1">
                          <div className="font-medium capitalize">{topic}</div>
                          <Progress value={score} className="h-1" />
                          <div className="text-xs text-gray-500">{score}%</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-sm">Toplam: {student.totalQuestions} soru</span>
                      <span className="text-sm">Doğru: {student.correctAnswers}</span>
                      <span className={`font-bold ${level.color}`}>{progress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;