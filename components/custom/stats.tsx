"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiCoffee } from "react-icons/fi";
import { FaCode, FaRegClock } from "react-icons/fa6";
import { IoDocumentTextOutline } from "react-icons/io5";

interface StatItemProps {
  title: string;
  targetValue: number;
  suffix: string;
  isVisible: boolean;
  icon: React.ReactNode;
}

const CountUpItem = ({ title, targetValue, suffix, isVisible, icon }: StatItemProps) => {
  const [count, setCount] = useState<number>(0);
  const hasAnimated = useRef<boolean>(false);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    let start = 0;
    const duration = 1500;
    const framerate = 1000 / 60;
    const totalFrames = Math.round(duration / framerate);

    const counterInterval = setInterval(() => {
      start++;
      const progress = start / totalFrames;
      const currentProgressValue = Math.round(targetValue * (progress * (2 - progress)));

      if (start >= totalFrames) {
        setCount(targetValue);
        clearInterval(counterInterval);
      } else {
        setCount(currentProgressValue);
      }
    }, framerate);

    return () => clearInterval(counterInterval);
  }, [isVisible, targetValue]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="group relative p-5 flex-1 min-w-[240px] bg-[#121216]/40 backdrop-blur-md border border-white/[0.04] rounded-xl text-left overflow-hidden" ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Spotlight */}
      <div className="group-hover:opacity-100 absolute inset-0 -z-7 pointer-events-none opacity-0 transition-opacity duration-300" style={{ background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(141, 81, 250, 0.12), transparent 80%)` }} />
    
      {/* Spotlight border */}
      <div className="group-hover:opacity-100 absolute inset-0 -z-7 pointer-events-none opacity-0 transition-opacity duration-300" style={{ background: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, rgba(141, 81, 250, 0.25), transparent 60%)`, maskImage: "linear-gradient(black, black) exclude, linear-gradient(black, black)", WebkitMaskImage: "linear-gradient(white, white) content-box, linear-gradient(white, white)", WebkitMaskComposite: "xor", maskComposite: "exclude", padding: "1px" }} />

      <div className="group-hover:text-[#8D51FA]/40 group-hover:scale-110 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-700/50 transition-all duration-300">
        {icon}
      </div>

      <div className="max-w-[80%]">
        <h3 className="uppercase tracking-wider font-semibold text-zinc-500 text-xs pointer-events-none">{title}</h3>
        <p className="mt-2 tracking-tight font-light text-white text-2xl pointer-events-none" style={{ fontFamily: "var(--font-sora), sans-serif" }}>
          {count.toLocaleString()} <span className="lowercase font-normal text-zinc-500 text-sm">{suffix}</span>
        </p>
      </div>
    </div>
  );
};

export default function Stats() {
  const [isComponentVisible, setIsComponentVisible] = useState<boolean>(false);
  const [statsData, setStatsData] = useState({
    codeWritten: 0,
    caffeineIngested: 0,
    jobsApplied: 0,
    minutesSpent: 0
  });
  const containerRef = useRef<HTMLElement | null>(null); 

  useEffect(() => {
    const fetchStats = async () => {
      const CACHE_KEY = "portfolio_stats_cache";
      const CACHE_TIME_KEY = "portfolio_stats_cache_time";
      const THIRTY_MINUTES = 30 * 60 * 1000;

      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
        const now = Date.now();

        if (cachedData && cachedTime && now - Number(cachedTime) < THIRTY_MINUTES) {
          setStatsData(JSON.parse(cachedData));
          return;
        }

        const response = await fetch("/data/stats.json");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();

        setStatsData(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, now.toString());
      } catch (error) {
        console.error("Error reading stats flat file");
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsComponentVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`relative mb-12 px-6 mx-auto max-w-2xl z-9 transition-all ease-out duration-1000 ${ isComponentVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]" }`} ref={containerRef}>
      <div className="flex flex-wrap gap-4">
        <CountUpItem title="Code written" targetValue={statsData.codeWritten} suffix="lines" isVisible={isComponentVisible} icon={<FaCode className="w-8 h-8 stroke-[1.2]"/>} />
        <CountUpItem title="Caffeine ingested" targetValue={statsData.caffeineIngested} suffix="mg" isVisible={isComponentVisible} icon={<FiCoffee className="w-8 h-8 stroke-[1.2]"/>} />
        <CountUpItem title="Jobs applied" targetValue={statsData.jobsApplied} suffix="applications" isVisible={isComponentVisible} icon={<IoDocumentTextOutline className="w-8 h-8 stroke-[1.2]"/>} />
        <CountUpItem title="Time spent on shows" targetValue={statsData.minutesSpent} suffix="minutes" isVisible={isComponentVisible} icon={<FaRegClock className="w-8 h-8 stroke-[1.2]"/>} />
      </div>
    </section>
  );
}