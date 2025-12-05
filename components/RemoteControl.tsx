import React, { useState, useRef, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Target, Maximize, RotateCcw, Power, Camera, AlertCircle } from 'lucide-react';
import { RobotState } from '../types';

interface RemoteControlProps {
  onStateChange: (state: RobotState) => void;
  currentState: RobotState;
}

// 简单的线性插值函数，让跟踪框移动更平滑
const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

export const RemoteControl: React.FC<RemoteControlProps> = ({ onStateChange, currentState }) => {
  const [log, setLog] = useState<string[]>(['系统就绪，等待指令...']);
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null);
  
  // 跟踪框状态
  const boxRef = useRef({ x: 0, y: 0, w: 0, h: 0, active: false });
  const [trackingInfo, setTrackingInfo] = useState({ detected: false, x: 0, y: 0 });

  const addLog = (msg: string) => {
    setLog(prev => [msg, ...prev].slice(0, 5));
  };

  const handleMove = (direction: string) => {
    const dirMap: Record<string, string> = {
        'forward': '前进',
        'left': '左转',
        'right': '右转',
        'backward': '后退'
    };
    addLog(`执行指令: ${dirMap[direction]}`);
  };

  // 启动摄像头
  useEffect(() => {
    let currentStream: MediaStream | null = null;
    let isMounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 }, 
            height: { ideal: 480 },
            facingMode: "user" 
          } 
        });
        
        if (!isMounted) {
          // 如果组件已卸载，立即停止流
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        currentStream = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // 确保视频元数据加载后再播放
          videoRef.current.onloadedmetadata = async () => {
            if (isMounted && videoRef.current) {
              try {
                await videoRef.current.play();
                setCameraActive(true);
                addLog("视觉传感器已连接");
              } catch (e) {
                console.error("Auto-play failed:", e);
              }
            }
          };
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Camera access error:", err);
        setPermissionError(true);
        
        // 处理特定错误
        if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
             const msg = "摄像头被占用 (Device in use)";
             setErrorMessage(msg);
             addLog(`错误: ${msg}`);
        } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
             const msg = "无法获取权限";
             setErrorMessage(msg);
             addLog(`错误: ${msg}`);
        } else {
             const msg = `初始化失败 (${err.name})`;
             setErrorMessage(msg);
             addLog(`错误: ${msg}`);
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  // 视觉处理循环 (运动检测)
  useEffect(() => {
    if (!cameraActive) return;

    let animationId: number;
    // 使用离屏 canvas 处理像素数据，提高性能
    const processCanvas = document.createElement('canvas');
    const processCtx = processCanvas.getContext('2d', { willReadFrequently: true });
    
    // 降采样比例，减少计算量
    const scale = 0.2; 

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video && canvas && processCtx && video.readyState === 4 && !video.paused && !video.ended) {
        const width = video.videoWidth;
        const height = video.videoHeight;
        
        // 设置画布尺寸匹配视频
        if (canvas.width !== width) canvas.width = width;
        if (canvas.height !== height) canvas.height = height;
        
        // 处理画布尺寸 (缩小)
        const processW = Math.floor(width * scale);
        const processH = Math.floor(height * scale);
        if (processCanvas.width !== processW) processCanvas.width = processW;
        if (processCanvas.height !== processH) processCanvas.height = processH;

        // 绘制当前帧到处理画布
        processCtx.drawImage(video, 0, 0, processW, processH);
        
        // 获取当前帧数据
        try {
          const frameData = processCtx.getImageData(0, 0, processW, processH);
          const currentData = frameData.data;
          
          let minX = processW, minY = processH, maxX = 0, maxY = 0;
          let changeCount = 0;
          const threshold = 30; // 像素差异阈值

          // 如果有上一帧数据，进行对比
          if (prevFrameRef.current) {
            const prevData = prevFrameRef.current;
            
            // 遍历像素 (步长为4，只取部分像素以加速)
            for (let y = 0; y < processH; y += 2) {
              for (let x = 0; x < processW; x += 2) {
                const i = (y * processW + x) * 4;
                
                // 简单的 RGB 差异计算
                const rDiff = Math.abs(currentData[i] - prevData[i]);
                const gDiff = Math.abs(currentData[i + 1] - prevData[i + 1]);
                const bDiff = Math.abs(currentData[i + 2] - prevData[i + 2]);
                
                if (rDiff + gDiff + bDiff > threshold * 3) {
                  changeCount++;
                  if (x < minX) minX = x;
                  if (x > maxX) maxX = x;
                  if (y < minY) minY = y;
                  if (y > maxY) maxY = y;
                }
              }
            }
          }

          // 保存当前帧作为下一帧的对比
          // 必须拷贝数据，因为 getImageData 返回的是引用
          prevFrameRef.current = new Uint8ClampedArray(currentData);

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, width, height);

            // 绘制 HUD 边框
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(20, 20, width - 40, height - 40);

            // 绘制中心十字准星
            ctx.beginPath();
            ctx.moveTo(width / 2 - 10, height / 2);
            ctx.lineTo(width / 2 + 10, height / 2);
            ctx.moveTo(width / 2, height / 2 - 10);
            ctx.lineTo(width / 2, height / 2 + 10);
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
            ctx.stroke();

            // 如果检测到足够的运动 (过滤噪点)
            const detectThreshold = 20; 
            if (changeCount > detectThreshold) {
              // 还原到原始尺寸
              const targetX = minX / scale;
              const targetY = minY / scale;
              const targetW = (maxX - minX) / scale;
              const targetH = (maxY - minY) / scale;

              // 平滑过渡
              boxRef.current.x = lerp(boxRef.current.x, targetX, 0.2);
              boxRef.current.y = lerp(boxRef.current.y, targetY, 0.2);
              boxRef.current.w = lerp(boxRef.current.w, targetW, 0.2);
              boxRef.current.h = lerp(boxRef.current.h, targetH, 0.2);
              boxRef.current.active = true;
              
              setTrackingInfo({ 
                  detected: true, 
                  x: Math.round(boxRef.current.x + boxRef.current.w / 2), 
                  y: Math.round(boxRef.current.y + boxRef.current.h / 2) 
              });

              // 绘制跟踪框
              const padding = 20;
              const drawX = boxRef.current.x - padding;
              const drawY = boxRef.current.y - padding;
              const drawW = boxRef.current.w + padding * 2;
              const drawH = boxRef.current.h + padding * 2;

              ctx.beginPath();
              ctx.lineWidth = 2;
              ctx.strokeStyle = '#22c55e'; // 绿色
              ctx.rect(drawX, drawY, drawW, drawH);
              ctx.stroke();

              // 绘制角标
              ctx.fillStyle = '#22c55e';
              ctx.font = '12px "JetBrains Mono"';
              ctx.fillText(`TARGET LOCKED [${Math.round(drawW)}x${Math.round(drawH)}]`, drawX, drawY - 8);
              
              // 绘制半透明填充
              ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
              ctx.fillRect(drawX, drawY, drawW, drawH);

            } else {
              boxRef.current.active = false;
              setTrackingInfo(prev => ({ ...prev, detected: false }));
              
              // 丢失目标时的视觉效果
              ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
              ctx.font = '12px "JetBrains Mono"';
              ctx.fillText("SEARCHING...", 30, 40);
            }
          }
        } catch (e) {
          console.error("Frame processing error:", e);
        }
      }
      animationId = requestAnimationFrame(processFrame);
    };

    animationId = requestAnimationFrame(processFrame);

    return () => cancelAnimationFrame(animationId);
  }, [cameraActive]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-[calc(100vh-80px)]">
      {/* Digital Twin / Camera Feed */}
      <div className="lg:col-span-2 flex flex-col gap-4 h-full">
        <Card className="flex-1 relative p-0 overflow-hidden bg-black group border-cyan-900/50 flex flex-col" title="数字孪生视觉 (LIVE FEED)">
             {/* Camera Container */}
             <div className="absolute inset-0 bg-slate-950 flex items-center justify-center overflow-hidden">
                {!cameraActive && !permissionError && (
                    <div className="flex flex-col items-center gap-3 text-cyan-500 animate-pulse">
                        <Camera className="w-12 h-12" />
                        <span className="font-mono text-sm tracking-widest">初始化视觉传感器...</span>
                    </div>
                )}

                {permissionError && (
                    <div className="flex flex-col items-center gap-3 text-red-500 text-center px-6">
                        <AlertCircle className="w-12 h-12" />
                        <span className="font-mono text-sm tracking-widest">传感器连接失败</span>
                        <span className="text-xs text-red-400/70">{errorMessage || "请检查设备权限或关闭占用摄像头的其他应用"}</span>
                    </div>
                )}

                {/* Video Element (Hidden but active) */}
                <video 
                    ref={videoRef} 
                    className={`w-full h-full object-cover ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
                    autoPlay 
                    playsInline 
                    muted
                />
                
                {/* HUD Canvas Overlay */}
                <canvas 
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                />

                {/* HUD HTML Overlay for specific text elements */}
                <div className="absolute inset-0 pointer-events-none p-4">
                    <div className="w-full h-full relative">
                        {/* Status Badge */}
                        <div className={`absolute top-4 right-4 text-xs font-mono px-2 py-1 rounded border transition-all duration-300 ${
                            trackingInfo.detected 
                            ? 'text-black bg-green-500 border-green-400 shadow-[0_0_10px_#22c55e]' 
                            : 'text-cyan-500 bg-black/50 border-cyan-900'
                        }`}>
                             {trackingInfo.detected ? '● TARGET ACQUIRED' : '○ SCANNING'}
                        </div>

                        {/* Coordinates */}
                        {trackingInfo.detected && (
                            <div className="absolute bottom-4 left-4 text-xs font-mono text-green-400 bg-black/50 p-2 rounded border border-green-900/50">
                                <p>X: {trackingInfo.x}</p>
                                <p>Y: {trackingInfo.y}</p>
                                <p>CONFIDENCE: 98.2%</p>
                            </div>
                        )}
                        
                        {!trackingInfo.detected && (
                             <div className="absolute bottom-4 left-4 text-xs font-mono text-cyan-600 bg-black/50 p-2 rounded border border-cyan-900/30">
                                <p>SYSTEM READY</p>
                                <p>WAITING FOR INPUT</p>
                            </div>
                        )}
                    </div>
                </div>
             </div>
        </Card>
        
        <div className="grid grid-cols-2 gap-4">
             <Button variant="secondary" className="flex items-center justify-center gap-2">
                <Maximize className="w-4 h-4" /> 全屏显示
             </Button>
             <Button variant="secondary" className="flex items-center justify-center gap-2" onClick={() => onStateChange(RobotState.RETURNING)}>
                <RotateCcw className="w-4 h-4" /> 自动回充
             </Button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="flex flex-col gap-4">
        <Card title="运动控制 (LOCOMOTION)" className="flex-1 flex flex-col items-center justify-center bg-slate-900/80">
             <div className="grid grid-cols-3 gap-3 p-6 bg-slate-950/50 rounded-full border border-slate-800 shadow-inner relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-cyan-500/5 animate-pulse rounded-full pointer-events-none"></div>

                <div className="col-start-2">
                    <button 
                        className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center hover:bg-cyan-600 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition-all group z-10 relative"
                        onMouseDown={() => handleMove('forward')}
                    >
                        <ArrowUp className="w-8 h-8 text-slate-400 group-hover:text-white" />
                    </button>
                </div>
                <div className="col-start-1 row-start-2">
                    <button 
                        className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center hover:bg-cyan-600 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition-all group z-10 relative"
                        onMouseDown={() => handleMove('left')}
                    >
                        <ArrowLeft className="w-8 h-8 text-slate-400 group-hover:text-white" />
                    </button>
                </div>
                <div className="col-start-2 row-start-2">
                    <button 
                         className="w-16 h-16 bg-red-900/20 border border-red-500/50 rounded-full flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] z-10 relative"
                         onClick={() => {
                             addLog("紧急停止触发!");
                             onStateChange(RobotState.IDLE);
                         }}
                    >
                        <Power className="w-6 h-6 text-red-500 hover:text-white" />
                    </button>
                </div>
                <div className="col-start-3 row-start-2">
                    <button 
                        className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center hover:bg-cyan-600 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition-all group z-10 relative"
                        onMouseDown={() => handleMove('right')}
                    >
                        <ArrowRight className="w-8 h-8 text-slate-400 group-hover:text-white" />
                    </button>
                </div>
                <div className="col-start-2 row-start-3">
                     <button 
                        className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center hover:bg-cyan-600 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition-all group z-10 relative"
                        onMouseDown={() => handleMove('backward')}
                    >
                        <ArrowDown className="w-8 h-8 text-slate-400 group-hover:text-white" />
                    </button>
                </div>
             </div>
             
             <div className="mt-8 w-full px-4">
                 <h4 className="text-[10px] uppercase text-slate-500 font-mono mb-3 text-center tracking-widest">机械臂精细操作 (ARM CONTROL)</h4>
                 <div className="flex gap-2 justify-center">
                    <Button className="text-xs w-full">抓取</Button>
                    <Button className="text-xs w-full">释放</Button>
                    <Button className="text-xs w-full">伸出</Button>
                 </div>
             </div>
        </Card>

        <Card title="指令日志 (LOGS)" className="h-48">
            <div className="font-mono text-xs space-y-2 h-full overflow-auto p-1 custom-scrollbar">
                {log.map((entry, i) => (
                    <div key={i} className="flex gap-2 border-l-2 border-slate-700 pl-2 py-1">
                        <span className="text-slate-500">{new Date().toLocaleTimeString()}</span>
                        {/* 修复：将 > 转义为 &gt; */}
                        <span className="text-cyan-400">&gt;</span>
                        <span className="text-slate-300">{entry}</span>
                    </div>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};