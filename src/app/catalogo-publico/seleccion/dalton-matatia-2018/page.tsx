import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { daltonMatatia2018 as wine } from "../../_lib/dalton-matatia-2018";

export const metadata = editorialMetadata(wine);

export default function DaltonMatatia2018Page() {
  return <EditorialWinePage wine={wine} />;
}
