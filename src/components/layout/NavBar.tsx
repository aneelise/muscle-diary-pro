import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Apple, BookOpen, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Semanas',
      icon: Calendar,
      description: 'Dashboard de treinos'
    },
    {
      path: '/diet',
      label: 'Dieta',
      icon: Apple,
      description: 'Plano alimentar'
    },
    {
      path: '/diary',
      label: 'Diário',
      icon: BookOpen,
      description: 'Registro diário'
    },
    {
      path: '/evolution',
      label: 'Evolução',
      icon: TrendingUp,
      description: 'Progresso e fotos'
    }
  ];

  return (
    <nav className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50 sticky top-0 z-40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-3">
          <div className="flex items-center gap-2 bg-background/80 rounded-xl p-2 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "hover:bg-accent/10 hover:text-accent"
                  )}
                  title={item.description}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};