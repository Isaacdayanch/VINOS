import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { reserve2017 as wine } from "../../_lib/reserve-2017";

export const metadata = editorialMetadata(wine);

export default function Reserve2017Page() {
  return <EditorialWinePage wine={wine} />;
}
