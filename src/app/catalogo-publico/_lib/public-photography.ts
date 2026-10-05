/** Presentation-only retouches. Never write to the CRM or override a newly uploaded photo. */
const zahavSource = "https://lwekyvwfrmgzmavwveji.supabase.co/storage/v1/object/public/fotos-productos/8f858fed-c35b-425d-8d91-cf84571a75ab.png";

export function publicPhotograph(id: string | undefined, original: string | null): string | null {
  return id === "cmtssyq64000bl404ysfp4xsq" && original === zahavSource
    ? "/catalogo/charley-zahav-2024-white.webp"
    : original;
}
