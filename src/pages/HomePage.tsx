import AppLayout from '../components/layout/AppLayout';
import HeroSection from '../components/sections/HeroSection';
import GitConceptsSection from '../components/sections/GitConceptsSection';
import GitTerminal from '../components/features/GitTerminal';

function HomePage() {
    return (
        <AppLayout>
            <HeroSection />
            <GitConceptsSection />
            <section id="sandbox" className="py-16 px-4 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center mb-8">
                    <h2 className="text-3xl font-bold text-cyber-purple mb-2 font-display">動手試試看</h2>
                    <p className="text-ghost">在下方的模擬終端機輸入指令，開始你的 Git 之旅。</p>
                </div>
                <GitTerminal />
            </section>
        </AppLayout>
    );
}

export default HomePage;
