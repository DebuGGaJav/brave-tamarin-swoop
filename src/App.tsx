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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;