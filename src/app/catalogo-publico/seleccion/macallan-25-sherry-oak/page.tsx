import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { macallan25SherryOak as wine } from "../../_lib/macallan-25-sherry-oak";

export const metadata = editorialMetadata(wine);

export default function Macallan25SherryOakPage() {
  return <EditorialWinePage wine={wine} />;
}
