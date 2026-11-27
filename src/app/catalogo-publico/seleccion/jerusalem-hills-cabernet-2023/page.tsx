import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { jerusalemHillsCabernet2023 as wine } from "../../_lib/jerusalem-hills-cabernet-2023";

export const metadata = editorialMetadata(wine);

export default function JerusalemHillsCabernet2023Page() {
  return <EditorialWinePage wine={wine} />;
}
