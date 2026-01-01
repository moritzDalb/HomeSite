import React, { useEffect, useRef } from 'react';
import './ParticleEffect.css';

type Shape = 'circle' | 'confetti' | 'heart' | 'leaf' | 'star' | 'spark';

interface ParticleConfig {
    count?: number;
    colors?: string[];
    sizeMin?: number;
    sizeMax?: number;
    speedMin?: number;
    speedMax?: number;
    direction?: 'down' | 'up' | 'random';
    shape?: Shape;
}

const isReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ParticleEffect: React.FC<ParticleConfig> = ({
    count = 40,
    colors = ['#ffffff'],
    sizeMin = 4,
    sizeMax = 12,
    speedMin = 0.3,
    speedMax = 1.2,
    direction = 'down',
    shape = 'circle',
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const particlesRef = useRef<any[]>([]);

    useEffect(() => {
        if (isReducedMotion) return;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
        window.addEventListener('resize', onResize);

        const rand = (a: number, b: number) => a + Math.random() * (b - a);

        const create = () => ({
            x: Math.random() * w,
            y: direction === 'up' ? h + Math.random() * 200 : -Math.random() * 200,
            size: rand(sizeMin, sizeMax),
            vy: rand(speedMin, speedMax) * (direction === 'up' ? -1 : 1),
            vx: -0.5 + Math.random() * 1,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: -0.02 + Math.random() * 0.04,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * Math.PI * 2,
        });

        const particles = particlesRef.current;
        particles.length = 0;
        for (let i = 0; i < count; i++) particles.push(create());

        const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(size / 24, size / 24);
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.bezierCurveTo(-12, -28, -40, -6, 0, 22);
            ctx.bezierCurveTo(40, -6, 12, -28, 0, -8);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
        };

        const drawLeaf = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.sin(x + y));
            ctx.beginPath();
            ctx.ellipse(0, 0, size * 0.6, size, 0, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
        };

        const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * r, -Math.sin((18 + i * 72) / 180 * Math.PI) * r);
                ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (r / 2), -Math.sin((54 + i * 72) / 180 * Math.PI) * (r / 2));
            }
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
        };

        const render = () => {
            ctx.clearRect(0, 0, w, h);
            for (let p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.rot += p.rotSpeed;
                // wrapping
                if (p.y > h + 50) { p.y = -50; p.x = Math.random() * w; }
                if (p.y < -50) { p.y = h + 50; p.x = Math.random() * w; }
                if (p.x > w + 50) p.x = -50;
                if (p.x < -50) p.x = w + 50;

                ctx.save();
                if (shape === 'circle') {
                    ctx.beginPath();
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = 0.9;
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                } else if (shape === 'confetti') {
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rot);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                } else if (shape === 'heart') {
                    drawHeart(ctx, p.x, p.y, p.size, p.color);
                } else if (shape === 'leaf') {
                    drawLeaf(ctx, p.x, p.y, p.size, p.color);
                } else if (shape === 'star') {
                    drawStar(ctx, p.x, p.y, p.size, p.color);
                } else if (shape === 'spark') {
                    ctx.beginPath();
                    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                    g.addColorStop(0, p.color);
                    g.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = g as any;
                    ctx.fillRect(p.x - p.size * 3, p.y - p.size * 3, p.size * 6, p.size * 6);
                }
                ctx.restore();
            }
            rafRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', onResize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [count, colors.join(','), sizeMin, sizeMax, speedMin, speedMax, direction, shape]);

    if (isReducedMotion) return null;

    return <canvas ref={canvasRef} className="particle-canvas" aria-hidden />;
};

export default ParticleEffect;

