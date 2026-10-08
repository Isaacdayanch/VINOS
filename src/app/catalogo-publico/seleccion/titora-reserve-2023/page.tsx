import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { titoraReserve2023 as wine } from "../../_lib/titora-reserve-2023";

export const metadata = editorialMetadata(wine);

export default function TitoraReserve2023Page() {
  return <EditorialWinePage wine={wine} />;
}