import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { glenmorangieLasanta12 as wine } from "../../_lib/glenmorangie-lasanta-12";

export const metadata = editorialMetadata(wine);

export default function GlenmorangieLasanta12Page() {
  return <EditorialWinePage wine={wine} />;
}
