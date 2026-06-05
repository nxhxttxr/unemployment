"use client";

import React, { useState, useEffect } from "react";
import { CiGlobe, CiMail } from "react-icons/ci";
import { FaLinkedin, FaGithub } from "react-icons/fa6";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const UNEMPLOYMENT_START_DATE = new Date("2026-06-01T00:00:00");

export default function Landing() {
  const [timeElapsed, setTimeElapsed] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date() - +UNEMPLOYMENT_START_DATE;

      if (difference <= 0) {
        setTimeElapsed({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeElapsed({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen px-4 flex flex-col items-center justify-center text-center select-none antialiased">
      <h1 className="mb-8 uppercase tracking-[0.25em] font-bold text-xs sm:text-sm text-brand-dark-purple">Time in unemployment</h1>

      <div className="w-full max-w-2xl px-6 py-10 sm:py-12 bg-[#121216]/60 border border-white/[0.04] backdrop-blur-xl rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          {Object.entries(timeElapsed).map(([unit, value], index) => (
            <React.Fragment key={unit}>
              <div className="min-w-[55px] sm:min-w-[85px] flex flex-col items-center">
                <span className="tracking-light font-light text-white text-4xl sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-sora), sans-serif", textShadow: "0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(141,81,250,0.3)" }}>{String(value).padStart(2, "0")}</span>

                <span className="mt-3 uppercase text-[9px] sm:text-[11px] font-semibold tracking-widest text-[#BB99FF]">{unit === "minutes" ? "mins" : unit === "seconds" ? "secs" : unit}</span>
              </div>

              {index < 3 && (
                <span className="mb-6 font-light self-center text-[#3f3f46]" style={{ fontFamily: "var(--font-sora), sans-serif" }}>:</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <nav className="mt-12 flex items-center gap-8 sm:gap-12">
        <a className="group flex flex-col items-center gap-3 transition-transform duration-200 active:scale-95" rel="noopener noreferrer" href="https://marioskaradimitris.dev/">
          <div className="group-hover:border-[#BB99FF]/40 group-hover:text-[#BB99FF] group-hover:shadow-[0_0_15px_rgba(141,81,250,0.2)] w-12 h-12 flex items-center justify-center border border-white/[0.05] text-white/80 rounded-full bg-[#16161c] transition-all duration-300">
            <CiGlobe className="group-hover:scale-105 w-5 h-5 transition-transform" />
          </div>

          <span className="group-hover:text-white text-xs font-medium text-slate-400 transition-colors duration-200">Website</span>
        </a>

        <a className="group flex flex-col items-center gap-3 transition-transform duration-200 active:scale-95" rel="noopener noreferrer" href="https://linkedin.com/in/marios-kayrdm/" target="_blank">
          <div className="group-hover:border-[#BB99FF]/40 group-hover:text-[#BB99FF] group-hover:shadow-[0_0_15px_rgba(141,81,250,0.2)] w-12 h-12 flex items-center justify-center border border-white/[0.05] text-white/80 rounded-full bg-[#16161c] transition-all duration-300">
            <FaLinkedin className="group-hover:scale-105 w-5 h-5 transition-transform" />
          </div>

          <span className="group-hover:text-white text-xs font-medium text-slate-400 transition-colors duration-200">LinkedIn</span>
        </a>

        <a className="group flex flex-col items-center gap-3 transition-transform duration-200 active:scale-95" rel="noopener noreferrer" href="https://github.com/nxhxttxr/" target="_blank">
          <div className="group-hover:border-[#BB99FF]/40 group-hover:text-[#BB99FF] group-hover:shadow-[0_0_15px_rgba(141,81,250,0.2)] w-12 h-12 flex items-center justify-center border border-white/[0.05] text-white/80 rounded-full bg-[#16161c] transition-all duration-300">
            <FaGithub className="group-hover:scale-105 w-5 h-5 transition-transform" />
          </div>

          <span className="group-hover:text-white text-xs font-medium text-slate-400 transition-colors duration-200">GitHub</span>
        </a>

        <a className="group flex flex-col items-center gap-3 transition-transform duration-200 active:scale-95" rel="noopener noreferrer" href="mailto:marioskaradimitris@gmail.com" target="_blank">
          <div className="group-hover:border-[#BB99FF]/40 group-hover:text-[#BB99FF] group-hover:shadow-[0_0_15px_rgba(141,81,250,0.2)] w-12 h-12 flex items-center justify-center border border-white/[0.05] text-white/80 rounded-full bg-[#16161c] transition-all duration-300">
            <CiMail className="group-hover:scale-105 w-5 h-5 transition-transform" />
          </div>

          <span className="group-hover:text-white text-xs font-medium text-slate-400 transition-colors duration-200">E-mail</span>
        </a>
      </nav>
    </section>
  );
}