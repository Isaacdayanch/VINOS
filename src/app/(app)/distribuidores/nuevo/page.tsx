import { NuevoDistribuidorForm } from "@/components/NuevoDistribuidorForm";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NuevoDistribuidorPage({
  searchParams,
}: PageProps<"/distribuidores/nuevo">) {
  const params = await searchParams;
  const volver = typeof params.volver === "string" ? params.volver : undefined;
  const clienteIdInicial = typeof params.clienteId === "string" ? params.clienteId : undefined;
  const clientes = await prisma.cliente.findMany({ orderBy: { nombre: "asc" } });

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <Link href={volver || "/distribuidores"} className="text-sm text-wine underline">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-wine mt-2">Nuevo distribuidor o evento</h1>
        <p className="text-muted text-sm">
          Un distribuidor es un revendedor con mercancía en consignación. Un evento es lo mismo,
          pero para una persona directa (puedes vincularlo con su cuenta de cliente si ya compra
          contigo).
        </p>
      </div>

      <NuevoDistribuidorForm clientes={clientes} volver={volver} clienteIdInicial={clienteIdInicial} />
    </div>
  );
}
