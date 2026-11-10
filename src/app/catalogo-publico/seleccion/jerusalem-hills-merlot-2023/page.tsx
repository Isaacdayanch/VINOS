import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { jerusalemHillsMerlot2023 as wine } from "../../_lib/jerusalem-hills-merlot-2023";

export const metadata = editorialMetadata(wine);

export default function JerusalemHillsMerlot2023Page() {
  return <EditorialWinePage wine={wine} />;
}
