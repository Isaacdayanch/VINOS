import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { macallan30DoubleCask as wine } from "../../_lib/macallan-30-double-cask";

export const metadata = editorialMetadata(wine);

export default function Macallan30DoubleCaskPage() {
  return <EditorialWinePage wine={wine} />;
}
