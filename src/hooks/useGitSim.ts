
import { useState, useCallback } from 'react';

export type TerminalLine = {
    id: string;
    type: 'input' | 'output' | 'error' | 'success' | 'info';
    content: string;
};

export type FileStatus = 'untracked' | 'modified' | 'staged' | 'committed';

export type SimFile = {
    name: string;
    status: FileStatus;
};

export type GitState = {
    repoInitialized: boolean;
    files: SimFile[];
    commitHistory: string[];
};

const INITIAL_FILES: SimFile[] = [
    { name: 'index.html', status: 'untracked' },
    { name: 'style.css', status: 'untracked' },
    { name: 'script.js', status: 'untracked' },
];

export const useGitSim = () => {
    const [history, setHistory] = useState<TerminalLine[]>([
        { id: 'init', type: 'info', content: 'Welcome to Git Playground! Try initializing a repository.' },
        { id: 'hint', type: 'info', content: 'Hint: Type "git init" to start.' },
    ]);

    const [gitState, setGitState] = useState<GitState>({
        repoInitialized: false,
        files: INITIAL_FILES,
        commitHistory: [],
    });

    const addToHistory = (type: TerminalLine['type'], content: string) => {
        setHistory(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), type, content }]);
    };

    const executeCommand = useCallback((cmd: string) => {
        const trimmedCmd = cmd.trim();
        if (!trimmedCmd) return;

        addToHistory('input', trimmedCmd);

        const parts = trimmedCmd.split(' ');
        const mainCommand = parts[0];
        const subCommand = parts[1];
        const args = parts.slice(2);

        if (mainCommand !== 'git') {
            addToHistory('error', `Command not found: ${mainCommand}. Try 'git <command>'`);
            return;
        }

        switch (subCommand) {
            case 'init':
                if (gitState.repoInitialized) {
                    addToHistory('info', 'Reinitialized existing Git repository');
                } else {
                    setGitState(prev => ({ ...prev, repoInitialized: true }));
                    addToHistory('success', 'Initialized empty Git repository in /project/.git/');
                }
                break;

            case 'status':
                if (!gitState.repoInitialized) {
                    addToHistory('error', 'fatal: not a git repository (or any of the parent directories): .git');
                    return;
                }

                addToHistory('output', 'On branch main');

                const untracked = gitState.files.filter(f => f.status === 'untracked');
                const staged = gitState.files.filter(f => f.status === 'staged');
                const modified = gitState.files.filter(f => f.status === 'modified');

                if (untracked.length === 0 && staged.length === 0 && modified.length === 0) {
                    addToHistory('output', 'nothing to commit, working tree clean');
                } else {
                    if (staged.length > 0) {
                        addToHistory('output', 'Changes to be committed:');
                        staged.forEach(f => addToHistory('success', `  new file:   ${f.name}`));
                    }
                    if (untracked.length > 0) {
                        addToHistory('output', 'Untracked files:');
                        addToHistory('info', '  (use "git add <file>..." to include in what will be committed)');
                        untracked.forEach(f => addToHistory('error', `  ${f.name}`));
                    }
                }
                break;

            case 'add':
                if (!gitState.repoInitialized) {
                    addToHistory('error', 'fatal: not a git repository');
                    return;
                }
                if (!args[0]) {
                    addToHistory('info', 'Nothing specified, nothing added.');
                    return;
                }
                if (args[0] === '.') {
                    setGitState(prev => ({
                        ...prev,
                        files: prev.files.map(f =>
                            f.status === 'untracked' || f.status === 'modified' ? { ...f, status: 'staged' } : f
                        )
                    }));
                    // git add . usually is silent on success in real git, but let's give feedback? 
                    // Real git is silent. Let's keep it silent or minimal? 
                    // Let's rely on status to show changes, but maybe a small hint for beginners?
                    // "Updated index."
                } else {
                    // handle specific file
                    const fileName = args[0];
                    const file = gitState.files.find(f => f.name === fileName);
                    if (!file) {
                        addToHistory('error', `fatal: pathspec '${fileName}' did not match any files`);
                        return;
                    }
                    setGitState(prev => ({
                        ...prev,
                        files: prev.files.map(f => f.name === fileName ? { ...f, status: 'staged' } : f)
                    }));
                }
                break;

            case 'commit':
                if (!gitState.repoInitialized) {
                    addToHistory('error', 'fatal: not a git repository');
                    return;
                }
                // check if -m exists
                const mIndex = parts.indexOf('-m');
                if (mIndex === -1) {
                    addToHistory('error', 'error: terminal is not fully interactive, please use: git commit -m "message"');
                    return;
                }
                const message = parts.slice(mIndex + 1).join(' ').replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');

                const hasStaged = gitState.files.some(f => f.status === 'staged');
                if (!hasStaged) {
                    addToHistory('output', 'On branch main');
                    addToHistory('output', 'nothing to commit, working tree clean');
                    return;
                }

                setGitState(prev => ({
                    ...prev,
                    files: prev.files.map(f => f.status === 'staged' ? { ...f, status: 'committed' } : f),
                    commitHistory: [...prev.commitHistory, message]
                }));

                addToHistory('output', `[main ${Math.random().toString(16).substr(2, 7)}] ${message}`);
                addToHistory('output', ` ${gitState.files.filter(f => f.status === 'staged').length} files changed`);
                break;

            case 'help':
                addToHistory('info', 'Available commands:');
                addToHistory('info', '  git init');
                addToHistory('info', '  git status');
                addToHistory('info', '  git add <file> (or .)');
                addToHistory('info', '  git commit -m "message"');
                break;

            case 'show-files':
                // Helper for debug/visuals
                addToHistory('info', 'Current File States:');
                gitState.files.forEach(f => addToHistory('info', `${f.name}: ${f.status}`));
                break;

            default:
                addToHistory('error', `git: '${subCommand}' is not a git command. See 'git --help'.`);
        }

    }, [gitState]);

    const clearHistory = () => setHistory([]);
    const resetSimulation = () => {
        setGitState({
            repoInitialized: false,
            files: INITIAL_FILES,
            commitHistory: []
        });
        setHistory([
            { id: 'reset', type: 'info', content: 'Simulation reset.' },
            { id: 'init', type: 'info', content: 'Welcome to Git Playground! Try initializing a repository.' },
        ]);
    };

    return {
        history,
        gitState,
        executeCommand,
        clearHistory,
        resetSimulation
    };
};
