/** Presentation-only retouches. Never write to the CRM or override a newly uploaded photo. */
const zahavSource = "https://lwekyvwfrmgzmavwveji.supabase.co/storage/v1/object/public/fotos-productos/8f858fed-c35b-425d-8d91-cf84571a75ab.png";

export function publicPhotograph(id: string | undefined, original: string | null): string | null {
  if (id === "cmtssyq4u0006l404sytto49b" && original === "https://lwekyvwfrmgzmavwveji.supabase.co/storage/v1/object/public/fotos-productos/3b967d56-90ce-4710-b542-c6753ff5649b.png") return "/catalogo/tanya-eliya-2021-front-v2.webp";
  if (id === "cmtssyq3t0002l404jdevszsb" && original === "https://lwekyvwfrmgzmavwveji.supabase.co/storage/v1/object/public/fotos-productos/819f54b7-f03c-420b-815d-75b1cd1bfc78.png") return "/catalogo/reserve-2018-front-v1.webp";
  if (id === "cmtssyq5c0008l404fkede9in" && original === "https://lwekyvwfrmgzmavwveji.supabase.co/storage/v1/object/public/fotos-productos/8a2ad238-80c4-4fa9-8db8-6bb0b6387065.png") return "/catalogo/tanya-late-harvest-2024-front-v2.webp";
  if (id === "cmtssyq350000l404mdg2nzou" && original === "https://lwekyvwfrmgzmavwveji.supabase.co/storage/v1/object/public/fotos-productos/21c634b4-178c-43ca-abb7-5c916df01c65.png") return "/catalogo/dadah-cabernet-2023-front-v2.webp";
  return id === "cmtssyq64000bl404ysfp4xsq" && original === zahavSource
    ? "/catalogo/charley-zahav-2024-white.webp"
    : original;
}
