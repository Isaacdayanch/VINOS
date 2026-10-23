import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { macallan12DoubleCask as wine } from "../../_lib/macallan-12-double-cask";

export const metadata = editorialMetadata(wine);

export default function Macallan12DoubleCaskPage() {
  return <EditorialWinePage wine={wine} />;
}
