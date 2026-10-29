import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { daltonElkoshShiraz2019 as wine } from "../../_lib/dalton-elkosh-shiraz-2019";

export const metadata = editorialMetadata(wine);

export default function DaltonElkoshShiraz2019Page() {
  return <EditorialWinePage wine={wine} />;
}
