
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { GitState } from '../hooks/useGitSim';
import {
    File,
    FileCheck,
    ArrowRight,
    Cloud
} from 'lucide-react';

interface GitVisualizerProps {
    gitState: GitState;
}

const GitVisualizer: React.FC<GitVisualizerProps> = ({ gitState }) => {
    const workingDirRef = useRef<HTMLDivElement>(null);
    const stagingAreaRef = useRef<HTMLDivElement>(null);
    const repoRef = useRef<HTMLDivElement>(null);

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
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 mb-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Git 狀態儀表板</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Arrow connectors */}
                <div className="hidden md:block absolute top-1/2 left-[22%] -translate-y-1/2 z-0">
                    <ArrowRight className="text-gray-600 w-6 h-6" />
                </div>
                <div className="hidden md:block absolute top-1/2 left-[47%] -translate-y-1/2 z-0">
                    <ArrowRight className="text-gray-600 w-6 h-6" />
                </div>
                <div className="hidden md:block absolute top-1/2 left-[72%] -translate-y-1/2 z-0">
                    <ArrowRight className="text-gray-600 w-6 h-6" />
                </div>

                {/* Working Directory */}
                <div ref={workingDirRef} className="bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-600 relative z-10 min-h-[160px]">
                    <div className="text-gray-400 font-bold mb-3 flex items-center justify-between">
                        <span>工作目錄</span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">Untracked/Mod</span>
                    </div>
                    <div className="space-y-2">
                        {untracked.length === 0 && staged.length === 0 && committed.length === 0 && !gitState.repoInitialized ? (
                            <div className="text-gray-600 text-sm text-center mt-8">尚未初始化</div>
                        ) : untracked.length === 0 ? (
                            <div className="text-gray-600 text-sm text-center italic mt-4">乾淨！</div>
                        ) : (
                            untracked.map(f => (
                                <div key={f.name} className="file-card bg-red-900/40 border border-red-500/50 text-red-200 px-3 py-2 rounded flex items-center space-x-2">
                                    <File className="w-4 h-4" />
                                    <span>{f.name}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Staging Area */}
                <div ref={stagingAreaRef} className="bg-gray-800 rounded-lg p-4 border-2 border-dashed border-purple-500/50 relative z-10 min-h-[160px]">
                    <div className="text-purple-400 font-bold mb-3 flex items-center justify-between">
                        <span>暫存區</span>
                        <span className="text-xs bg-purple-900/50 px-2 py-1 rounded">Staged</span>
                    </div>
                    <div className="space-y-2">
                        {!gitState.repoInitialized ? (
                            <div className="text-gray-600 text-sm text-center mt-8">...</div>
                        ) : staged.length === 0 ? (
                            <div className="text-gray-600 text-sm text-center italic mt-4">空的</div>
                        ) : (
                            staged.map(f => (
                                <div key={f.name} className="file-card bg-green-900/40 border border-green-500/50 text-green-200 px-3 py-2 rounded flex items-center space-x-2">
                                    <FileCheck className="w-4 h-4" />
                                    <span>{f.name}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Repository */}
                <div ref={repoRef} className="bg-gray-800 rounded-lg p-4 border-2 border-solid border-blue-500/50 relative z-10 min-h-[160px]">
                    <div className="text-blue-400 font-bold mb-3 flex items-center justify-between">
                        <span>儲存庫 (Commits)</span>
                        <span className="text-xs bg-blue-900/50 px-2 py-1 rounded">HEAD</span>
                    </div>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600">
                        {!gitState.repoInitialized ? (
                            <div className="text-gray-600 text-sm text-center mt-8">...</div>
                        ) : committed.length === 0 ? (
                            <div className="text-gray-600 text-sm text-center italic mt-4">尚無提交</div>
                        ) : (
                            [...committed].reverse().map((msg, i) => (
                                <div key={i} className="file-card bg-blue-900/40 border border-blue-500/50 text-blue-200 px-3 py-2 rounded flex flex-col">
                                    <div className="flex items-center space-x-2 text-xs text-blue-300 border-b border-blue-500/30 pb-1 mb-1">
                                        <span className="font-mono">o-{Math.random().toString(16).substr(2, 6)}</span>
                                        <span>• {new Date().toLocaleTimeString()}</span>
                                    </div>
                                    <span className="truncate" title={msg}>{msg}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Remote Repository */}
                <div className="bg-gray-800 rounded-lg p-4 border-2 border-dashed border-sky-500/50 relative z-10 min-h-[160px]">
                    <div className="text-sky-400 font-bold mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Cloud className="w-4 h-4" />
                            <span>Remote</span>
                        </div>
                        <span className="text-xs bg-sky-900/50 px-2 py-1 rounded">origin/main</span>
                    </div>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600">
                        {!gitState.repoInitialized ? (
                            <div className="text-gray-600 text-sm text-center mt-8">...</div>
                        ) : remote.length === 0 ? (
                            <div className="text-gray-600 text-sm text-center italic mt-4">雲端空空如也</div>
                        ) : (
                            [...remote].reverse().map((msg, i) => (
                                <div key={i} className="file-card bg-sky-900/40 border border-sky-500/50 text-sky-200 px-3 py-2 rounded flex flex-col">
                                    <div className="flex items-center space-x-2 text-xs text-sky-300 border-b border-sky-500/30 pb-1 mb-1">
                                        <span className="font-mono">origin</span>
                                        <span>• Synced</span>
                                    </div>
                                    <span className="truncate" title={msg}>{msg}</span>
                                </div>
                            ))
                        )}
                        {gitState.repoInitialized && committed.length > remote.length && (
                            <div className="text-xs text-yellow-500 text-center animate-pulse mt-2">
                                ⚠ {committed.length - remote.length} commits ahead (Push needed)
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GitVisualizer;
