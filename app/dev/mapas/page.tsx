import { redirect } from "next/navigation";

// /dev/mapas fue el primer laboratorio, cuando "mapa" era una sola cosa. Al
// separar la loseta (la pieza) del tablero (la partida) se partió en dos
// laboratorios; esta ruta se queda como redirección para no romper enlaces.

export default function MapasLabPage() {
  redirect("/dev/tablero");
}
