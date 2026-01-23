
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gitRpgSave from '../assets/git_rpg_save_1769052499382.png';
import gitCollaboration from '../assets/git_collaboration_1769052517500.png';
import gitStagesFlow from '../assets/git_stages_flow_1769052534770.png';
import gitFlowNeon from '../assets/git_flow_neon.png';

gsap.registerPlugin(ScrollTrigger);

const Explainer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sections = containerRef.current?.querySelectorAll('.explainer-section');

        sections?.forEach((section) => {
            gsap.fromTo(section,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }, []);

    return (
        <div id="tutorials" ref={containerRef} className="py-16 px-4 max-w-6xl mx-auto space-y-24">
            {/* Section 1: What is Git? */}
            <div className="explainer-section flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-4 text-orange-500">什麼是 Git？</h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        想像你在玩 RPG 遊戲，Git 就是你的<span className="font-bold text-orange-600">「存檔功能」</span>。
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        當你寫程式寫壞了，或者想回到以前比較好的版本，Git 讓你隨時可以「讀取進度」。
                        它不只是備份，還能讓你看到每次存檔之間到底改了什麼。
                    </p>
                </div>
                <div className="flex-1 flex justify-center">
                    <img
                        src={gitRpgSave}
                        alt="Git RPG Save Point"
                        className="w-full max-w-sm rounded-xl shadow-2xl border-4 border-orange-500/30 hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </div>

            {/* Section 2: Why Collaboration? */}
            <div className="explainer-section flex flex-col md:flex-row-reverse items-center gap-12">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-4 text-blue-500">為什麼團隊需要它？</h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        如果你跟朋友一起寫報告，大家傳來傳去 `final_v1.doc`, `final_final_v2.doc`，最後一定會亂掉。
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Git 就像是一個超級聰明的雲端硬碟，它讓大家可以<span className="font-bold text-blue-600">同時</span>在同一個檔案上工作，
                        而且會自動幫你們把大家寫的東西合併起來，不會互相覆蓋！
                    </p>
                </div>
                <div className="flex-1 flex justify-center">
                    <img
                        src={gitCollaboration}
                        alt="Git Collaboration"
                        className="w-full max-w-sm rounded-xl shadow-2xl border-4 border-blue-500/30 hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </div>

            {/* New Section: The 3 Stages of Git */}
            <div className="explainer-section">
                <h2 className="text-3xl font-bold mb-8 text-center text-purple-600">Git 的三個重要階段</h2>
                <div className="flex justify-center mb-8">
                    <img
                        src={gitStagesFlow}
                        alt="Git 3 Stages Flow"
                        className="w-full max-w-4xl rounded-xl shadow-2xl border border-gray-700"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-100 transform hover:-translate-y-2 transition-transform">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">工作目錄</h3>
                        <p className="text-sm text-gray-500 mb-2 font-mono">Working Directory</p>
                        <p className="text-gray-600">
                            你目前正在編輯檔案的地方。就像你正在書桌上寫作業。
                        </p>
                        <div className="mt-4 text-purple-600 font-bold">git add ↓</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-100 transform hover:-translate-y-2 transition-transform">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">暫存區</h3>
                        <p className="text-sm text-gray-500 mb-2 font-mono">Staging Area</p>
                        <p className="text-gray-600">
                            你把寫好的作業放進信封，準備寄出。這是這一次「存檔」要包含的內容。
                        </p>
                        <div className="mt-4 text-purple-600 font-bold">git commit ↓</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-500 transform hover:-translate-y-2 transition-transform relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-2 py-1 rounded-bl">Safe!</div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800">儲存庫</h3>
                        <p className="text-sm text-gray-500 mb-2 font-mono">Repository (.git)</p>
                        <p className="text-gray-600">
                            信封已經寄出並封存了！你的進度被永久保存下來，隨時可以翻閱。
                        </p>
                    </div>
                </div>
            </div>

            {/* New Section: Merge and Push */}
            <div className="explainer-section grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-pink-500">多重宇宙的交匯 (Git Merge)</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        分支 (Branch) 就像是平行時空。你在 <code className="bg-gray-100 px-2 py-1 rounded">feature</code> 分支開發新功能，這時候 <code className="bg-gray-100 px-2 py-1 rounded">main</code> 分支還是原來的樣子。<br /><br />
                        當功能開發完成，你需要用 <span className="font-bold text-pink-600">git merge</span> 把這兩個時空合併起來！
                    </p>
                </div>
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-sky-500">傳送到雲端 (Git Push)</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        你的電腦再安全，也可能壞掉。<span className="font-bold text-sky-600">Git Push</span> 就像是把你的遊戲存檔上傳到雲端伺服器 (如 GitHub)。<br /><br />
                        這樣就算電腦爆炸，你的程式碼還活著！
                    </p>
                </div>
            </div>

            {/* New Section: Git Flow */}
            <div className="explainer-section">
                <h2 className="text-3xl font-bold mb-8 text-center text-cyan-500">進階：Git Flow 工作流</h2>
                <div className="flex justify-center mb-12">
                    <img
                        src={gitFlowNeon}
                        alt="Git Flow Visualization"
                        className="w-full max-w-4xl rounded-xl shadow-2xl border border-gray-700"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-800/50 p-6 rounded-xl border-t-4 border-blue-500 hover:bg-gray-800 transition-colors">
                        <h3 className="text-xl font-bold mb-2 text-blue-400">Main</h3>
                        <p className="text-sm text-gray-400">Production Ready</p>
                        <p className="text-gray-300 mt-3 text-sm">
                            永遠處於穩定狀態，隨時可以發佈給使用者的版本。神聖不可侵犯！
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-xl border-t-4 border-purple-500 hover:bg-gray-800 transition-colors">
                        <h3 className="text-xl font-bold mb-2 text-purple-400">Develop</h3>
                        <p className="text-sm text-gray-400">Integration Branch</p>
                        <p className="text-gray-300 mt-3 text-sm">
                            開發主幹線。所有新功能做完後都會合併到這裡，準備下一次的發佈。
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-xl border-t-4 border-pink-500 hover:bg-gray-800 transition-colors">
                        <h3 className="text-xl font-bold mb-2 text-pink-400">Feature</h3>
                        <p className="text-sm text-gray-400">New Stuff</p>
                        <p className="text-gray-300 mt-3 text-sm">
                            從 Develop 分出來。開發新功能專用，做完後再合併回 Develop。
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-xl border-t-4 border-red-500 hover:bg-gray-800 transition-colors">
                        <h3 className="text-xl font-bold mb-2 text-red-500">Hotfix</h3>
                        <p className="text-sm text-gray-400">Emergency!</p>
                        <p className="text-gray-300 mt-3 text-sm">
                            緊急修復！直接從 Main 分出來修 Bug，修完後同時合回 Main 和 Develop。
                        </p>
                    </div>
                </div>
            </div>

            {/* New Section: Common Commands Cheat Sheet */}
            <div className="explainer-section">
                <h2 className="text-3xl font-bold mb-8 text-center text-green-600">常用指令小抄</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900 p-8 rounded-2xl shadow-inner terminal-font">
                    {[
                        { cmd: 'git init', desc: '初始化一個新的 Git 倉庫（開始遊戲！）' },
                        { cmd: 'git status', desc: '檢查現在檔案的狀態（看看哪裡不一樣）' },
                        { cmd: 'git add .', desc: '把所有修改過的檔案加入暫存區（準備存檔）' },
                        { cmd: 'git commit -m "msg"', desc: '提交並附上訊息（確認存檔）' },
                        { cmd: 'git merge <branch>', desc: '合併分支（把平行時空接回來）' },
                        { cmd: 'git push', desc: '上傳到遠端伺服器（雲端備份）' },
                        { cmd: 'git log', desc: '查看過去的提交紀錄（讀取存檔紀錄）' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                            <code className="text-green-400 text-lg font-bold mb-1">{item.cmd}</code>
                            <span className="text-gray-400 text-sm">{item.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Usage Prompt */}
            <div className="explainer-section text-center">
                <h2 className="text-3xl font-bold mb-8 text-purple-600">準備好試試看了嗎？</h2>
                <p className="text-xl text-gray-600 mb-8">
                    下面是一個模擬的終端機。別擔心，它不會弄壞你的電腦。<br />
                    試著照著上面的小抄輸入指令，看看會發生什麼事！
                </p>
            </div>
        </div>
    );
};

export default Explainer;
