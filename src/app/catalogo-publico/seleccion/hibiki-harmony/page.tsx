import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { hibikiHarmony as wine } from "../../_lib/hibiki-harmony";

export const metadata = editorialMetadata(wine);

export default function HibikiHarmonyPage() {
  return <EditorialWinePage wine={wine} />;
}
