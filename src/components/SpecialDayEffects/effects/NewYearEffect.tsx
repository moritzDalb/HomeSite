import React, { useEffect, useRef } from 'react';
import './NewYearEffect.css';

const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Rocket = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    exploded?: boolean;
};

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    decay: number;
    color: string;
    size: number;
};

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const palette = [
    '#ffcc00', // gold
    '#ff4f4f', // red
    '#4fffa3', // mint
    '#66b3ff', // blue
    '#c166ff', // purple
    '#ffffff', // white
];

const NewYearEffect: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const rocketsRef = useRef<Rocket[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const lastSpawnRef = useRef(0);

    useEffect(() => {
        if (prefersReducedMotion) return;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.scale(dpr, dpr);

        const onResize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            const dpr2 = window.devicePixelRatio || 1;
            canvas.width = Math.round(w * dpr2);
            canvas.height = Math.round(h * dpr2);
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr2, 0, 0, dpr2, 0, 0);
        };
        window.addEventListener('resize', onResize);

        const spawnRocket = () => {
            const x = random(w * 0.1, w * 0.9);
            const y = h + 10;
            const vx = random(-0.6, 0.6);
            const vy = random(-7.5, -10.5);
            const color = palette[Math.floor(Math.random() * palette.length)];
            rocketsRef.current.push({ x, y, vx, vy, life: random(60, 120), color });
        };

        const explode = (r: Rocket) => {
            const count = Math.floor(random(30, 80));
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = random(1.5, 6.5);
                const vx = Math.cos(angle) * speed + (Math.random() - 0.5) * 0.6;
                const vy = Math.sin(angle) * speed + (Math.random() - 0.5) * 0.6;
                const life = random(60, 140);
                const decay = random(0.95, 0.99);
                particlesRef.current.push({ x: r.x, y: r.y, vx, vy, life, decay, color: r.color, size: random(1.2, 3.6) });
            }
        };

        const update = () => {
            // spawn rate based on width: more rockets on big screens
            const now = performance.now();
            const spawnInterval = w < 600 ? 800 : 450; // ms
            if (now - lastSpawnRef.current > spawnInterval) {
                spawnRocket();
                lastSpawnRef.current = now;
            }

            // update rockets
            for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
                const r = rocketsRef.current[i];
                r.x += r.vx;
                r.y += r.vy;
                r.vy += 0.12; // gravity
                r.life -= 1;
                // small trail particle
                particlesRef.current.push({ x: r.x, y: r.y, vx: (Math.random() - 0.5) * 0.3, vy: Math.random() * 0.3, life: 12, decay: 0.92, color: r.color, size: 1 });
                // explode when life up or vy positive (apex)
                if (r.life <= 0 || r.vy > -1) {
                    explode(r);
                    rocketsRef.current.splice(i, 1);
                }
            }

            // update particles
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.06; // gravity
                p.vx *= 0.999;
                p.vy *= 0.999;
                p.life -= 1;
                p.vx *= p.decay;
                p.vy *= p.decay;
                if (p.life <= 0) particlesRef.current.splice(i, 1);
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            // subtle background glow
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.fillRect(0, 0, w, h);

            // draw particles
            for (const p of particlesRef.current) {
                const alpha = Math.max(0, Math.min(1, p.life / 120));
                ctx.beginPath();
                ctx.fillStyle = p.color;
                ctx.globalAlpha = alpha;
                // additive blend for nice glow
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1;
            }

            // draw rockets
            for (const r of rocketsRef.current) {
                ctx.beginPath();
                ctx.fillStyle = r.color;
                ctx.globalAlpha = 1;
                ctx.fillRect(r.x - 1.5, r.y - 6, 3, 6);
                // small glow
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = r.color;
                ctx.fillRect(r.x - 6, r.y - 6, 12, 4);
                ctx.globalCompositeOperation = 'source-over';
            }
        };

        const loop = () => {
            update();
            draw();
            rafRef.current = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            window.removeEventListener('resize', onResize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 55 }} aria-hidden />;
};

export default NewYearEffect;

