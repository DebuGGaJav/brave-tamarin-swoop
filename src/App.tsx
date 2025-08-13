import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ToplamaPage from "./pages/toplama";
import CikarmaPage from "./pages/cikarma";
import SayilarPage from "./pages/sayilar";
import SekillerPage from "./pages/sekiller";
import EsitlikPage from "./pages/esitlik";
import ProblemCozmePage from "./pages/problem-cozme";
import TeacherDashboard from "@/components/TeacherDashboard";
import MultiplayerGame from "@/components/MultiplayerGame";
import AchievementSystem from "@/components/AchievementSystem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/toplama" element={<ToplamaPage />} />
          <Route path="/cikarma" element={<CikarmaPage />} />
          <Route path="/sayilar" element={<SayilarPage />} />
          <Route path="/sekiller" element={<SekillerPage />} />
          <Route path="/esitlik" element={<EsitlikPage />} />
          <Route path="/problem-cozme" element={<ProblemCozmePage />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/multiplayer" element={<MultiplayerGame />} />
          <Route path="/achievements" element={<AchievementSystem />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;