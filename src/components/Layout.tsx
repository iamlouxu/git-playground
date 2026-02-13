
import React from 'react';
import type { ReactNode } from 'react';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-deep-void flex flex-col font-sans transition-colors duration-300">
            <header className="bg-holodeck/80 text-starlight p-4 shadow-lg shadow-purple-900/10 sticky top-0 z-50 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="font-bold text-xl tracking-wider font-display bg-gradient-to-r from-cyber-purple to-electric-blue bg-clip-text text-transparent">Git Playground</div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-6 text-sm font-medium items-center">
                        <button onClick={() => document.getElementById('tutorials')?.scrollIntoView({ behavior: 'smooth' })} className="text-ghost hover:text-electric-blue transition-colors cursor-pointer uppercase tracking-wide">Tutorials</button>
                        <button onClick={() => document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' })} className="text-ghost hover:text-neon-pink transition-colors cursor-pointer uppercase tracking-wide">Sandbox</button>
                        <a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer" className="text-ghost hover:text-starlight transition-colors cursor-pointer uppercase tracking-wide">Official Git</a>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-ghost hover:text-starlight transition-colors p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation Overlay */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-holodeck/95 backdrop-blur-xl border-b border-white/5 shadow-xl animate-in slide-in-from-top-2 duration-200">
                        <nav className="flex flex-col p-4 space-y-4 text-center">
                            <button
                                onClick={() => {
                                    document.getElementById('tutorials')?.scrollIntoView({ behavior: 'smooth' });
                                    setIsMenuOpen(false);
                                }}
                                className="text-ghost hover:text-electric-blue transition-colors cursor-pointer uppercase tracking-wide py-2"
                            >
                                Tutorials
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' });
                                    setIsMenuOpen(false);
                                }}
                                className="text-ghost hover:text-neon-pink transition-colors cursor-pointer uppercase tracking-wide py-2"
                            >
                                Sandbox
                            </button>
                            <a
                                href="https://git-scm.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-ghost hover:text-starlight transition-colors cursor-pointer uppercase tracking-wide py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Official Git
                            </a>
                        </nav>
                    </div>
                )}
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
