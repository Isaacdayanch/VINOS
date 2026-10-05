// Run with: npx tsx scripts/check-catalog-routing.ts
import assert from "node:assert/strict";
import { NextRequest } from "next/server";

async function main() {
  process.env.DOMINIO_CATALOGO_PUBLICO = "catalog.test";
  process.env.APP_PASSWORD = "routing-test-only";
  const { middleware } = await import("../src/middleware");
  const request = (host: string, path: string) =>
    new NextRequest(`https://${host}${path}`, { headers: { host } });

  for (const path of ["/catalogo/terrace.webp", "/catalogo/reserve-2017.webp", "/catalogo/reserve-2017-label-original.webp", "/catalogo-publico", "/catalogo-publico/catalogo"]) {
    const response = await middleware(request("catalog.test", path));
    assert.equal(response.headers.get("x-middleware-next"), "1", path);
    assert.equal(response.headers.get("x-middleware-rewrite"), null, path);
  }
  for (const path of ["/", "/productos", "/api/productos", "/catalogo-privado/export.csv"]) {
    const response = await middleware(request("catalog.test", path));
    assert.equal(new URL(response.headers.get("x-middleware-rewrite")!).pathname, "/catalogo-publico", path);
  }
  const crm = await middleware(request("crm.test", "/productos"));
  assert.equal(new URL(crm.headers.get("location")!).pathname, "/login");
  const publicPage = await middleware(request("crm.test", "/catalogo-publico"));
  assert.equal(publicPage.headers.get("x-middleware-next"), "1");
  console.log("Catalog assets, public pages, catalog isolation and CRM authentication: passed");

  // Con URL_CATALOGO_PUBLICO puesta, el CRM (cualquier host que no sea el
  // del catálogo) redirige /catalogo-publico al dominio real, conservando
  // ruta y parámetros; el dominio del catálogo nunca redirige (sin bucle).
  process.env.URL_CATALOGO_PUBLICO = "https://catalog.test";
  const redirige = await middleware(request("crm.test", "/catalogo-publico/abc123"));
  assert.equal(redirige.headers.get("location"), "https://catalog.test/catalogo-publico/abc123");

  const conQuery = await middleware(
    new NextRequest("https://crm.test/catalogo-publico/catalogo?tipo=tinto", { headers: { host: "crm.test" } }),
  );
  const destino = new URL(conQuery.headers.get("location")!);
  assert.equal(destino.origin + destino.pathname, "https://catalog.test/catalogo-publico/catalogo");
  assert.equal(destino.searchParams.get("tipo"), "tinto");

  const sinBucle = await middleware(request("catalog.test", "/catalogo-publico"));
  assert.equal(sinBucle.headers.get("x-middleware-next"), "1");
  assert.equal(sinBucle.headers.get("location"), null);

  console.log("Catalog domain redirect (Snowy -> catalog domain, with query, no loop): passed");
}

main().catch(error => { console.error(error); process.exitCode = 1; });
