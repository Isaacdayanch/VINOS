import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { daltonFcShiraz2021 as wine } from "../../_lib/dalton-fc-shiraz-2021";

export const metadata = editorialMetadata(wine);

export default function DaltonFcShiraz2021Page() {
  return <EditorialWinePage wine={wine} />;
}
