"use client";

import { useState } from "react";

export function GaleriaVinoPublica({ fotos, nombre }: { fotos: string[]; nombre: string }) {
  const [activa, setActiva] = useState(0);
  if (fotos.length === 0) return null;

  return (
    <div>
      <div
        className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ background: "radial-gradient(ellipse at center, rgba(212,175,106,0.18), transparent 70%)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fotos[activa]}
          alt={nombre}
          className="w-4/5 h-4/5 object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.55)] transition-opacity duration-300"
        />
      </div>

      {fotos.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {fotos.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiva(i)}
              className={`w-14 aspect-[3/4] rounded-md overflow-hidden shrink-0 border-2 transition-colors bg-black/20 ${
                i === activa ? "border-[#d4af6a]" : "border-white/10 hover:border-white/30"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
