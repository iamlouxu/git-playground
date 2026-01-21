
import React from 'react';
import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50 opacity-90 backdrop-blur">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="font-bold text-xl tracking-wider">Git Playground</div>
                    <nav className="space-x-4 text-sm font-medium">
                        <button onClick={() => document.getElementById('tutorials')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-white transition-colors">Tutorials</button>
                        <button onClick={() => document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-300 hover:text-white transition-colors">Sandbox</button>
                        <a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Official Git</a>
                    </nav>
                </div>
            </header>

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm">
                <p>© {new Date().getFullYear()} Git Playground. Built for educational purposes.</p>
            </footer>
        </div>
    );
};

export default Layout;
