
import React, { useState, useRef, useEffect } from 'react';
import { useGitSim } from '../hooks/useGitSim';
import type { TerminalLine } from '../hooks/useGitSim';

const Terminal: React.FC = () => {
    const { history, executeCommand, gitState, resetSimulation } = useGitSim();
    const [inputValue, setInputValue] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        <div className="w-full max-w-4xl mx-auto my-8 p-4 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 font-mono text-sm sm:text-base overflow-hidden">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-700">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-gray-500 text-xs">git-playground — -zsh — 80x24</div>
            </div>

            <div className="h-96 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {history.map((line) => (
                    <div key={line.id} className={`${getLineColor(line.type)} break-words`}>
                        {line.type === 'input' ? (
                            <span><span className="text-green-500">➜</span> <span className="text-cyan-400">~/project</span> {line.content}</span>
                        ) : (
                            <span>{line.content}</span>
                        )}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="mt-2 flex items-center">
                <span className="text-green-500 mr-2">➜</span>
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
                    className="flex-1 bg-transparent border-none outline-none text-yellow-400 placeholder-gray-600"
                    placeholder="Try 'git init'..."
                    autoFocus
                />
            </div>

            <button
                onClick={resetSimulation}
                className="mt-4 text-xs text-gray-500 hover:text-white transition-colors"
            >
                [Reset Simulation]
            </button>
        </div>
    );
};

export default Terminal;
