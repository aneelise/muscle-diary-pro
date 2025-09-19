import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WeekProvider } from "@/contexts/WeekContext";
import { WeekList } from "@/components/week/WeekList";
import { WeekStats } from "@/components/week/WeekStats";
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { Dumbbell, Calendar, TrendingUp, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({ title: "Erro ao sair", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Desconectado com sucesso!" });
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-lightest/30 to-primary-cream/40 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <WeekProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-lightest/30 to-primary-cream/40">
        <NavBar />
        
        {/* Header */}
        <header className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-[var(--shadow-soft)]">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-foreground/10 rounded-xl">
                  <Dumbbell className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Treinos+
                  </h1>
                  <p className="text-primary-foreground/80 text-sm">
                    Evolução de cargas por semanas - Acompanhe seu progresso
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Semanas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Evolução</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm bg-primary-foreground/10 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">

          <div className="mb-8">
            <h2 className="workout-header text-center mb-2">
              Suas semanas de Treino
            </h2>
            <p className="text-center text-muted-foreground">
              Organize por semanas, adicione os dias e acompanhe a evolução das suas cargas
            </p>
          </div>

          <WeekList />
        </main>

        {/* Footer */}
        <footer className="bg-primary/5 border-t border-border/50 mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2025 Desenvolvido por Ane Elise | Todos os direitos reservados </p>
            </div>
          </div>
        </footer>
      </div>
    </WeekProvider>
  );
};

export default Index;
