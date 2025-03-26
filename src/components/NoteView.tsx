
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Copy, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Note } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NoteViewProps {
  note: Note;
  onDelete?: (id: string) => void;
  showFullContent?: boolean;
  showActions?: boolean;
  className?: string;
}

const NoteView: React.FC<NoteViewProps> = ({
  note,
  onDelete,
  showFullContent = false,
  showActions = false,
  className,
}) => {
  const { id, title, content, timestamp } = note;
  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    // You could show a toast notification here
  };
  
  const processContent = (markdown: string) => {
    // Very basic markdown processing (for headings and lists)
    return markdown
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-2xl font-bold mt-6 mb-3">{line.substring(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={i} className="text-xl font-bold mt-5 mb-2">{line.substring(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.substring(4)}</h3>;
        } else if (line.startsWith('- ')) {
          return (
            <div key={i} className="flex items-start my-1.5">
              <span className="mr-2 mt-1.5">•</span>
              <span>{line.substring(2)}</span>
            </div>
          );
        } else if (line.trim() === '') {
          return <div key={i} className="h-3"></div>;
        } else {
          return <p key={i} className="my-2">{line}</p>;
        }
      });
  };
  
  const truncateContent = (content: string) => {
    // Extract first 100 characters, respecting word boundaries
    if (content.length <= 100) return content;
    return content.substring(0, 100).split(' ').slice(0, -1).join(' ') + '...';
  };
  
  return (
    <Card
      className={cn(
        "overflow-hidden border border-border/50",
        showFullContent ? "p-5" : "p-4 hover:shadow-md card-hover",
        className
      )}
    >
      {/* Note content */}
      <div>
        {!showFullContent ? (
          <Link to={`/note/${id}`} className="block">
            <h3 className="font-semibold text-lg mb-1.5 line-clamp-1">{title}</h3>
            <div className="text-sm text-muted-foreground mb-3">
              {formattedDate}
            </div>
            <div className="text-sm line-clamp-3 text-muted-foreground">
              {truncateContent(content)}
            </div>
          </Link>
        ) : (
          <>
            <h1 className="font-bold text-2xl mb-1">{title}</h1>
            <div className="text-sm text-muted-foreground mb-6">
              {formattedDate}
            </div>
            <div className="prose prose-sm max-w-none">
              {processContent(content)}
            </div>
          </>
        )}
      </div>
      
      {/* Actions */}
      {showActions && (
        <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-border/50">
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            <Copy className="mr-1.5 h-4 w-4" />
            Copy
          </Button>
          <Button variant="ghost" size="sm">
            <Edit2 className="mr-1.5 h-4 w-4" />
            Edit
          </Button>
          <Button variant="ghost" size="sm">
            <Star className="mr-1.5 h-4 w-4" />
            Favorite
          </Button>
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default NoteView;
