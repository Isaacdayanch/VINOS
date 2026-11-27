import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { jerusalemHillsReserve2023 as wine } from "../../_lib/jerusalem-hills-reserve-2023";

export const metadata = editorialMetadata(wine);

export default function JerusalemHillsReserve2023Page() {
  return <EditorialWinePage wine={wine} />;
}
