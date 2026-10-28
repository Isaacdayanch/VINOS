import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { daltonFcCabernet2023 as wine } from "../../_lib/dalton-fc-cabernet-2023";

export const metadata = editorialMetadata(wine);

export default function DaltonFcCabernet2023Page() {
  return <EditorialWinePage wine={wine} />;
}
