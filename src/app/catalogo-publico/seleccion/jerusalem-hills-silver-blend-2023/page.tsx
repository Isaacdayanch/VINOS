import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { jerusalemHillsSilverBlend2023 as wine } from "../../_lib/jerusalem-hills-silver-blend-2023";

export const metadata = editorialMetadata(wine);

export default function JerusalemHillsSilverBlend2023Page() {
  return <EditorialWinePage wine={wine} />;
}
