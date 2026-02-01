
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gitRpgSave from '../assets/git_rpg_save_1769052499382.png';
import gitCollaboration from '../assets/git_collaboration_1769052517500.png';
import gitStagesFlow from '../assets/git_stages_flow_1769052534770.png';
import gitFlowNeon from '../assets/git_flow_neon.png';

import gitBranchSciFi from '../assets/git_branch_sci_fi.png';
import gitMergeSciFi from '../assets/git_merge_sci_fi.png';
import gitCheckoutSciFi from '../assets/git_checkout_sci_fi.png';

gsap.registerPlugin(ScrollTrigger);

interface ExplainerSectionProps {
    title: string;
    description: React.ReactNode;
    image: string;
    imageAlt: string;
    imagePosition?: 'left' | 'right';
    highlightColor?: string;
}

const ExplainerSection: React.FC<ExplainerSectionProps> = ({
    title,
    description,
    image,
    imageAlt,
    imagePosition = 'right',
    highlightColor = 'text-electric-blue'
}) => {
    const glowColorMap: Record<string, string> = {
        'text-electric-blue': 'from-electric-blue',
        'text-neon-pink': 'from-neon-pink',
        'text-cyber-purple': 'from-cyber-purple',
        'text-terminal-green': 'from-terminal-green',
    };

    const gradientStart = glowColorMap[highlightColor] || 'from-cyber-purple';

    return (
        <div className={`explainer-section flex flex-col ${imagePosition === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
            <div className="flex-1">
                <h2 className={`text-3xl font-bold mb-4 ${highlightColor} font-display tracking-wide`}>{title}</h2>
                <div className="text-lg text-starlight leading-relaxed mb-4 space-y-4">
                    {description}
                </div>
            </div>
            <div className="flex-1 flex justify-center">
                <div className="relative group">
                    <div className={`absolute -inset-1 rounded-xl bg-gradient-to-r ${gradientStart} to-purple-600 opacity-30 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200`}></div>
                    <img
                        src={image}
                        alt={imageAlt}
                        className="relative w-full max-w-md rounded-xl shadow-2xl border border-white/10 transform transition-transform duration-500 hover:scale-[1.02]"
                    />
                </div>
            </div>
        </div>
    );
};

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
        <div id="tutorials" ref={containerRef} className="py-16 px-4 max-w-6xl mx-auto space-y-32">

            {/* Intro Section: What is Git? */}
            <ExplainerSection
                title="什麼是 Git？"
                highlightColor="text-cyber-purple"
                imagePosition="right"
                image={gitRpgSave}
                imageAlt="Git RPG Save Point"
                description={
                    <>
                        <p>
                            想像你在玩 RPG 遊戲，Git 就是你的<span className="font-bold text-neon-pink">「存檔功能」</span>。
                        </p>
                        <p className="text-ghost">
                            當你寫程式寫壞了，或者想回到以前比較好的版本，Git 讓你隨時可以「讀取進度」。
                            它不只是備份，還能讓你看到每次存檔之間到底改了什麼。
                        </p>
                    </>
                }
            />

            {/* Section: The 3 Stages of Git */}
            <div className="explainer-section">
                <h2 className="text-3xl font-bold mb-8 text-center text-neon-pink font-display tracking-wide">Git 的三個重要階段</h2>
                <div className="flex justify-center mb-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 rounded-xl bg-neon-pink opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                        <img
                            src={gitStagesFlow}
                            alt="Git 3 Stages Flow"
                            className="relative w-full max-w-4xl rounded-xl shadow-2xl border border-white/10"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                    <div className="glass-card p-6 rounded-xl transform hover:-translate-y-2 transition-transform flex flex-col h-full">
                        <h3 className="text-xl font-bold mb-2 text-starlight font-display">工作目錄</h3>
                        <p className="text-sm text-ghost mb-2 font-mono">Working Directory</p>
                        <p className="text-ghost">
                            你目前正在編輯檔案的地方。就像你正在書桌上寫作業。
                        </p>
                        <div className="mt-auto text-cyber-purple font-bold font-mono pt-4">git add ↓</div>
                    </div>
                    <div className="glass-card p-6 rounded-xl transform hover:-translate-y-2 transition-transform flex flex-col h-full">
                        <h3 className="text-xl font-bold mb-2 text-starlight font-display">暫存區</h3>
                        <p className="text-sm text-ghost mb-2 font-mono">Staging Area</p>
                        <p className="text-ghost">
                            你把寫好的作業放進信封，準備寄出。這是這一次「存檔」要包含的內容。
                        </p>
                        <div className="mt-auto text-cyber-purple font-bold font-mono pt-4">git commit ↓</div>
                    </div>
                    <div className="glass-card p-6 rounded-xl transform hover:-translate-y-2 transition-transform relative overflow-hidden flex flex-col h-full">
                        <div className="absolute top-0 right-0 bg-neon-pink text-white text-xs px-2 py-1 rounded-bl font-bold">Safe!</div>
                        <h3 className="text-xl font-bold mb-2 text-starlight font-display">儲存庫</h3>
                        <p className="text-sm text-ghost mb-2 font-mono">Repository (.git)</p>
                        <p className="text-ghost">
                            信封已經寄出並封存了！你的進度被永久保存下來，隨時可以翻閱。
                        </p>
                    </div>
                    <div className="glass-card p-6 rounded-xl transform hover:-translate-y-2 transition-transform flex flex-col h-full">
                        <h3 className="text-xl font-bold mb-2 text-starlight font-display">檢出 / 還原</h3>
                        <p className="text-sm text-ghost mb-2 font-mono">Checkout</p>
                        <p className="text-ghost">
                            時光倒流！從倉庫裡把舊的檔案「拿出來」，覆蓋掉你寫壞的程式碼。
                        </p>
                        <div className="mt-auto text-cyber-purple font-bold font-mono pt-4">git checkout ↑</div>
                    </div>
                </div>
            </div>

            {/* Feature 1: Parallel Universes (Branching) */}
            <ExplainerSection
                title="多元宇宙理論 (Parallel Universes)"
                highlightColor="text-electric-blue"
                imagePosition="left"
                image={gitBranchSciFi}
                imageAlt="Digital Tree Branching"
                description={
                    <>
                        <p>
                            想要嘗試瘋狂的新功能，但怕把原本正常的程式改壞？
                            <span className="font-bold text-electric-blue ml-1">Git Branch</span> 允許你開啟一個「平行宇宙」。
                        </p>
                        <p className="text-ghost">
                            在這個平行時空裡，你可以隨意實驗、破壞、重組，而原本的「主宇宙 (Main)」完全不會受到影響。
                            就像是奇異博士在觀察1400萬種可能性一樣！
                        </p>
                    </>
                }
            />

            {/* Feature 2: Time Jump (Checkout) */}
            <ExplainerSection
                title="超光速跳躍 (Hyper-Jump)"
                highlightColor="text-neon-pink"
                imagePosition="right"
                image={gitCheckoutSciFi}
                imageAlt="Hyperspace Tunnel"
                description={
                    <>
                        <p>
                            <span className="font-bold text-neon-pink">HEAD 指針</span> 就是你的時空飛船座標。
                        </p>
                        <p className="text-ghost">
                            透過 <code className="bg-white/10 px-1 rounded text-neon-pink">git checkout</code> 指令，你可以瞬間跳躍到過去的任何一個「存檔點 (Commit)」，
                            或是切換到另一個平行宇宙。所有的檔案會瞬間變形成那個時空的樣子。
                        </p>
                    </>
                }
            />

            {/* Feature 3: Timeline Fusion (Merge) */}
            <ExplainerSection
                title="時空歸一 (Timeline Fusion)"
                highlightColor="text-cyber-purple"
                imagePosition="left"
                image={gitMergeSciFi}
                imageAlt="Galaxies Merging"
                description={
                    <>
                        <p>
                            當你在平行宇宙的任務圓滿達成後，是時候發動 <span className="font-bold text-cyber-purple">Git Merge</span> 了。
                        </p>
                        <p className="text-ghost">
                            這個指令會將兩條時間線重新融合。所有在分岔期間獲得的數據、裝備與經驗值，
                            都會被完美整合回主時間軸，形成更強大的完全體！
                        </p>
                    </>
                }
            />

            {/* Collaboration Section */}
            <ExplainerSection
                title="為什麼團隊需要它？"
                highlightColor="text-terminal-green"
                imagePosition="right"
                image={gitCollaboration}
                imageAlt="Git Collaboration"
                description={
                    <>
                        <p>
                            如果你跟朋友一起寫報告，大家傳來傳去 `final_v1.doc`, `final_final_v2.doc`，最後一定會亂掉。
                        </p>
                        <p className="text-ghost">
                            Git 就像是一個超級聰明的雲端中樞，它讓大家可以<span className="font-bold text-terminal-green">同時</span>在同一個專案上工作，
                            而且會自動幫你們把大家寫的東西合併起來，不會互相覆蓋！
                        </p>
                    </>
                }
            />

            {/* Additional Info Sections (Git Flow & Cheat Sheet) */}

            {/* Git Flow Section */}
            <div className="explainer-section">
                <h2 className="text-3xl font-bold mb-8 text-center text-cyber-purple font-display">進階：Git Flow 工作流</h2>
                <div className="flex justify-center mb-12">
                    <div className="relative group">
                        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyber-purple to-blue-600 opacity-20 group-hover:opacity-60 blur transition duration-1000"></div>
                        <img
                            src={gitFlowNeon}
                            alt="Git Flow Visualization"
                            className="relative w-full max-w-4xl rounded-xl shadow-2xl border border-white/10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-card p-6 rounded-xl border-t-4 border-electric-blue">
                        <h3 className="text-xl font-bold mb-2 text-electric-blue font-display">Main</h3>
                        <p className="text-sm text-ghost font-mono">Production Ready</p>
                        <p className="text-starlight mt-3 text-sm">
                            永遠處於穩定狀態，隨時可以發佈給使用者的版本。神聖不可侵犯！
                        </p>
                    </div>
                    <div className="glass-card p-6 rounded-xl border-t-4 border-cyber-purple">
                        <h3 className="text-xl font-bold mb-2 text-cyber-purple font-display">Develop</h3>
                        <p className="text-sm text-ghost font-mono">Integration Branch</p>
                        <p className="text-starlight mt-3 text-sm">
                            開發主幹線。所有新功能做完後都會合併到這裡，準備下一次的發佈。
                        </p>
                    </div>
                    <div className="glass-card p-6 rounded-xl border-t-4 border-neon-pink">
                        <h3 className="text-xl font-bold mb-2 text-neon-pink font-display">Feature</h3>
                        <p className="text-sm text-ghost font-mono">New Stuff</p>
                        <p className="text-starlight mt-3 text-sm">
                            從 Develop 分出來。開發新功能專用，做完後再合併回 Develop。
                        </p>
                    </div>
                    <div className="glass-card p-6 rounded-xl border-t-4 border-system-red">
                        <h3 className="text-xl font-bold mb-2 text-system-red font-display">Hotfix</h3>
                        <p className="text-sm text-ghost font-mono">Emergency!</p>
                        <p className="text-starlight mt-3 text-sm">
                            緊急修復！直接從 Main 分出來修 Bug，修完後同時合回 Main 和 Develop。
                        </p>
                    </div>
                </div>
            </div>

            {/* Common Commands Cheat Sheet */}
            <div className="explainer-section">
                <h2 className="text-3xl font-bold mb-8 text-center text-terminal-green font-display">常用指令小抄</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-holodeck p-8 rounded-2xl shadow-inner terminal-font border border-white/10">
                    {[
                        { cmd: 'git init', desc: '初始化一個新的 Git 倉庫（開始遊戲！）' },
                        { cmd: 'git status', desc: '檢查現在檔案的狀態（看看哪裡不一樣）' },
                        { cmd: 'git add .', desc: '把所有修改過的檔案加入暫存區（準備存檔）' },
                        { cmd: 'git commit -m "msg"', desc: '提交並附上訊息（確認存檔）' },
                        { cmd: 'git checkout <branch>', desc: '切換時空（移動 HEAD 指針）' },
                        { cmd: 'git merge <branch>', desc: '合併分支（時空歸一）' },
                        { cmd: 'git push', desc: '上傳到遠端伺服器（雲端備份）' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col border-b border-white/10 pb-4 last:border-0 last:pb-0">
                            <code className="text-terminal-green text-lg font-bold mb-1">{item.cmd}</code>
                            <span className="text-ghost text-sm">{item.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Usage Prompt */}
            <div className="explainer-section text-center">
                <h2 className="text-3xl font-bold mb-8 text-cyber-purple font-display">準備好試試看了嗎？</h2>
                <p className="text-xl text-ghost mb-8">
                    下面是一個模擬的終端機。別擔心，它不會弄壞你的電腦。<br />
                    試著照著上面的小抄輸入指令，體驗一下控制時空的感覺吧！
                </p>
            </div>
        </div>
    );
};

export default Explainer;
