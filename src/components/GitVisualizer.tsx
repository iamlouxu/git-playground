import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import type { GitState } from '../hooks/useGitSim';
import {
    File,
    FileCheck,
    ArrowRight,
    Cloud,
    Database,
    Cpu,
    Zap,
    Rocket
} from 'lucide-react';
import FileContentModal from './FileContentModal';

interface GitVisualizerProps {
    gitState: GitState;
}

const GitVisualizer: React.FC<GitVisualizerProps> = ({ gitState }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const [selectedFile, setSelectedFile] = React.useState<{ name: string, content: string, status: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleFileClick = (file: { name: string, content: string, status: string }) => {
        setSelectedFile(file);
        setIsModalOpen(true);
    };

    const untracked = gitState.files.filter(f => f.status === 'untracked' || f.status === 'modified');
    const staged = gitState.files.filter(f => f.status === 'staged');
    const committed = gitState.commitHistory;
    const remote = gitState.remoteCommits;

    // 3D Tilt Effect
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        // Calculate tilt: -10deg to 10deg
        setTilt({
            x: (0.5 - y) * 10,
            y: (x - 0.5) * 10
        });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    useEffect(() => {
        // Entrance animation for files
        gsap.fromTo(".file-row",
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" }
        );
    }, [gitState.files]);

    return (
        <div
            className="perspective-1000 mb-8 w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={containerRef}
                className="glass-panel p-6 rounded-xl overflow-hidden relative transition-transform duration-200 ease-out transform-style-3d bg-[#0B0C15]/80 backdrop-blur-xl border border-white/10"
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
            >
                {/* Holographic grid background */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)_translateY(-100px)_scale(2)]"></div>

                <h3 className="text-2xl font-bold text-starlight mb-8 text-center font-display tracking-[0.2em] uppercase flex items-center justify-center gap-4 relative z-10 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
                    <Rocket className="w-6 h-6 text-neon-pink animate-pulse" />
                    <span>Hyper-Drive Station</span>
                    <Rocket className="w-6 h-6 text-neon-pink transform scale-x-[-1] animate-pulse" />
                </h3>

                {/* Main Flow Container */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10 min-h-[350px]">
                    {/* Connecting Beams (Visual only) */}
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-y-1/2 pointer-events-none blur-sm"></div>

                    {/* Zone 1: Assembly Matrix (Working Directory) */}
                    <div className="relative group perspective-500">
                        <div className="absolute inset-0 bg-system-red/5 rounded-lg border border-system-red/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all group-hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]"></div>
                        <div className="relative p-4 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4 text-system-red font-display tracking-wider border-b border-system-red/30 pb-2">
                                <span className="flex items-center gap-2"><Cpu className="w-4 h-4" /> ASSEMBLY</span>
                                <span className="text-[10px] bg-system-red/20 px-1 rounded animate-pulse">LIVE</span>
                            </div>

                            <div className="flex-1 space-y-2 overflow-y-auto max-h-[250px] scrollbar-hide">
                                {untracked.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-system-red/30 italic font-mono text-sm">
                                        <div>[NO INPUT DATA]</div>
                                        <div className="text-[10px] opacity-50 mt-1">Waiting for modifications...</div>
                                    </div>
                                ) : (
                                    untracked.map(f => (
                                        <div
                                            key={f.name}
                                            onClick={() => handleFileClick(f)}
                                            className="file-row bg-[#1a1c2e] border-l-2 border-system-red p-2 rounded-r flex items-center gap-3 cursor-pointer hover:bg-system-red/10 hover:translate-x-1 transition-all group/file relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-system-red/10 to-transparent translate-x-[-100%] group-hover/file:translate-x-[100%] transition-transform duration-1000"></div>
                                            <File className="w-4 h-4 text-system-red shrink-0" />
                                            <span className="font-mono text-xs text-starlight whitespace-normal break-all leading-tight">{f.name}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Zone 2: Fusion Core (Staging) */}
                    <div className="relative group perspective-500">
                        <div className="absolute inset-0 bg-cyber-purple/5 rounded-lg border border-cyber-purple/20 shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all group-hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]"></div>
                        <div className="relative p-4 h-full flex flex-col items-center">
                            <div className="w-full flex items-center justify-between mb-4 text-cyber-purple font-display tracking-wider border-b border-cyber-purple/30 pb-2">
                                <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> FUSION CORE</span>
                                <span className="text-[10px] bg-cyber-purple/20 px-1 rounded">{staged.length} UNITS</span>
                            </div>

                            {/* Rotating Core Animation Background */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-20 pointer-events-none">
                                <svg viewBox="0 0 100 100" className={`w-full h-full ${staged.length > 0 ? 'animate-[spin_4s_linear_infinite]' : 'animate-[spin_20s_linear_infinite]'}`}>
                                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" fill="none" className="text-cyber-purple" strokeDasharray="10 5" />
                                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" fill="none" className="text-cyber-purple" strokeDasharray="20 10" />
                                    <path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="1" className="text-cyber-purple" />
                                </svg>
                            </div>

                            <div className="w-full flex-1 space-y-2 overflow-y-auto max-h-[250px] scrollbar-hide relative z-10">
                                {staged.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-cyber-purple/30 italic font-mono text-sm">
                                        <div>[CORE IDLE]</div>
                                    </div>
                                ) : (
                                    staged.map(f => (
                                        <div
                                            key={f.name}
                                            onClick={() => handleFileClick(f)}
                                            className="file-row bg-[#1a1c2e]/80 backdrop-blur-sm border border-cyber-purple/30 p-2 rounded shadow-[0_0_10px_rgba(168,85,247,0.2)] flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform w-[95%] mx-auto"
                                        >
                                            <FileCheck className="w-4 h-4 text-cyber-purple shrink-0" />
                                            <span className="font-mono text-xs text-white text-shadow-glow whitespace-normal break-all leading-tight flex-1">{f.name}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Zone 3: Galactic Map (Repo) */}
                    <div className="relative group perspective-500">
                        <div className="absolute inset-0 bg-electric-blue/5 rounded-lg border border-electric-blue/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all group-hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]"></div>
                        <div className="relative p-4 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4 text-electric-blue font-display tracking-wider border-b border-electric-blue/30 pb-2">
                                <span className="flex items-center gap-2"><Database className="w-4 h-4" /> GALACTIC MAP</span>
                                <span className="text-[10px] bg-electric-blue/20 px-1 rounded">HEAD: {committed.slice(-1)[0]?.id.substring(0, 4) || 'NULL'}</span>
                            </div>

                            <div className="flex-1 relative overflow-hidden bg-[#05060a] rounded-lg border border-white/5 shadow-inner">
                                {/* Stars background */}
                                <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>

                                {!gitState.repoInitialized ? (
                                    <div className="flex items-center justify-center h-full text-electric-blue/30 font-mono text-sm">[UNCHARTED]</div>
                                ) : committed.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-electric-blue/30 font-mono text-sm">[NO PLANETS DETECTED]</div>
                                ) : (
                                    <div className="absolute inset-0 overflow-y-auto scrollbar-hide p-4 space-y-3">
                                        <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-electric-blue/50 via-electric-blue/20 to-transparent pointer-events-none"></div>
                                        {[...committed].reverse().map((commit, i) => {
                                            const isHead = i === 0;
                                            return (
                                                <div key={commit.id} className="relative flex items-center gap-3 group/item">
                                                    {/* Timeline Node */}
                                                    <div className={`relative z-10 w-3 h-3 rounded-full border-2 shrink-0 transition-all duration-300 
                                                        ${commit.branch === 'main' ? 'border-electric-blue bg-[#0B0C15]' : 'border-neon-pink bg-[#0B0C15]'}
                                                        ${isHead ? 'w-4 h-4 shadow-[0_0_10px_rgba(59,130,246,0.8)] bg-electric-blue' : 'group-hover/item:scale-125'}
                                                    `}></div>

                                                    {/* Card */}
                                                    <div
                                                        className={`flex-1 rounded border p-2 flex flex-col gap-1 transition-all duration-200 cursor-pointer
                                                            ${commit.branch === 'main'
                                                                ? 'bg-electric-blue/5 border-electric-blue/20 hover:bg-electric-blue/10 hover:border-electric-blue/40'
                                                                : 'bg-neon-pink/5 border-neon-pink/20 hover:bg-neon-pink/10 hover:border-neon-pink/40'}
                                                            ${isHead ? 'ring-1 ring-white/20 shadow-lg' : ''}
                                                        `}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold
                                                                    ${commit.branch === 'main' ? 'bg-electric-blue/20 text-electric-blue' : 'bg-neon-pink/20 text-neon-pink'}
                                                                `}>
                                                                    #{commit.id.substring(0, 4)}
                                                                </span>
                                                                {isHead && <span className="text-[9px] bg-white/10 px-1 rounded text-starlight animate-pulse">HEAD</span>}
                                                            </div>
                                                            <span className="text-[9px] text-ghost font-mono">{new Date(commit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                        <div className="text-xs text-starlight leading-relaxed font-mono break-words pl-1">
                                                            {commit.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Zone 4: Void Gateway (Remote) */}
                    <div className="relative group perspective-500">
                        <div className="absolute inset-0 bg-terminal-green/5 rounded-lg border border-terminal-green/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all group-hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]"></div>
                        <div className="relative p-4 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4 text-terminal-green font-display tracking-wider border-b border-terminal-green/30 pb-2">
                                <span className="flex items-center gap-2"><Cloud className="w-4 h-4" /> VOID GATEWAY</span>
                                <span className="text-[10px] bg-terminal-green/20 px-1 rounded">ORIGIN</span>
                            </div>

                            <div className="flex-1 flex flex-col items-center relative">
                                {/* Portal Animation */}
                                <div className={`relative w-24 h-24 flex items-center justify-center mb-2 ${committed.length > remote.length ? 'bg-yellow-500/10' : 'bg-transparent'} rounded-full transition-colors duration-500`}>
                                    {/* Rotating Rings */}
                                    {gitState.repoInitialized && (
                                        <>
                                            <div className="absolute inset-0 rounded-full border border-terminal-green/30 border-t-transparent animate-[spin_3s_linear_infinite]"></div>
                                            <div className="absolute inset-2 rounded-full border border-terminal-green/20 border-b-transparent animate-[spin_5s_linear_infinite_reverse]"></div>
                                        </>
                                    )}
                                    <Cloud className={`w-8 h-8 ${committed.length > remote.length ? 'text-yellow-500' : 'text-terminal-green'} drop-shadow-[0_0_10px_currentColor]`} />
                                </div>

                                {/* Status Text */}
                                {committed.length > remote.length ? (
                                    <div className="text-yellow-500 font-mono text-center text-xs animate-pulse font-bold">
                                        ⚠ SYNC REQUIRED<br />
                                        <span className="text-[10px] opacity-80">{committed.length - remote.length} pending packet</span>
                                    </div>
                                ) : (
                                    <div className="text-terminal-green font-mono text-center text-xs">
                                        ● LINK STABLE<br />
                                        <span className="text-[10px] opacity-50">All systems nominal</span>
                                    </div>
                                )}

                                {/* Recent Pushes list (Vertical) */}
                                <div className="w-full mt-4 space-y-1 overflow-y-auto max-h-[100px] scrollbar-hide border-t border-white/5 pt-2">
                                    {[...remote].reverse().slice(0, 3).map(c => (
                                        <div key={c.id} className="text-[10px] font-mono text-terminal-green/70 flex items-center gap-2 truncate">
                                            <span className="w-1 h-1 bg-terminal-green rounded-full"></span>
                                            {c.message}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {selectedFile && (
                <FileContentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    fileName={selectedFile.name}
                    content={selectedFile.content}
                    status={selectedFile.status}
                />
            )}
        </div>
    );
};

export default GitVisualizer;
