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
    currentBranch: string;
    branches: string[];
};

export type Quest = {
    id: string;
    title: string;
    description: string;
    check: (state: GitState, lastCommand: string) => boolean;
    completed: boolean;
};
