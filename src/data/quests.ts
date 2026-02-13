import type { Quest } from '../types/git';

export const QUESTS: Quest[] = [
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
        check: (state, _) => !state.files.some(f => f.status === 'conflicted') && state.files.find(f => f.name === 'style.css')?.status === 'committed',
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
