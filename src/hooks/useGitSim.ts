
import { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';

export type TerminalLine = {
    id: string;
    type: 'input' | 'output' | 'error' | 'success' | 'info';
    content: string;
};

export type FileStatus = 'untracked' | 'modified' | 'staged' | 'committed' | 'conflicted';

export type SimFile = {
    name: string;
    status: FileStatus;
    content: string;
};

export type Commit = {
    id: string;
    message: string;
    branch: string; // 'main' | 'feature' | etc.
    parentId: string | null;
    timestamp: number;
};

export type GitState = {
    repoInitialized: boolean;
    files: SimFile[];
    commitHistory: Commit[];
    remoteCommits: Commit[];
};

export type Quest = {
    id: string;
    title: string;
    description: string;
    check: (state: GitState, lastCommand: string) => boolean;
    completed: boolean;
};

const INITIAL_FILES: SimFile[] = [
    { name: 'index.html', status: 'untracked', content: '<h1>Hello World</h1>\n<p>Welcome to my project!</p>' },
    { name: 'style.css', status: 'untracked', content: 'body {\n    background-color: #f0f0f0;\n    font-family: sans-serif;\n}' },
    { name: 'script.js', status: 'untracked', content: 'console.log("Project initialized");' },
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
    },
    {
        id: 'remote-quest',
        title: '任務 7：團隊協作 (Pull)',
        description: '隊友剛推了新程式碼 (Origin is ahead)。執行 git pull 來同步！',
        check: (state, lastCmd) => lastCmd === 'git pull' && state.commitHistory.length === state.remoteCommits.length,
        completed: false
    },
    {
        id: 'conflict-quest',
        title: '任務 8：解決衝突 (Conflict)',
        description: '再次合併 Feature 分支會有衝突。執行 git merge feature，解決衝突後提交。',
        check: (state, _) => state.files.some(f => f.status === 'committed' && f.name === 'style.css') && state.commitHistory.some(c => c.message.includes('Merge')),
        completed: false
    },
    {
        id: 'push-quest',
        title: '任務 9：同步數據 (Push)',
        description: '你的本地進度領先遠端了！執行 git push 將變更同步到遠端。',
        check: (state, _) => state.commitHistory.length > 0 && state.commitHistory.length === state.remoteCommits.length,
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
                        const conflicted = gitState.files.filter(f => f.status === 'conflicted');


                        if (untracked.length === 0 && staged.length === 0 && modified.length === 0 && conflicted.length === 0) {
                            addToHistory('output', 'nothing to commit, working tree clean');
                        } else {
                            if (conflicted.length > 0) {
                                addToHistory('error', 'You have unmerged paths.');
                                addToHistory('error', '  (fix conflicts and run "git commit")');
                                addToHistory('output', 'Unmerged paths:');
                                conflicted.forEach(f => addToHistory('error', `  both modified:   ${f.name}`));
                            }
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
                                f.status === 'untracked' || f.status === 'modified' || f.status === 'conflicted' ? { ...f, status: 'staged' } : f
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
                            const hasConflicts = gitState.files.some(f => f.status === 'conflicted');

                            if (hasConflicts) {
                                addToHistory('error', 'fatal: You have not concluded your merge (MERGE_HEAD exists).');
                                addToHistory('error', '  (fix conflicts and then run "git commit")');
                            } else if (!hasStaged) {
                                addToHistory('output', 'On branch main');
                                addToHistory('output', 'nothing to commit, working tree clean');
                            } else {
                                nextGitState.files = nextGitState.files.map(f => f.status === 'staged' ? { ...f, status: 'committed' } : f);
                                const newCommit: Commit = {
                                    id: Math.random().toString(16).substr(2, 7),
                                    message: message,
                                    branch: 'main',
                                    parentId: nextGitState.commitHistory.length > 0 ? nextGitState.commitHistory[nextGitState.commitHistory.length - 1].id : null,
                                    timestamp: Date.now()
                                };
                                nextGitState.commitHistory = [...nextGitState.commitHistory, newCommit];
                                addToHistory('output', `[main ${newCommit.id}] ${message}`);
                                addToHistory('output', ` ${gitState.files.filter(f => f.status === 'staged').length} files changed`);
                            }
                        }
                    }
                    break;

                case 'merge':
                    if (!gitState.repoInitialized) {
                        addToHistory('error', 'fatal: not a git repository (or any of the parent directories): .git');
                    } else if (args[0] !== 'feature') {
                        addToHistory('error', `merge: ${args[0]} - not something we can merge (try 'feature')`);
                    } else {
                        // CONFLICT SCENARIO CHECK (Scripted for educational purpose)
                        // If we are in a state where a conflict is expected (e.g., both branches touched 'style.css')
                        const currentQuest = QUESTS[currentQuestIndex]; // Get current quest to check for conflict-quest
                        const hasConflict = currentQuest && currentQuest.id === 'conflict-quest'; // We will add this quest ID later

                        if (hasConflict) {
                            addToHistory('info', 'Auto-merging style.css');
                            addToHistory('error', 'CONFLICT (content): Merge conflict in style.css');
                            addToHistory('error', 'Automatic merge failed; fix conflicts and then commit the result.');

                            nextGitState.files = nextGitState.files.map(f =>
                                f.name === 'style.css'
                                    ? {
                                        ...f,
                                        status: 'conflicted',
                                        content: `body {\n<<<<<<< HEAD\n    background-color: #f0f0f0;\n=======\n    background-color: #000000;\n>>>>>>> feature\n    font-family: sans-serif;\n}`
                                    }
                                    : f
                            );
                        } else {
                            // Normal Merge
                            addToHistory('success', 'Updating ' + (gitState.commitHistory[gitState.commitHistory.length - 1]?.id || '0000').substr(0, 7) + '..HEAD');
                            addToHistory('success', 'Fast-forward');

                            // Simulate file changes from feature branch
                            addToHistory('success', ' feature.js | 20 ++++++++++++++++++++');
                            addToHistory('success', ' 1 file changed, 20 insertions(+)');
                            addToHistory('success', ' create mode 100644 feature.js');

                            // Check if feature.js already exists to avoid duplication if running multiple times
                            if (!nextGitState.files.find(f => f.name === 'feature.js')) {
                                nextGitState.files = [...nextGitState.files, { name: 'feature.js', status: 'committed', content: 'console.log("Feature A implemented");' }];
                            }

                            const mergeCommit: Commit = {
                                id: Math.random().toString(16).substr(2, 7),
                                message: "Merge branch 'feature'",
                                branch: 'main',
                                parentId: nextGitState.commitHistory[nextGitState.commitHistory.length - 1].id,
                                timestamp: Date.now()
                            };
                            nextGitState.commitHistory = [...nextGitState.commitHistory, mergeCommit];
                        }
                    }
                    break;

                case 'pull':
                    if (!gitState.repoInitialized) {
                        addToHistory('error', 'fatal: not a git repository (or any of the parent directories): .git');
                    } else {
                        // Simulate pulling from remote
                        if (gitState.remoteCommits.length > gitState.commitHistory.length) {
                            const newCommits = gitState.remoteCommits.slice(gitState.commitHistory.length);
                            nextGitState.commitHistory = [...gitState.commitHistory, ...newCommits];
                            addToHistory('success', `Updating ${gitState.commitHistory[gitState.commitHistory.length - 1]?.id.substr(0, 7)}..${newCommits[newCommits.length - 1].id.substr(0, 7)}`);
                            addToHistory('success', 'Fast-forward');
                            addToHistory('info', `${newCommits.length} commits pulled from origin/main`);
                        } else {
                            addToHistory('info', 'Already up to date.');
                        }
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
            if (quest.check(nextGitState, cmd.trim())) {
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

    useEffect(() => {
        const quest = QUESTS[currentQuestIndex];
        if (quest && quest.id === 'remote-quest') {
            // Simulate remote being ahead
            if (gitState.remoteCommits.length <= gitState.commitHistory.length) {
                const newCommit: Commit = {
                    id: Math.random().toString(16).substr(2, 7),
                    message: "Teammate's update",
                    branch: 'main',
                    parentId: gitState.remoteCommits[gitState.remoteCommits.length - 1]?.id || null,
                    timestamp: Date.now()
                };
                setGitState(prev => ({
                    ...prev,
                    remoteCommits: [...prev.remoteCommits, newCommit]
                }));
                // Notify user
                setHistory(prev => [...prev, { id: Date.now().toString(), type: 'info', content: 'Simulation: Remote repository has new commits!' }]);
            }
        }
    }, [currentQuestIndex, gitState.remoteCommits.length, gitState.commitHistory.length]);

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
