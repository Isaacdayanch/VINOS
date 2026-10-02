import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { reserve2019 as wine } from "../../_lib/reserve-2019";

export const metadata = editorialMetadata(wine);

export default function Reserve2019Page() {
  return <EditorialWinePage wine={wine} />;
}
