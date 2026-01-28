
import React, { useEffect } from 'react';
import { X, FileText } from 'lucide-react';

interface FileContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileName: string;
    content: string;
    status: string; // 'untracked' | 'modified' | 'staged' | 'committed'
}

const FileContentModal: React.FC<FileContentModalProps> = ({ isOpen, onClose, fileName, content, status }) => {
    if (!isOpen) return null;

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Determine header color based on status
    const getStatusColor = () => {
        switch (status) {
            case 'untracked': return 'text-system-red border-system-red/30';
            case 'modified': return 'text-yellow-400 border-yellow-500/30';
            case 'staged': return 'text-terminal-green border-terminal-green/30';
            case 'committed': return 'text-electric-blue border-electric-blue/30';
            default: return 'text-ghost border-white/10';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-void/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-2xl rounded-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden transform transition-all scale-100 bg-holodeck">
                {/* Header */}
                <div className={`p-4 border-b flex justify-between items-center bg-white/5 ${getStatusColor()}`}>
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        <span className="font-mono font-bold text-lg">{fileName}</span>
                        <span className="text-xs px-2 py-0.5 rounded border bg-black/30 opacity-80 uppercase ml-2 font-mono">
                            {status}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-ghost hover:text-starlight transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-0 overflow-auto max-h-[60vh] bg-black/40">
                    <div className="flex">
                        {/* Line Numbers */}
                        <div className="bg-black/20 text-ghost/50 text-right pr-3 pl-2 py-4 select-none font-mono text-sm border-r border-white/5">
                            {content.split('\n').map((_, i) => (
                                <div key={i} className="leading-6">{i + 1}</div>
                            ))}
                        </div>

                        {/* Source Code */}
                        <pre className="p-4 font-mono text-sm text-starlight leading-6 bg-transparent w-full overflow-x-auto">
                            <code>{content}</code>
                        </pre>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 bg-holodeck border-t border-white/5 text-xs text-ghost flex justify-between font-mono">
                    <span>{content.length} characters</span>
                    <span>UTF-8</span>
                </div>
            </div>
        </div>
    );
};

export default FileContentModal;
