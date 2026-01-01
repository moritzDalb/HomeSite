import React, { useEffect, useRef } from 'react';
import './ChristmasEffect.css';

const isReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const createFlake = (w: number) => ({
    x: Math.random() * w,
    y: -10 - Math.random() * 200,
    r: 1 + Math.random() * 3,
    vy: 0.3 + Math.random() * 0.6,
    vx: -0.3 + Math.random() * 0.6,
    o: 0.6 + Math.random() * 0.4,
});

const ChristmasEffect: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const flakesRef = useRef<any[]>([]);

    useEffect(() => {
        if (isReducedMotion) return;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
        window.addEventListener('resize', onResize);

        const max = window.innerWidth < 600 ? 30 : 80;
        const flakes = flakesRef.current;
        for (let i = 0; i < max; i++) flakes.push(createFlake(w));

        const render = () => {
            ctx.clearRect(0,0,w,h);
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            for (let f of flakes) {
                f.x += f.vx;
                f.y += f.vy;
                if (f.y > h + 20) { f.y = -10; f.x = Math.random() * w; }
                ctx.beginPath();
                ctx.globalAlpha = f.o;
                ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
                ctx.fill();
            }
            rafRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', onResize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 55 }} aria-hidden />
    );
};

export default ChristmasEffect;

