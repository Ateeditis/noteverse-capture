
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showActions?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'NoteVerse', 
  showBackButton = false,
  showActions = false,
  className 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <header className={cn(
      "w-full px-4 py-4 flex items-center justify-between z-10",
      "sticky top-0 backdrop-blur-md bg-background/80 border-b border-border/50",
      className
    )}>
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        
        <h1 className={cn(
          "font-medium truncate",
          showBackButton ? "text-lg" : "text-xl"
        )}>
          {title}
        </h1>
      </div>
      
      {showActions && (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
