
import React, { useState, useRef, useEffect } from 'react';
import { useGitSim } from '../hooks/useGitSim';
import type { TerminalLine } from '../hooks/useGitSim';
import BranchControlPanel from './BranchControlPanel';
import GitVisualizer from './GitVisualizer';
import { Terminal as TerminalIcon, CheckCircle2, ArrowRight } from 'lucide-react';

const Terminal: React.FC = () => {
    const { history, executeCommand, gitState, resetSimulation, currentQuest, completedAllQuests } = useGitSim();
    const [inputValue, setInputValue] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only auto-scroll if user has interacted (history length > 1)
        if (history.length > 1) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            executeCommand(inputValue);
            setInputValue('');
        }
    };

    const getLineColor = (type: TerminalLine['type']) => {
        switch (type) {
            case 'input': return 'text-yellow-400';
            case 'output': return 'text-ghost';
            case 'error': return 'text-system-red';
            case 'success': return 'text-terminal-green';
            case 'info': return 'text-electric-blue';
            default: return 'text-starlight';
        }
    };

    const suggestions = [
        { label: 'git status', cmd: 'git status' },
        { label: 'git add .', cmd: 'git add .' },
        { label: 'git commit', cmd: 'git commit -m "update"' },
        { label: 'git merge', cmd: 'git merge feature' },
        { label: 'git push', cmd: 'git push' },
        { label: 'clear', cmd: 'clear' },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto my-8 font-mono text-sm sm:text-base">

            {/* Time Jump Console */}
            <BranchControlPanel gitState={gitState} onExecute={executeCommand} />

            {/* Visualizer Section */}
            <GitVisualizer gitState={gitState} />

            {/* Quest Header */}
            <div className="bg-gradient-to-r from-cyber-purple/20 to-electric-blue/20 p-4 rounded-t-lg border-t border-l border-r border-white/10 flex justify-between items-center backdrop-blur">
                <div>
                    {!completedAllQuests ? (
                        <>
                            <div className="text-xs text-yellow-400 font-bold uppercase tracking-wider mb-1">Current Quest</div>
                            <div className="text-starlight font-bold text-lg font-display">{currentQuest.title}</div>
                            <div className="text-ghost text-sm">{currentQuest.description}</div>
                        </>
                    ) : (
                        <div className="text-terminal-green font-bold text-lg flex items-center gap-2 font-display">
                            <CheckCircle2 className="w-5 h-5" /> All Systems Operational! You are a Git Master.
                        </div>
                    )}
                </div>
                <div className="hidden md:block">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-2xl border border-white/10">
                        {completedAllQuests ? <CheckCircle2 className="w-8 h-8 text-terminal-green" /> : <TerminalIcon className="w-8 h-8 text-starlight" />}
                    </div>
                </div>
            </div>

            {/* Terminal Window */}
            <div className="bg-holodeck rounded-b-lg shadow-2xl shadow-black/50 border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between p-2 bg-black/20 border-b border-white/5">
                    <div className="flex space-x-2 pl-2">
                        <div className="w-3 h-3 rounded-full bg-system-red hover:bg-red-600 cursor-pointer transition-colors"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer transition-colors"></div>
                        <div className="w-3 h-3 rounded-full bg-terminal-green hover:bg-green-600 cursor-pointer transition-colors"></div>
                    </div>
                    <div className="text-ghost text-xs select-none font-mono">git-playground — -zsh — 80x24</div>
                    <div className="w-10"></div>{/* Spacer */}
                </div>

                <div
                    className="h-96 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent bg-holodeck/95"
                >
                    {history.map((line) => (
                        <div key={line.id} className={`${getLineColor(line.type)} break-words leading-relaxed`}>
                            {line.type === 'input' ? (
                                <span className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-terminal-green" /> <span className="text-electric-blue">~/project</span> {line.content}</span>
                            ) : (
                                <span>{line.content}</span>
                            )}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                <div className="p-4 bg-holodeck border-t border-white/5 flex items-center">
                    <ArrowRight className="w-4 h-4 text-terminal-green mr-2" />
                    <span className="text-electric-blue mr-2">~/project</span>
                    {gitState.repoInitialized && (
                        <span className="text-neon-pink mr-2">
                            ({gitState.currentBranch || 'main'} {gitState.files.some(f => f.status === 'modified' || f.status === 'staged') ? '*' : ''})
                        </span>
                    )}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent border-none outline-none text-yellow-400 placeholder-white/20 font-mono"
                        placeholder={completedAllQuests ? "You're free to explore..." : "Follow the quest instructions..."}
                    />
                </div>
            </div>

            {/* Suggested Commands */}
            <div className="flex flex-wrap gap-2 mt-4 px-2">
                <span className="text-ghost text-xs flex items-center mr-2">💡 快速指令:</span>
                {suggestions.map((s) => (
                    <button
                        key={s.label}
                        onClick={() => {
                            setInputValue(s.cmd);
                            // Optional: focus input
                            document.querySelector<HTMLInputElement>('input')?.focus();
                        }}
                        className="text-xs bg-white/5 hover:bg-white/10 text-electric-blue px-2 py-1 rounded border border-white/10 transition-colors cursor-pointer font-mono"
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            <div className="flex justify-end mt-2 px-2">
                <button
                    onClick={resetSimulation}
                    className="text-xs text-ghost hover:text-system-red transition-colors cursor-pointer hover:underline"
                >
                    [Reset Simulation & Quests]
                </button>
            </div>
        </div>
    );
};

export default Terminal;
