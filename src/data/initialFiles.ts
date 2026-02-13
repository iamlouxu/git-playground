import type { SimFile } from '../types/git';

export const INITIAL_FILES: SimFile[] = [
    { name: 'index.html', status: 'untracked', content: '<h1>Hello World</h1>\n<p>Welcome to my project!</p>' },
    { name: 'style.css', status: 'untracked', content: 'body {\n    background-color: #f0f0f0;\n    font-family: sans-serif;\n}' },
    { name: 'script.js', status: 'untracked', content: 'console.log("Project initialized");' },
];
