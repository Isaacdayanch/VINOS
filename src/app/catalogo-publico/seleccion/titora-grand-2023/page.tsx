import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { titoraGrand2023 as wine } from "../../_lib/titora-grand-2023";

export const metadata = editorialMetadata(wine);

export default function TitoraGrand2023Page() {
  return <EditorialWinePage wine={wine} />;
}
