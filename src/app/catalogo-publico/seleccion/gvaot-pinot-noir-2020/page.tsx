import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { gvaotPinotNoir2020 as wine } from "../../_lib/gvaot-pinot-noir-2020";

export const metadata = editorialMetadata(wine);

export default function GvaotPinotNoir2020Page() {
  return <EditorialWinePage wine={wine} />;
}
