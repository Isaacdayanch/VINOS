import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { nikkaCoffeyGrain as wine } from "../../_lib/nikka-coffey-grain";

export const metadata = editorialMetadata(wine);

export default function NikkaCoffeyGrainPage() {
  return <EditorialWinePage wine={wine} />;
}
