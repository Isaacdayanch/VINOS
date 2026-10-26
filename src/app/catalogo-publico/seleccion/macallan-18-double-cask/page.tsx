import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { macallan18DoubleCask as wine } from "../../_lib/macallan-18-double-cask";

export const metadata = editorialMetadata(wine);

export default function Macallan18DoubleCaskPage() {
  return <EditorialWinePage wine={wine} />;
}
