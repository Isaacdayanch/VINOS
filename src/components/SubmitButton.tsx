"use client";

import { useFormStatus } from "react-dom";

/**
 * Botón de submit con retroalimentación clara de que ya se le picó: spinner
 * + texto opcional mientras se guarda, deshabilitado para que no se pueda
 * picar dos veces. Conserva el className que le pases tal cual (mismo color
 * y tamaño de siempre), solo le agrega el estado de "cargando".
 */
export function SubmitButton({
  children,
  className,
  pendingText,
  disabled,
}: {
  children: React.ReactNode;
  className: string;
  pendingText?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className={`${className} transition-all duration-200 ease-out ${
        pending ? "opacity-60 cursor-wait" : "active:scale-[0.97]"
      }`}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {pending && (
          <svg
            className="animate-spin h-3.5 w-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {pending && pendingText ? pendingText : children}
      </span>
    </button>
  );
}
