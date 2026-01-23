
import React, { useState, useRef, useEffect } from 'react';
import { useGitSim } from '../hooks/useGitSim';
import type { TerminalLine } from '../hooks/useGitSim';
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
            case 'output': return 'text-gray-300';
            case 'error': return 'text-red-400';
            case 'success': return 'text-green-400';
            case 'info': return 'text-blue-300';
            default: return 'text-white';
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto my-8 font-mono text-sm sm:text-base">

            {/* Visualizer Section */}
            <GitVisualizer gitState={gitState} />

            {/* Quest Header */}
            <div className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 p-4 rounded-t-lg border-t border-l border-r border-gray-700 flex justify-between items-center backdrop-blur">
                <div>
                    {!completedAllQuests ? (
                        <>
                            <div className="text-xs text-yellow-400 font-bold uppercase tracking-wider mb-1">Current Quest</div>
                            <div className="text-white font-bold text-lg">{currentQuest.title}</div>
                            <div className="text-gray-300 text-sm">{currentQuest.description}</div>
                        </>
                    ) : (
                        <div className="text-green-400 font-bold text-lg flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> All Systems Operational! You are a Git Master.
                        </div>
                    )}
                </div>
                <div className="hidden md:block">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">
                        {completedAllQuests ? <CheckCircle2 className="w-8 h-8 text-green-400" /> : <TerminalIcon className="w-8 h-8 text-white" />}
                    </div>
                </div>
            </div>

            {/* Terminal Window */}
            <div className="bg-gray-900 rounded-b-lg shadow-2xl border border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
                    <div className="flex space-x-2 pl-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer transition-colors"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer transition-colors"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer transition-colors"></div>
                    </div>
                    <div className="text-gray-500 text-xs select-none">git-playground — -zsh — 80x24</div>
                    <div className="w-10"></div>{/* Spacer */}
                </div>

                <div
                    className="h-96 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent bg-gray-900/95"
                >
                    {history.map((line) => (
                        <div key={line.id} className={`${getLineColor(line.type)} break-words leading-relaxed`}>
                            {line.type === 'input' ? (
                                <span className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-green-500" /> <span className="text-cyan-400">~/project</span> {line.content}</span>
                            ) : (
                                <span>{line.content}</span>
                            )}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                <div className="p-4 bg-gray-900 border-t border-gray-800 flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-cyan-400 mr-2">~/project</span>
                    {gitState.repoInitialized && (
                        <span className="text-purple-400 mr-2">
                            (main {gitState.files.some(f => f.status === 'modified' || f.status === 'staged') ? '*' : ''})
                        </span>
                    )}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent border-none outline-none text-yellow-400 placeholder-gray-700"
                        placeholder={completedAllQuests ? "You're free to explore..." : "Follow the quest instructions..."}
                    />
                </div>
            </div>

            <div className="flex justify-end mt-2">
                <button
                    onClick={resetSimulation}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors cursor-pointer hover:underline"
                >
                    [Reset Simulation & Quests]
                </button>
            </div>
        </div>
    );
};

export default Terminal;
