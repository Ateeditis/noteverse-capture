import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CameraComponentProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const startCamera = useCallback(async () => {
    try {
      if (videoRef.current) {
        const constraints = {
          video: { 
            facingMode: isFrontCamera ? 'user' : 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Handle camera access error (could show an image upload option instead)
    }
  }, [isFrontCamera]);
  
  React.useEffect(() => {
    startCamera();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [startCamera]);
  
  const toggleCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    
    setIsFrontCamera(prev => !prev);
  };
  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      setIsCapturing(true);
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        if (isFrontCamera) {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageData);
      }
      
      setIsCapturing(false);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCapture(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="relative w-full h-full flex flex-col items-center animate-fade-in">
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      <div className="relative w-full max-w-md overflow-hidden rounded-xl aspect-[3/4] bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={cn(
            "absolute w-full h-full object-cover",
            isFrontCamera && "scale-x-[-1]"
          )}
          onCanPlay={() => setIsStreaming(true)}
        />
        
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="animate-pulse text-white text-center">
              <Camera className="mx-auto h-12 w-12 mb-2" />
              <p>Initializing camera...</p>
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 pointer-events-none border-2 border-white/20 rounded-xl">
          <div className="absolute top-0 left-0 right-0 h-1/3 border-b border-white/20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 border-t border-white/20"></div>
          <div className="absolute inset-0 border-x border-white/20" style={{ left: '33.33%', right: '33.33%' }}></div>
        </div>
      </div>
      
      <div className="mt-4 w-full max-w-md flex items-center justify-between gap-4 px-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-12 w-12 rounded-full"
          onClick={onCancel}
        >
          <span className="text-xl">✕</span>
        </Button>
        
        <Button
          variant="default"
          className="h-16 w-16 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center"
          onClick={captureImage}
          disabled={!isStreaming || isCapturing}
        >
          <span className="absolute inset-3 rounded-full border-2 border-black"></span>
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={toggleCamera}
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          
          <div className="relative h-12 w-12">
            <Button
              variant="outline"
              size="icon"
              className="absolute inset-0 rounded-full"
              asChild
            >
              <label>
                <ImagePlus className="h-5 w-5" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
              </label>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraComponent;
