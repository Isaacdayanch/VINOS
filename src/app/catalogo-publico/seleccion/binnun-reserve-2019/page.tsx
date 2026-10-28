import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { binnunReserve2019 as wine } from "../../_lib/binnun-reserve-2019";

export const metadata = editorialMetadata(wine);

export default function BinnunReserve2019Page() {
  return <EditorialWinePage wine={wine} />;
}
