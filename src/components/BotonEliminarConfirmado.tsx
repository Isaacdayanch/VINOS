"use client";

import { SubmitButton } from "@/components/SubmitButton";

export function BotonEliminarConfirmado({
  action,
  mensaje,
  children,
  className,
}: {
  action: () => void | Promise<void>;
  mensaje: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(mensaje)) e.preventDefault();
      }}
    >
      <SubmitButton className={className ?? "text-xs text-warn underline whitespace-nowrap"}>
        {children}
      </SubmitButton>
    </form>
  );
}
