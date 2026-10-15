"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  MouseEvent as RMouseEvent,
} from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
  Settings,
  Captions,
  Loader2,
  Wifi,
  RefreshCw,
} from "lucide-react";

interface VideoPlayerProps {
  videoUrl?: string;
  lessonTitle?: string;
}

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const DEMO_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

export default function VideoPlayer({ videoUrl, lessonTitle }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isDraggingScrub, setIsDraggingScrub] = useState(false);
  const [isDraggingVol, setIsDraggingVol] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);
  const [toast, setToast] = useState("");

  // animated diagram state
  const [offset, setOffset] = useState(8_412_091);
  const [lagDetected, setLagDetected] = useState(false);
  const [broker3Synced, setBroker3Synced] = useState(false);
  const [packetAnim, setPacketAnim] = useState(false);

  const src = videoUrl || DEMO_VIDEO;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    v.muted = muted;
    v.playbackRate = speed;
  }, [volume, muted, speed]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setOffset((o) => o + Math.floor(Math.random() * 2000 + 500));
      setPacketAnim((p) => !p);
      if (Math.random() > 0.7) setLagDetected((l) => !l);
      if (Math.random() > 0.85) setBroker3Synced((s) => !s);
    }, 1200);
    return () => clearInterval(interval);
  }, [playing]);

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || isDraggingScrub) return;
    setCurrentTime(v.currentTime);
    if (v.buffered.length > 0) {
      setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    }
  };

  const onLoadedMetadata = () => {
    setDuration(videoRef.current?.duration || 0);
    setLoading(false);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
      showToast("▶ Playing");
    } else {
      v.pause();
      setPlaying(false);
      showToast("⏸ Paused");
    }
    resetHideTimer();
  };

  const scrubTo = useCallback(
    (clientX: number) => {
      const bar = scrubRef.current;
      const v = videoRef.current;
      if (!bar || !v || !duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const t = ratio * duration;
      v.currentTime = t;
      setCurrentTime(t);
    },
    [duration]
  );

  const onScrubMouseDown = (e: RMouseEvent) => {
    setIsDraggingScrub(true);
    scrubTo(e.clientX);
  };
  const onScrubMouseMove = (e: RMouseEvent) => {
    const bar = scrubRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverTime(ratio * duration);
    setHoverX(e.clientX - rect.left);
    if (isDraggingScrub) scrubTo(e.clientX);
  };
  const onScrubLeave = () => setHoverTime(null);

  useEffect(() => {
    if (!isDraggingScrub) return;
    const up = () => setIsDraggingScrub(false);
    const move = (e: MouseEvent) => scrubTo(e.clientX);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [isDraggingScrub, scrubTo]);

  const volumeTo = useCallback((clientX: number) => {
    const bar = volumeRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setVolume(ratio);
    setMuted(ratio === 0);
  }, []);

  useEffect(() => {
    if (!isDraggingVol) return;
    const up = () => setIsDraggingVol(false);
    const move = (e: MouseEvent) => volumeTo(e.clientX);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [isDraggingVol, volumeTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const v = videoRef.current;
      if (!v) return;
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          v.currentTime = Math.min(v.currentTime + 10, duration);
          showToast("⏩ +10s");
          break;
        case "ArrowLeft":
          v.currentTime = Math.max(v.currentTime - 10, 0);
          showToast("⏪ -10s");
          break;
        case "ArrowUp":
          setVolume((prev) => Math.min(1, prev + 0.1));
          showToast("🔊 Volume up");
          break;
        case "ArrowDown":
          setVolume((prev) => Math.max(0, prev - 0.1));
          showToast("🔉 Volume down");
          break;
        case "m":
          setMuted((m) => { showToast(m ? "🔊 Unmuted" : "🔇 Muted"); return !m; });
          break;
        case "f":
          toggleFullscreen();
          break;
        case "c":
          setCaptions((c) => !c);
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [duration, muted, playing]);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative bg-black overflow-hidden shadow-2xl shadow-black/60 select-none group ${fullscreen ? "" : "rounded-2xl"}`}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Real video element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video bg-black block"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onEnded={() => { setPlaying(false); setShowControls(true); }}
        onClick={togglePlay}
        preload="metadata"
        playsInline
      />

      {/* Animated diagram overlay — visible when paused, fades while playing */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          playing ? "opacity-0 group-hover:opacity-80" : "opacity-100"
        }`}
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(2,6,23,0.93) 100%)" }}
      >
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 py-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[10px] sm:text-xs text-slate-300 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono">TOPIC: financial-ledger-tx (PARTITION 0)</span>
          </div>

          <div className="w-full max-w-lg grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-indigo-950/70 border border-indigo-500/60 flex flex-col items-center gap-1 shadow-lg backdrop-blur">
              <div className="text-[9px] font-bold uppercase tracking-wider text-indigo-400">LEADER (BROKER 1)</div>
              <div className="text-xs font-bold text-white">ISR POOL [1, 2]</div>
              <div className="text-[9px] font-mono text-indigo-300">Port 9092</div>
              <div className="mt-1 px-1.5 py-0.5 rounded text-[8px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">ACTIVE LEADER</div>
            </div>

            <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 shadow-lg backdrop-blur transition-colors duration-700 ${packetAnim ? "bg-cyan-950/80 border-cyan-400/70" : "bg-cyan-950/60 border-cyan-500/50"}`}>
              <div className="text-[9px] font-bold uppercase tracking-wider text-cyan-400">REPLICA (BROKER 2)</div>
              <div className="text-xs font-bold text-white">ISR POOL [1, 2]</div>
              <div className="text-[9px] font-mono text-cyan-300">Port 9093</div>
              <div className={`mt-1 px-1.5 py-0.5 rounded text-[8px] font-semibold border transition-colors ${packetAnim ? "bg-cyan-400/20 text-cyan-200 border-cyan-400/50" : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"}`}>IN-SYNC FOLLOWER</div>
            </div>

            <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 backdrop-blur transition-colors duration-700 ${broker3Synced ? "bg-emerald-950/60 border-emerald-500/50" : "bg-slate-900/80 border-slate-700/80"}`}>
              <div className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${broker3Synced ? "text-emerald-400" : "text-slate-500"}`}>REPLICA (BROKER 3)</div>
              <div className={`text-xs font-bold transition-colors ${broker3Synced ? "text-white" : "text-slate-400"}`}>ISR POOL {broker3Synced ? "[1,2,3]" : "[—]"}</div>
              <div className="text-[9px] font-mono text-slate-500">Port 9094</div>
              <div className={`mt-1 px-1.5 py-0.5 rounded text-[8px] font-semibold border transition-colors ${broker3Synced ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border-rose-500/30"}`}>{broker3Synced ? "RE-SYNCED" : "OUT OF SYNC"}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${packetAnim ? "bg-cyan-400" : "bg-slate-600"}`} />
              → sync replication
            </span>
            {lagDetected ? (
              <span className="text-rose-400 flex items-center gap-1 animate-pulse">
                <Wifi className="h-3 w-3" /> lag detected
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: "2s" }} /> in-sync
              </span>
            )}
          </div>

          <div className="w-full max-w-lg flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/70 border border-slate-700/50 text-[10px] font-mono text-slate-300 backdrop-blur gap-2 flex-wrap">
            <span className="text-amber-400">High Watermark: offset {offset.toLocaleString()}</span>
            <span className="text-slate-600 hidden sm:block">|</span>
            <span className="text-emerald-400">acks: -1 (ALL)</span>
            <span className="text-slate-600 hidden sm:block">|</span>
            <span className="text-indigo-400">min.insync.replicas: 2</span>
          </div>

          {captions && (
            <div className="px-4 py-1.5 bg-black/75 rounded-xl text-[11px] sm:text-xs text-center text-white max-w-sm leading-snug">
              {lessonTitle || "Lesson 4.3: Kafka Partitions, Consumer Groups & High-Throughput Replication"}
            </div>
          )}
        </div>
      </div>

      {/* Buffering spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="h-10 w-10 text-white/70 animate-spin" />
        </div>
      )}

      {/* Big play overlay */}
      {!playing && !loading && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition cursor-pointer"
          aria-label="Play"
        >
          <div className="h-16 w-16 rounded-full bg-white/15 border border-white/30 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
            <Play className="h-7 w-7 text-white fill-white ml-1" />
          </div>
        </button>
      )}

      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/70 text-white text-xs font-semibold backdrop-blur border border-white/10 pointer-events-none z-50 whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-3 pb-3 pt-10 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)" }}
      >
        {/* Scrubbar */}
        <div className="mb-3 relative">
          <div
            ref={scrubRef}
            className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer group/scrub hover:h-2.5 transition-all duration-150"
            onMouseDown={onScrubMouseDown}
            onMouseMove={onScrubMouseMove}
            onMouseUp={() => setIsDraggingScrub(false)}
            onMouseLeave={onScrubLeave}
          >
            <div className="absolute left-0 top-0 h-full bg-white/25 rounded-full" style={{ width: `${buffered}%` }} />
            <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md border-2 border-indigo-400 opacity-0 group-hover/scrub:opacity-100 transition-opacity"
              style={{ left: `${progress}%` }}
            />
            {hoverTime !== null && (
              <div
                className="absolute -top-8 -translate-x-1/2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono pointer-events-none"
                style={{ left: hoverX }}
              >
                {formatTime(hoverTime)}
              </div>
            )}
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10); showToast("⏪ -10s"); }} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer" title="Back 10s (←)">
              <SkipBack className="h-4 w-4" />
            </button>
            <button onClick={togglePlay} className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition cursor-pointer" title="Play/Pause (Space)">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
            </button>
            <button onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10); showToast("⏩ +10s"); }} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer" title="Forward 10s (→)">
              <SkipForward className="h-4 w-4" />
            </button>
            <button onClick={() => { setMuted((m) => !m); showToast(muted ? "🔊 Unmuted" : "🔇 Muted"); }} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer" title="Mute (M)">
              {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <div
              ref={volumeRef}
              className="hidden sm:block w-20 h-1 bg-white/20 rounded-full cursor-pointer relative group/vol"
              onMouseDown={(e) => { setIsDraggingVol(true); volumeTo(e.clientX); }}
            >
              <div className="absolute left-0 top-0 h-full bg-white rounded-full" style={{ width: `${(muted ? 0 : volume) * 100}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow border border-slate-300 opacity-0 group-hover/vol:opacity-100 transition-opacity" style={{ left: `${(muted ? 0 : volume) * 100}%` }} />
            </div>
            <span className="text-[11px] text-white/70 font-mono ml-1 whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {playing && (
              <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600/80 text-white text-[10px] font-bold border border-rose-400/50">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
            )}
            <button onClick={() => setCaptions((c) => !c)} className={`p-1.5 rounded-lg transition cursor-pointer ${captions ? "text-white bg-white/20 border border-white/30" : "text-white/50 hover:text-white hover:bg-white/10"}`} title="Captions (C)">
              <Captions className="h-4 w-4" />
            </button>
            <div className="relative">
              <button onClick={() => setShowSettings((s) => !s)} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition cursor-pointer border border-white/10" title="Settings">
                <Settings className="h-3.5 w-3.5" />
                <span>{speed}x</span>
              </button>
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 w-36 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl py-1 z-50 backdrop-blur">
                  <div className="px-3 py-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Playback Speed</div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((s) => (
                    <button key={s} onClick={() => { setSpeed(s); if (videoRef.current) videoRef.current.playbackRate = s; setShowSettings(false); showToast(`Speed: ${s}x`); }} className={`w-full px-3 py-1.5 text-left text-xs transition cursor-pointer ${speed === s ? "text-indigo-300 bg-indigo-600/20 font-semibold" : "text-slate-300 hover:bg-slate-800"}`}>
                      {s === 1 ? "Normal (1x)" : `${s}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={toggleFullscreen} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer" title="Fullscreen (F)">
              {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-black/60 text-white/50 text-[10px] font-mono backdrop-blur border border-white/10">
          Space · ← → · ↑↓ · M · F · C
        </div>
      </div>
    </div>
  );
}
