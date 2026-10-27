import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { nikkaFromTheBarrel as wine } from "../../_lib/nikka-from-the-barrel";

export const metadata = editorialMetadata(wine);

export default function NikkaFromTheBarrelPage() {
  return <EditorialWinePage wine={wine} />;
}
