import React from 'react';
import { GitBranch, Radio, History, ArrowRight, Lock, Power } from 'lucide-react';
import type { GitState } from '../../types/git';

interface BranchControlPanelProps {
    gitState: GitState;
    onExecute: (cmd: string) => void;
}

const BranchSwitcher: React.FC<BranchControlPanelProps> = ({ gitState, onExecute }) => {
    // Determine branches to display. If initialized, use state branches; otherwise empty or showing offline status
    const availableBranches = gitState.repoInitialized ? gitState.branches : [];

    const handleSwitch = (branch: string) => {
        if (!gitState.repoInitialized) return;
        if (branch === gitState.currentBranch) return;

        onExecute(`git checkout ${branch}`);
    };

    return (
        <div className="glass-panel p-4 rounded-xl mb-4 border border-white/10 relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <History className="w-24 h-24 text-cyber-purple" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 relative z-10 gap-2">
                <div>
                    <h3 className="text-lg font-bold text-starlight font-display flex items-center gap-2">
                        <Radio className={`w-5 h-5 ${gitState.repoInitialized ? 'text-neon-pink animate-pulse' : 'text-gray-500'}`} />
                        時空跳躍控制台 (Time Jump)
                    </h3>
                    <p className="text-xs text-ghost mt-1">
                        {gitState.repoInitialized
                            ? "點擊時空座標進行跳躍，或使用終端機手動導航"
                            : "系統離線 (System Offline) - 請在終端機輸入 git init 以啟動引擎"
                        }
                    </p>
                </div>

                {gitState.repoInitialized && (
                    <span className="text-xs font-mono text-ghost bg-white/5 px-2 py-1 rounded border border-white/5 flex items-center gap-2 self-start md:self-auto">
                        HEAD <ArrowRight className="w-3 h-3 text-neon-pink" /> <span className="text-electric-blue">{gitState.currentBranch}</span>
                    </span>
                )}
            </div>

            {!gitState.repoInitialized ? (
                // Offline State
                <div className="flex items-center justify-center p-8 border border-white/5 rounded-lg bg-black/20 dashed-border">
                    <div className="text-center">
                        <Power className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <span className="text-gray-500 font-mono text-sm">Waiting for repository initialization...</span>
                    </div>
                </div>
            ) : (
                // Online State
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10 transition-all duration-500">
                    {availableBranches.map((branch) => (
                        <button
                            key={branch}
                            onClick={() => handleSwitch(branch)}
                            disabled={branch === gitState.currentBranch}
                            className={`
                                relative p-3 rounded-lg border transition-all duration-300 group/branch text-left
                                ${branch === gitState.currentBranch
                                    ? 'bg-cyber-purple/20 border-cyber-purple text-starlight shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-default'
                                    : 'bg-black/40 border-white/10 text-ghost hover:bg-white/10 hover:border-electric-blue/50 hover:text-white cursor-pointer hover:shadow-[0_0_10px_rgba(56,189,248,0.2)]'}
                            `}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2 font-mono font-bold">
                                    <GitBranch className={`w-4 h-4 ${branch === gitState.currentBranch ? 'text-neon-pink' : 'text-ghost group-hover/branch:text-electric-blue'}`} />
                                    {branch}
                                </div>
                                {branch === gitState.currentBranch && (
                                    <span className="text-[10px] bg-cyber-purple text-white px-1.5 rounded font-bold tracking-wider">ACTIVE</span>
                                )}
                            </div>
                            <div className="text-[10px] opacity-60 font-mono truncate flex justify-between">
                                <span>Latest Commit:</span>
                                <span>{gitState.commitHistory.filter(c => c.branch === branch).slice(-1)[0]?.id.substring(0, 7) || 'Empty'}</span>
                            </div>

                            {/* Hover highlight for non-active branches */}
                            {branch !== gitState.currentBranch && (
                                <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent group-hover/branch:ring-electric-blue/30 pointer-events-none"></div>
                            )}
                        </button>
                    ))}

                    {/* Add Branch Hint (Pseudo-button) */}
                    <div className="p-3 rounded-lg border border-white/5 border-dashed bg-white/5 opacity-50 flex items-center justify-center gap-2 text-xs text-ghost font-mono">
                        <Lock className="w-3 h-3" />
                        <span>使用 git checkout -b &lt;name&gt; 開啟新時空</span>
                    </div>
                </div>
            )}

            {/* Decorative Scan Line */}
            {gitState.repoInitialized && (
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent translate-y-[-10px] animate-[scan_3s_linear_infinite]"></div>
            )}
        </div>
    );
};

export default BranchSwitcher;
