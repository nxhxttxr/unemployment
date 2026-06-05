"use client";

export default function Playlist() {
  return (
    <div className="relative h-[500px] w-full rounded-xl overflow-hidden bg-zinc-900/50">
      <iframe 
        data-testid="embed-iframe"
        style={{ borderRadius: "12px" }}
        src="https://open.spotify.com/embed/playlist/70M80E0Z7dwky4XqI1aLqu?utm_source=generator&theme=0"
        width="100%"
        height="500"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy" 
      />
    </div>
  );
}