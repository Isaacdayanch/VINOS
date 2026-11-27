import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { jerusalemHillsMuscat2023 as wine } from "../../_lib/jerusalem-hills-muscat-2023";

export const metadata = editorialMetadata(wine);

export default function JerusalemHillsMuscat2023Page() {
  return <EditorialWinePage wine={wine} />;
}
