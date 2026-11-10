import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { jerusalemHillsCabernetShiraz2023 as wine } from "../../_lib/jerusalem-hills-cabernet-shiraz-2023";

export const metadata = editorialMetadata(wine);

export default function JerusalemHillsCabernetShiraz2023Page() {
  return <EditorialWinePage wine={wine} />;
}
