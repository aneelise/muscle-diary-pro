import { Toaster } from "@/components/ui/toaster";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { DietProvider } from "@/contexts/DietContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Diet from "./pages/Diet";
import Diary from "./pages/Diary";
import Evolution from "./pages/Evolution";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DietProvider>
        <TooltipProvider>
          <Toaster />
          
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/diet" element={<Diet />} />
              <Route path="/diary" element={<Diary />} />
              <Route path="/evolution" element={<Evolution />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DietProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
