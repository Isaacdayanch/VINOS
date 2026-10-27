import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { macallan15DoubleCask as wine } from "../../_lib/macallan-15-double-cask";

export const metadata = editorialMetadata(wine);

export default function Macallan15DoubleCaskPage() {
  return <EditorialWinePage wine={wine} />;
}
