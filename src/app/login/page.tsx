import { iniciarSesion } from "./actions";

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const error = params.error === "1";
  const volver = typeof params.volver === "string" ? params.volver : "/";

  return (
    <div className="min-h-full flex items-center justify-center bg-background px-4">
      <form
        action={iniciarSesion}
        className="w-full max-w-xs rounded-lg border border-border bg-surface p-6 flex flex-col gap-4"
      >
        <input type="hidden" name="volver" value={volver} />
        <div className="text-center">
          <h1 className="text-xl font-bold text-wine">Vinos CRM</h1>
          <p className="text-muted text-sm">Ingresa la clave para entrar</p>
        </div>
        <input
          name="password"
          type="password"
          autoFocus
          required
          className="rounded-md border border-border bg-surface px-3 py-2 text-center"
          placeholder="Clave"
        />
        {error && (
          <p className="text-xs text-warn text-center">Clave incorrecta, intenta otra vez.</p>
        )}
        <button
          type="submit"
          className="rounded-md bg-wine text-white px-4 py-2 font-medium hover:bg-wine-dark active:scale-[0.97] disabled:opacity-60 transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
