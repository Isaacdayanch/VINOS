import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { daltonLevantina2021 as wine } from "../../_lib/dalton-levantina-2021";

export const metadata = editorialMetadata(wine);

export default function DaltonLevantina2021Page() {
  return <EditorialWinePage wine={wine} />;
}
