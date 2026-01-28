
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { GitState } from '../hooks/useGitSim';
import {
    File,
    FileCheck,
    ArrowRight,
    Cloud
} from 'lucide-react';
import FileContentModal from './FileContentModal';

interface GitVisualizerProps {
    gitState: GitState;
}

const GitVisualizer: React.FC<GitVisualizerProps> = ({ gitState }) => {
    const workingDirRef = useRef<HTMLDivElement>(null);
    const stagingAreaRef = useRef<HTMLDivElement>(null);
    const repoRef = useRef<HTMLDivElement>(null);

    const [selectedFile, setSelectedFile] = React.useState<{ name: string, content: string, status: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleFileClick = (file: { name: string, content: string, status: string }) => {
        setSelectedFile(file);
        setIsModalOpen(true);
    };

    // Helper to get files for each stage
    const untracked = gitState.files.filter(f => f.status === 'untracked' || f.status === 'modified');
    const staged = gitState.files.filter(f => f.status === 'staged');
    const committed = gitState.commitHistory; // Just count/show commits
    const remote = gitState.remoteCommits;

    useEffect(() => {
        // Simple animation when files change sets
        gsap.fromTo(".file-card", { scale: 0.9 }, { scale: 1, duration: 0.2, ease: "back.out(1.7)" });
    }, [gitState]);

    return (
        <div className="glass-panel p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold text-starlight mb-6 text-center font-display">Git 狀態儀表板</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Arrow connectors */}
                <div className="hidden md:block absolute top-1/2 left-[22%] -translate-y-1/2 z-0">
                    <ArrowRight className="text-white/20 w-6 h-6" />
                </div>
                <div className="hidden md:block absolute top-1/2 left-[47%] -translate-y-1/2 z-0">
                    <ArrowRight className="text-white/20 w-6 h-6" />
                </div>
                <div className="hidden md:block absolute top-1/2 left-[72%] -translate-y-1/2 z-0">
                    <ArrowRight className="text-white/20 w-6 h-6" />
                </div>

                {/* Working Directory */}
                <div ref={workingDirRef} className="glass-card p-4 rounded-lg relative z-10 min-h-[160px] border-l-4 border-l-system-red/50">
                    <div className="text-starlight font-bold mb-3 flex items-center justify-between">
                        <span className="font-display">工作目錄</span>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-system-red font-mono">Untracked</span>
                    </div>
                    <div className="space-y-2">
                        {untracked.length === 0 && staged.length === 0 && committed.length === 0 && !gitState.repoInitialized ? (
                            <div className="text-ghost text-sm text-center mt-8">尚未初始化</div>
                        ) : untracked.length === 0 ? (
                            <div className="text-ghost text-sm text-center italic mt-4">乾淨！</div>
                        ) : (
                            untracked.map(f => (
                                <div
                                    key={f.name}
                                    onClick={() => handleFileClick(f)}
                                    className="file-card bg-system-red/20 border border-system-red/30 text-starlight px-3 py-2 rounded flex items-center space-x-2 cursor-pointer hover:bg-system-red/30 transition-colors"
                                >
                                    <File className="w-4 h-4 text-system-red" />
                                    <span className="font-mono text-xs">{f.name}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Staging Area */}
                <div ref={stagingAreaRef} className="glass-card p-4 rounded-lg relative z-10 min-h-[160px] border-l-4 border-l-cyber-purple/50">
                    <div className="text-starlight font-bold mb-3 flex items-center justify-between">
                        <span className="font-display">暫存區</span>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-cyber-purple font-mono">Staged</span>
                    </div>
                    <div className="space-y-2">
                        {!gitState.repoInitialized ? (
                            <div className="text-ghost text-sm text-center mt-8">...</div>
                        ) : staged.length === 0 ? (
                            <div className="text-ghost text-sm text-center italic mt-4">空的</div>
                        ) : (
                            staged.map(f => (
                                <div
                                    key={f.name}
                                    onClick={() => handleFileClick(f)}
                                    className="file-card bg-cyber-purple/20 border border-cyber-purple/30 text-starlight px-3 py-2 rounded flex items-center space-x-2 cursor-pointer hover:bg-cyber-purple/30 transition-colors"
                                >
                                    <FileCheck className="w-4 h-4 text-cyber-purple" />
                                    <span className="font-mono text-xs">{f.name}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Repository (Graph View) */}
                <div ref={repoRef} className="glass-card p-4 rounded-lg relative z-10 min-h-[160px] overflow-hidden border-l-4 border-l-electric-blue/50">
                    <div className="text-starlight font-bold mb-3 flex items-center justify-between">
                        <span className="font-display">儲存庫</span>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-electric-blue font-mono">HEAD</span>
                    </div>

                    {!gitState.repoInitialized ? (
                        <div className="text-ghost text-sm text-center mt-8">...</div>
                    ) : committed.length === 0 ? (
                        <div className="text-ghost text-sm text-center italic mt-4">尚無提交</div>
                    ) : (
                        <div className="relative w-full h-[140px] overflow-x-auto scrollbar-thin scrollbar-thumb-white/20">
                            <svg className="min-w-full h-full">
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
                                    </marker>
                                </defs>
                                {committed.map((commit, i) => {
                                    // Simple layout logic
                                    const x = 30 + i * 60;
                                    const y = commit.branch === 'main' ? 50 : 90;

                                    // Find parent to draw line
                                    let parentX = 0;
                                    let parentY = 0;
                                    let hasParent = false;

                                    if (commit.parentId) {
                                        const parent = committed.find(c => c.id === commit.parentId);
                                        if (parent) {
                                            const pIndex = committed.findIndex(c => c.id === parent.id);
                                            parentX = 30 + pIndex * 60;
                                            parentY = parent.branch === 'main' ? 50 : 90;
                                            hasParent = true;
                                        }
                                    }

                                    return (
                                        <g key={commit.id} className="group cursor-pointer">
                                            {hasParent && (
                                                <line
                                                    x1={parentX} y1={parentY}
                                                    x2={x} y2={y}
                                                    stroke="#3B82F6"
                                                    strokeWidth="2"
                                                    markerEnd="url(#arrowhead)"
                                                    className="opacity-50"
                                                />
                                            )}
                                            <circle
                                                cx={x} cy={y}
                                                r="6"
                                                fill={commit.branch === 'main' ? '#3B82F6' : '#EC4899'}
                                                className="transition-all duration-300 group-hover:r-8 hover:brightness-125"
                                            />
                                            <text x={x} y={y + 20} textAnchor="middle" fill="#94A3B8" fontSize="10" className="opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                                                {commit.id.substr(0, 4)}
                                            </text>
                                            <foreignObject x={x - 60} y={y - 50} width="120" height="40" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <div className="bg-holodeck text-starlight text-xs p-1 rounded border border-white/20 text-center truncate font-mono shadow-lg">
                                                    {commit.message}
                                                </div>
                                            </foreignObject>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    )}
                </div>

                {/* Remote Repository */}
                <div className="glass-card p-4 rounded-lg relative z-10 min-h-[160px] border-l-4 border-l-terminal-green/50">
                    <div className="text-starlight font-bold mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Cloud className="w-4 h-4 text-terminal-green" />
                            <span className="font-display">Remote</span>
                        </div>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-terminal-green font-mono">origin</span>
                    </div>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20">
                        {!gitState.repoInitialized ? (
                            <div className="text-ghost text-sm text-center mt-8">...</div>
                        ) : remote.length === 0 ? (
                            <div className="text-ghost text-sm text-center italic mt-4">雲端空空如也</div>
                        ) : (
                            [...remote].reverse().map((commit) => (
                                <div key={commit.id} className="file-card bg-terminal-green/20 border border-terminal-green/30 text-starlight px-3 py-2 rounded flex flex-col">
                                    <div className="flex items-center space-x-2 text-xs text-terminal-green border-b border-terminal-green/30 pb-1 mb-1">
                                        <span className="font-mono">origin</span>
                                        <span>• Synced</span>
                                    </div>
                                    <span className="truncate font-mono text-xs" title={commit.message}>{commit.message}</span>
                                </div>
                            ))
                        )}
                        {gitState.repoInitialized && committed.length > remote.length && (
                            <div className="text-xs text-yellow-500 text-center animate-pulse mt-2 font-mono">
                                ⚠ {committed.length - remote.length} commits ahead (Push needed)
                            </div>
                        )}
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
