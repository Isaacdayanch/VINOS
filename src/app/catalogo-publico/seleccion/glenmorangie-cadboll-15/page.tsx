import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { glenmorangieCadboll15 as wine } from "../../_lib/glenmorangie-cadboll-15";

export const metadata = editorialMetadata(wine);

export default function GlenmorangieCadboll15Page() {
  return <EditorialWinePage wine={wine} />;
}
