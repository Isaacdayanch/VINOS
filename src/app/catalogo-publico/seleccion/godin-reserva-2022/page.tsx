import { EditorialWinePage } from "../../_components/EditorialWinePage";
import { editorialMetadata } from "../../_lib/editorial-wine";
import { godinReserva2022 as wine } from "../../_lib/godin-reserva-2022";

export const metadata = editorialMetadata(wine);

export default function GodinReserva2022Page() {
  return <EditorialWinePage wine={wine} />;
}
