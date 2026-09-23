"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const FADE_ORILLAS =
  "linear-gradient(to bottom, transparent 0%, black 10%, black 55%, transparent 98%)";

export function GaleriaVinoPublica({ fotos, nombre }: { fotos: string[]; nombre: string }) {
  const [activa, setActiva] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (fotos.length === 0) return null;

  function onScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    setActiva(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div className="relative w-full">
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {fotos.map((url, i) => (
          <div
            key={i}
            className="relative w-full shrink-0 snap-center aspect-[4/5] bg-wine-light/40"
          >
            <Image
              src={url}
              alt={i === 0 ? nombre : ""}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-contain p-6"
              style={{ maskImage: FADE_ORILLAS, WebkitMaskImage: FADE_ORILLAS }}
            />
          </div>
        ))}
      </div>

      {fotos.length > 1 && (
        <div className="absolute inset-x-0 bottom-[38%] flex justify-center gap-1.5">
          {fotos.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === activa ? "w-5 bg-wine" : "w-1.5 bg-wine/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
