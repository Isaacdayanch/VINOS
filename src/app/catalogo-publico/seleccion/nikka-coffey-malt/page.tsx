import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { nikkaCoffeyMalt as wine } from "../../_lib/nikka-coffey-malt";

export const metadata = editorialMetadata(wine);

export default function NikkaCoffeyMaltPage() {
  return <EditorialWinePage wine={wine} />;
}
