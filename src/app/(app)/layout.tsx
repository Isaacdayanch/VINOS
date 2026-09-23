import { NavBar } from "@/components/NavBar";
import { AvisoPendientesEntrega } from "@/components/AvisoPendientesEntrega";

// El aviso de pendientes de entregar consulta la base de datos en cada
// visita — todo lo que cuelga de este layout debe renderizarse por
// solicitud (nunca intentar generarlo como página estática en el build).
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <AvisoPendientesEntrega />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
    </>
  );
}
