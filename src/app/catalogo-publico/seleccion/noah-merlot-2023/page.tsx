import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { noahMerlot2023 as wine } from "../../_lib/noah-merlot-2023";

export const metadata = editorialMetadata(wine);

export default function NoahMerlot2023Page() {
  return <EditorialWinePage wine={wine} />;
}
