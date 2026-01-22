
import { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';

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
    remoteCommits: string[];
};

export type Quest = {
    id: string;
    title: string;
    description: string;
    check: (state: GitState, lastCommand: string) => boolean;
    completed: boolean;
};

const INITIAL_FILES: SimFile[] = [
    { name: 'index.html', status: 'untracked' },
    { name: 'style.css', status: 'untracked' },
    { name: 'script.js', status: 'untracked' },
];

const QUESTS: Quest[] = [
    {
        id: 'q1',
        title: '任務 1：開始旅程',
        description: '你的專案還沒有 Git。試著初始化它！',
        check: (state, _) => state.repoInitialized,
        completed: false
    },
    {
        id: 'q2',
        title: '任務 2：檢查現況',
        description: '想知道現在有哪些檔案？查看一下狀態。',
        check: (_, cmd) => cmd === 'git status',
        completed: false
    },
    {
        id: 'q3',
        title: '任務 3：準備打包',
        description: '將所有檔案加入暫存區 (Staging Area)。',
        check: (state, _) => state.files.every(f => f.status === 'staged'),
        completed: false
    },
    {
        id: 'q4',
        title: '任務 4：正式存檔',
        description: '提交你的變更，別忘了寫訊息！',
        check: (state, _) => state.commitHistory.length > 0,
        completed: false
    },
    {
        id: 'q5',
        title: '任務 5：分支合併',
        description: '模擬合併一個功能分支 (feature branch)。試試 git merge feature',
        check: (_, cmd) => cmd === 'git merge feature',
        completed: false
    },
    {
        id: 'q6',
        title: '任務 6：推送到雲端',
        description: '將你的變更推送到遠端伺服器！',
        check: (state, _) => state.remoteCommits.length > 0,
        completed: false
    }
];

export const useGitSim = () => {
    // ... existing state ...
    const [history, setHistory] = useState<TerminalLine[]>([
        { id: 'init', type: 'info', content: 'Welcome to Git Playground! Type "help" for valid commands.' },
    ]);

    const [gitState, setGitState] = useState<GitState>({
        repoInitialized: false,
        files: INITIAL_FILES,
        commitHistory: [],
        remoteCommits: [],
    });

    const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
    const [showQuestCelebration, setShowQuestCelebration] = useState(false);

    // Quest Logic
    useEffect(() => {
        if (showQuestCelebration) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            const timer = setTimeout(() => setShowQuestCelebration(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showQuestCelebration]);

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

        let nextGitState = { ...gitState };

        if (mainCommand !== 'git') {
            addToHistory('error', `Command not found: ${mainCommand}. Try 'git <command>'`);
        } else {
            switch (subCommand) {
                case 'init':
                    if (gitState.repoInitialized) {
                        addToHistory('info', 'Reinitialized existing Git repository');
                    } else {
                        nextGitState.repoInitialized = true;
                        addToHistory('success', 'Initialized empty Git repository in /project/.git/');
                    }
                    break;

                case 'status':
                    if (!gitState.repoInitialized) {
                        addToHistory('error', 'fatal: not a git repository');
                    } else {
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
                    }
                    break;

                case 'add':
                    if (!gitState.repoInitialized) {
                        addToHistory('error', 'fatal: not a git repository');
                    } else if (!args[0]) {
                        addToHistory('info', 'Nothing specified, nothing added.');
                    } else {
                        if (args[0] === '.') {
                            nextGitState.files = nextGitState.files.map(f =>
                                f.status === 'untracked' || f.status === 'modified' ? { ...f, status: 'staged' } : f
                            );
                        } else {
                            const fileName = args[0];
                            const file = nextGitState.files.find(f => f.name === fileName);
                            if (!file) {
                                addToHistory('error', `fatal: pathspec '${fileName}' did not match any files`);
                            } else {
                                nextGitState.files = nextGitState.files.map(f => f.name === fileName ? { ...f, status: 'staged' } : f);
                            }
                        }
                    }
                    break;

                case 'commit':
                    if (!gitState.repoInitialized) {
                        addToHistory('error', 'fatal: not a git repository');
                    } else {
                        const mIndex = parts.indexOf('-m');
                        if (mIndex === -1) {
                            addToHistory('error', 'error: please use: git commit -m "message"');
                        } else {
                            const message = parts.slice(mIndex + 1).join(' ').replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
                            const hasStaged = gitState.files.some(f => f.status === 'staged');
                            if (!hasStaged) {
                                addToHistory('output', 'On branch main');
                                addToHistory('output', 'nothing to commit, working tree clean');
                            } else {
                                nextGitState.files = nextGitState.files.map(f => f.status === 'staged' ? { ...f, status: 'committed' } : f);
                                nextGitState.commitHistory = [...nextGitState.commitHistory, message];
                                addToHistory('output', `[main ${Math.random().toString(16).substr(2, 7)}] ${message}`);
                                addToHistory('output', ` ${gitState.files.filter(f => f.status === 'staged').length} files changed`);
                            }
                        }
                    }
                    break;

                case 'merge':
                    if (!gitState.repoInitialized) {
                        addToHistory('error', 'fatal: not a git repository');
                    } else if (args[0] !== 'feature') {
                        addToHistory('error', `merge: ${args[0]} - not something we can merge (try 'feature')`);
                    } else {
                        addToHistory('output', 'Updating 34ac2..98fa2');
                        addToHistory('output', 'Fast-forward');
                        addToHistory('success', ' feature.js | 20 ++++++++++++++++++++');
                        addToHistory('success', ' 1 file changed, 20 insertions(+)');
                        addToHistory('success', ' create mode 100644 feature.js');
                        nextGitState.files = [...nextGitState.files, { name: 'feature.js', status: 'committed' }];
                        nextGitState.commitHistory = [...nextGitState.commitHistory, "Merge branch 'feature'"];
                    }
                    break;

                case 'push':
                    if (!gitState.repoInitialized) {
                        addToHistory('error', 'fatal: not a git repository');
                    } else {
                        if (gitState.commitHistory.length === 0) {
                            addToHistory('info', 'Everything up-to-date');
                        } else {
                            addToHistory('output', 'Enumerating objects: 5, done.');
                            addToHistory('output', 'Counting objects: 100% (5/5), done.');
                            addToHistory('output', 'Writing objects: 100% (3/3), 280 bytes | 280.00 KiB/s, done.');
                            addToHistory('output', 'Total 3 (delta 0), reused 0 (delta 0)');
                            addToHistory('success', 'To https://github.com/user/project.git');
                            addToHistory('success', '   98fa2..34ac2  main -> main');
                            nextGitState.remoteCommits = [...gitState.commitHistory];
                        }
                    }
                    break;

                case 'help':
                    addToHistory('info', 'Available commands:');
                    addToHistory('info', '  git init');
                    addToHistory('info', '  git status');
                    addToHistory('info', '  git add <file> (or .)');
                    addToHistory('info', '  git commit -m "message"');
                    addToHistory('info', '  git merge <branch>');
                    addToHistory('info', '  git push');
                    break;
            }
        }

        setGitState(nextGitState);

        // Quest Check - Use nextGitState!
        if (currentQuestIndex < QUESTS.length) {
            const quest = QUESTS[currentQuestIndex];
            if (quest.check(nextGitState, `${mainCommand} ${subCommand}`)) {
                setShowQuestCelebration(true);
                addToHistory('success', `🎉 任務完成：${quest.title}`);
                if (currentQuestIndex < QUESTS.length - 1) {
                    addToHistory('info', `➡️ 下一關：${QUESTS[currentQuestIndex + 1].title} - ${QUESTS[currentQuestIndex + 1].description}`);
                } else {
                    addToHistory('success', '🏆 恭喜！你已經完成了所有基礎訓練！');
                }
                setCurrentQuestIndex(prev => prev + 1);
            }
        }
    }, [gitState, currentQuestIndex]);

    const clearHistory = () => setHistory([]);
    const resetSimulation = () => {
        setGitState({
            repoInitialized: false,
            files: INITIAL_FILES,
            commitHistory: [],
            remoteCommits: []
        });
        setHistory([
            { id: 'reset', type: 'info', content: 'Simulation reset.' },
            { id: 'init', type: 'info', content: 'Welcome to Git Playground! Type "git init" to start.' },
        ]);
        setCurrentQuestIndex(0);
    };

    return {
        history,
        gitState,
        executeCommand,
        clearHistory,
        resetSimulation,
        currentQuest: QUESTS[currentQuestIndex],
        completedAllQuests: currentQuestIndex >= QUESTS.length
    };
};
