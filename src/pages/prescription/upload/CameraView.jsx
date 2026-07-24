import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Play, RefreshCw, FileText } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useAppStore } from '../../../store/useAppStore';

export default function CameraView({ onCapture, onRetake }) {
    const showToast = useAppStore((state) => state.showToast);
    const [cameraState, setCameraState] = useState('idle'); // idle, starting, streaming, captured
    const [previewUrl, setPreviewUrl] = useState(null);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    useEffect(() => {
        return () => stopCamera();
    }, [stopCamera]);

    const startCamera = async () => {
        setCameraState('starting');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
            });
            streamRef.current = stream;
            setCameraState('streaming');
        } catch (err) {
            console.error("Camera access denied or error:", err);
            showToast("Could not access camera. Please check permissions and ensure you are on a secure connection (HTTPS).", "error");
            setCameraState('idle');
        }
    };

    // Attach stream to video element when it renders in the streaming state
    useEffect(() => {
        if (cameraState === 'streaming' && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch(e => console.error("Video play error:", e));
        }
    }, [cameraState]);

    const takeSnapshot = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            // Set canvas dimensions to match video stream resolution exactly
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Generate a high-quality JPEG
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setPreviewUrl(dataUrl);
            
            fetch(dataUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
                    onCapture(file, dataUrl);
                    stopCamera();
                    setCameraState('captured');
                    showToast('Prescription captured successfully!', 'success');
                });
        }
    };

    const handleRetake = () => {
        setPreviewUrl(null);
        setCameraState('idle');
        onRetake();
    };

    return (
        <div className="flex-1 min-h-[400px] rounded-2xl bg-slate-950 border border-slate-850 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {cameraState === 'idle' && (
                <div className="flex flex-col items-center max-w-sm">
                    <Camera className="w-12 h-12 text-slate-500 mb-4 animate-pulse" />
                    <h3 className="text-base font-bold text-slate-200 mb-2">Prescription Scanner</h3>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                        Securely scan your prescription using your device's camera. For best results, ensure good lighting and place the document flat on a contrasting surface.
                    </p>
                    <Button variant="primary" size="sm" icon={Play} onClick={startCamera}>
                        Start Scanner
                    </Button>
                </div>
            )}

            {cameraState === 'starting' && (
                <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
                    <p className="text-xs font-mono text-primary uppercase tracking-widest">Initializing Camera...</p>
                </div>
            )}

            {cameraState === 'streaming' && (
                <div className="w-full h-full flex flex-col items-center justify-center relative bg-black rounded-xl overflow-hidden min-h-[350px]">
                    <video 
                        ref={videoRef} 
                        className="absolute inset-0 w-full h-full object-cover" 
                        autoPlay 
                        playsInline 
                        muted 
                    />
                    
                    {/* Viewfinder Overlay / Box */}
                    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
                        {/* Darkened edges */}
                        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
                        
                        {/* Clear center box */}
                        <div className="relative w-4/5 md:w-3/4 max-w-md aspect-[3/4] md:aspect-[4/3] border-2 border-white/40 bg-transparent rounded-lg flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
                            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
                            <span className="text-white/60 text-[10px] md:text-xs font-bold tracking-widest uppercase bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                                Align Document Within Box
                            </span>
                        </div>
                    </div>
                    
                    <canvas ref={canvasRef} className="hidden" />
                    
                    <div className="absolute bottom-6 z-20">
                        <Button 
                            variant="primary" 
                            size="md" 
                            icon={Camera} 
                            onClick={takeSnapshot} 
                            className="shadow-2xl shadow-primary/50 px-8 py-3 rounded-full font-bold text-sm bg-white text-slate-900 hover:bg-slate-100"
                        >
                            Capture Photo
                        </Button>
                    </div>
                </div>
            )}

            {cameraState === 'captured' && (
                <div className="flex flex-col items-center w-full">
                    <div className="w-48 h-64 md:w-64 md:h-80 rounded-xl border-2 border-primary/30 overflow-hidden shadow-2xl mb-6 bg-slate-900 relative p-1">
                        <img src={previewUrl} alt="Prescription Capture" className="w-full h-full object-contain rounded-lg" />
                    </div>
                    
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-500" />
                        Scan Successful
                    </h3>
                    <p className="text-xs text-slate-400 mb-6 max-w-xs">
                        Review the image above. If the text is clear and readable, you can proceed to analyze it. Otherwise, please retake the photo.
                    </p>
                    
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" icon={RefreshCw} onClick={handleRetake} className="border-slate-700 hover:bg-slate-800 text-slate-300">
                            Retake Photo
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
