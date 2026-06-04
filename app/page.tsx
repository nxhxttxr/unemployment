"use client";

import { useEffect, useRef } from "react";
import { Sora } from "next/font/google";
import Landing from "@/components/custom/landing";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-sora"
});

export default function Page() {
  // Space & Stars background
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Stars
    const numStars = 240;
    const stars: {
      x: number;
      y: number;
      radius: number;
      speed: number;
      alpha: number;
    }[] = []

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.1,
        speed: 0.005 + Math.random() * 0.015,
        alpha: Math.random()
      });
    }

    // Shooting stars
    let shootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speedX: 0,
      speedY: 0,
      active: false
    };

    const spawnShootingStar = () => {
      if (!canvas) return;

      shootingStar.x = Math.random() * canvas.width * 0.7;
      shootingStar.y = Math.random() * canvas.height * 0.3;
      shootingStar.length = 60 + Math.random() * 70;
      shootingStar.speedX = 10 + Math.random() * 8;
      shootingStar.speedY = 4 + Math.random() * 4;
      shootingStar.active = true;
    }

    // Frame Renderer
    const render = () => {
      ctx.fillStyle = "#09090b"; // Deep cosmic canvas base
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Ambient Stars
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.speed = -star.speed;
        }
        ctx.fillStyle = `rgba(226, 232, 240, ${Math.max(0.15, Math.min(0.9, star.alpha))})`;
        ctx.fill();
      });

      // Draw & Track Shooting Star
      if (shootingStar.active) {
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          shootingStar.x - shootingStar.length,
          shootingStar.y - (shootingStar.length * (shootingStar.speedY / shootingStar.speedX))
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(0.3, "rgba(141, 81, 250, 0.4)");
        gradient.addColorStop(1, "rgba(141, 81, 250, 0)");
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2;
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - shootingStar.length,
          shootingStar.y - (shootingStar.length * (shootingStar.speedY / shootingStar.speedX))
        );
        ctx.stroke();

        shootingStar.x += shootingStar.speedX;
        shootingStar.y += shootingStar.speedY;

        if (shootingStar.x > canvas.width + 150 || shootingStar.y > canvas.height + 150) {
          shootingStar.active = false;
        }
      } else {
        if (Math.random() < 0.003) {
          spawnShootingStar();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`${sora.variable} relative w-full overflow-x-hidden selection:text-white selection:bg-brand-purple/30`}>
      <div className="fixed inset-0 -z-9 bg-[#09090b]" />
      <canvas ref={canvasRef} className="fixed inset-0 -z-8 pointer-events-none" />

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[45vh] bg-[radial-gradient(ellipse_at_bottom,rgba(141,81,250,0.15),transparent_65%)] pointer-events-none -z-8" />
    
      <Landing />
    </div>
  );
}