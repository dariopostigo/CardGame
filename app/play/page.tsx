import { redirect } from "next/navigation";

// /play fue la primera ruta del prototipo, antes de que existiera la sección
// /dev. Se mantiene como redirección para no romper enlaces ni marcadores.

export default function PlayPage() {
  redirect("/dev/tablero");
}
