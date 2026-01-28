
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Hero: React.FC = () => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(titleRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
        ).fromTo(subtitleRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
            '-=0.5'
        );
    }, []);

    return (
        <section className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 text-starlight">
            <h1
                ref={titleRef}
                className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyber-purple via-electric-blue to-neon-pink font-display tracking-tight"
            >
                Git Playground
            </h1>
            <p
                ref={subtitleRef}
                className="text-xl md:text-2xl text-ghost max-w-2xl font-body"
            >
                適合所有人的 Git 互動遊樂場。<br />
                不用害怕弄壞東西，這裡就是讓你盡情嘗試的地方！
            </p>
            <div className="mt-12 animate-bounce text-electric-blue/50">
                ↓ 往下滾動開始學習
            </div>
        </section>
    );
};

export default Hero;
