
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
            case 'untracked': return 'text-red-400 border-red-500/50';
            case 'modified': return 'text-yellow-400 border-yellow-500/50';
            case 'staged': return 'text-green-400 border-green-500/50';
            case 'committed': return 'text-blue-400 border-blue-500/50';
            default: return 'text-gray-400 border-gray-500/50';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 w-full max-w-2xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden transform transition-all scale-100">
                {/* Header */}
                <div className={`p-4 border-b flex justify-between items-center bg-gray-800/50 ${getStatusColor()}`}>
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        <span className="font-mono font-bold text-lg">{fileName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full border bg-black/30 opacity-80 uppercase ml-2">
                            {status}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-0 overflow-auto max-h-[60vh] bg-[#1e1e1e]">
                    <div className="flex">
                        {/* Line Numbers */}
                        <div className="bg-[#2d2d2d] text-gray-500 text-right pr-3 pl-2 py-4 select-none font-mono text-sm border-r border-gray-700">
                            {content.split('\n').map((_, i) => (
                                <div key={i} className="leading-6">{i + 1}</div>
                            ))}
                        </div>

                        {/* Source Code */}
                        <pre className="p-4 font-mono text-sm text-gray-300 leading-6 bg-transparent w-full overflow-x-auto">
                            <code>{content}</code>
                        </pre>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 flex justify-between">
                    <span>{content.length} characters</span>
                    <span>UTF-8</span>
                </div>
            </div>
        </div>
    );
};

export default FileContentModal;
