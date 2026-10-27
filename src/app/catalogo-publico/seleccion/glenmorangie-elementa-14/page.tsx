import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { glenmorangieElementa14 as wine } from "../../_lib/glenmorangie-elementa-14";

export const metadata = editorialMetadata(wine);

export default function GlenmorangieElementa14Page() {
  return <EditorialWinePage wine={wine} />;
}
