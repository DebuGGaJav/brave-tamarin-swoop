import { StudentProfile } from "@/components/StudentProfile";
import { DailyChallenge } from "@/components/DailyChallenge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, Trophy } from "lucide-react";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Profilim</h1>
          <p className="text-xl text-gray-600">Matematik macerandaki tüm ilerlemeni burada görebilirsin</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profil</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Günlük Challenge</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Başarılar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <StudentProfile />
          </TabsContent>

          <TabsContent value="challenges">
            <DailyChallenge />
          </TabsContent>

          <TabsContent value="achievements">
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Başarılar Sayfası</h2>
              <p className="text-gray-600">Tüm başarılarını ve rozetlerini burada görebilirsin</p>
              <p className="text-sm text-gray-500 mt-4">Bu özellik yakında eklenecek...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;