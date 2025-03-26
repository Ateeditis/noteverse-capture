
import React from 'react';
import { Settings, Moon, Sun, Camera, Save, Trash2, Info } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface SettingsDialogProps {
  className?: string;
}

const SettingsDialog = ({ className }: SettingsDialogProps) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [highQualityCamera, setHighQualityCamera] = React.useState(true);
  const [autoSaveNotes, setAutoSaveNotes] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(true);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // In a real app, we would apply the theme here
    toast.success(`Theme changed to ${newTheme} mode`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-full"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </SheetTitle>
        </SheetHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
            <TabsTrigger value="camera" className="flex-1">Camera</TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>Theme</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Light</span>
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                <span className="text-sm text-muted-foreground">Dark</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>App Version</span>
              </div>
              <span className="text-sm text-muted-foreground">1.0.0</span>
            </div>
          </TabsContent>
          
          <TabsContent value="camera" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span>High Quality Camera</span>
              </div>
              <Switch 
                checked={highQualityCamera} 
                onCheckedChange={setHighQualityCamera} 
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Enabling high quality will use more storage but provide better OCR results
            </p>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Camera Grid Overlay</h3>
              <div className="flex flex-wrap gap-2">
                <Toggle pressed>Rule of thirds</Toggle>
                <Toggle>None</Toggle>
                <Toggle>Grid</Toggle>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Auto-save notes</span>
              </div>
              <Switch 
                checked={autoSaveNotes} 
                onCheckedChange={setAutoSaveNotes} 
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                <span>Confirm before deleting</span>
              </div>
              <Switch 
                checked={confirmDelete} 
                onCheckedChange={setConfirmDelete} 
              />
            </div>
            
            <Separator />
            
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                toast.error("This would delete all notes in a real app");
              }}
            >
              Delete All Notes
            </Button>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDialog;
