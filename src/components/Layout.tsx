
import React from 'react';
import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-deep-void flex flex-col font-sans transition-colors duration-300">
            <header className="bg-holodeck/80 text-starlight p-4 shadow-lg shadow-purple-900/10 sticky top-0 z-50 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="font-bold text-xl tracking-wider font-display bg-gradient-to-r from-cyber-purple to-electric-blue bg-clip-text text-transparent">Git Playground</div>
                    <nav className="space-x-6 text-sm font-medium flex items-center">
                        <button onClick={() => document.getElementById('tutorials')?.scrollIntoView({ behavior: 'smooth' })} className="text-ghost hover:text-electric-blue transition-colors cursor-pointer uppercase tracking-wide">Tutorials</button>
                        <button onClick={() => document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' })} className="text-ghost hover:text-neon-pink transition-colors cursor-pointer uppercase tracking-wide">Sandbox</button>
                        <a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer" className="text-ghost hover:text-starlight transition-colors cursor-pointer uppercase tracking-wide">Official Git</a>
                    </nav>
                </div>
            </header>

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-holodeck text-ghost py-8 text-center text-xs border-t border-white/5">
                <p className="font-mono">© {new Date().getFullYear()} Git Playground. System Status: <span className="text-terminal-green">ONLINE</span></p>
            </footer>
        </div>
    );
};

export default Layout;
