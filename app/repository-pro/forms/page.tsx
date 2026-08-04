import type { Metadata } from "next";
import GameCheckbox from "@/components/game/ui/GameCheckbox";
import GameSelect from "@/components/game/ui/GameSelect";
import GameSlider from "@/components/game/ui/GameSlider";
import { Cluster, Family, GroupHeader, Specimen } from "@/components/repository/Showcase";
import { groupBySlug } from "@/lib/repository";

// La casilla sale de example1.jpg (SELECT GAME MODE). El desplegable y el
// deslizador no están ahí —se toman de preview-03/04_*.webp, mismo directorio,
// otro kit ("Crownfall")— y se redibujan con la paleta $game ya establecida
// en vez de la suya propia: ver la nota de styles/components/_game-form.scss.

const group = groupBySlug("pro", "forms")!;

export const metadata: Metadata = {
  title: group.label,
  description: group.summary,
};

export default function FormsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <GroupHeader group={group} />

      <div className="mb-8 rounded-lg border-l-4 border-[var(--wiki-callout-border)] bg-[var(--wiki-callout-bg)] p-4 text-sm text-[var(--wiki-text)]">
        <b>Dos referencias, una paleta.</b> <code>example1.jpg</code> no tiene ni desplegable ni
        deslizador —solo la lista de casillas de SELECT GAME MODE—, así que esos dos salen de otra
        imagen de la misma carpeta (<code>preview-03/04_*.webp</code>, el kit &quot;Crownfall&quot;).
        Se copia la forma del control, no su cálido propio: todo sigue pidiéndose a{" "}
        <code>game(&quot;…&quot;)</code>, para no acabar con dos lenguajes de color en un mismo tema.
      </div>

      <Family
        title="Selección"
        note={
          <>
            <code>GameCheckbox</code>: un <code>&lt;input&gt;</code> real, solo oculto visualmente —el
            cuadro y el check son <code>&lt;span&gt;</code>/<code>&lt;i&gt;</code> que reaccionan a{" "}
            <code>:checked</code>—. Vale tanto para casilla suelta como, con <code>type=&quot;radio&quot;</code>{" "}
            y el mismo <code>name</code>, para una lista de elección única como esta: en la
            referencia SELECT GAME MODE se dibuja con cuadros aunque solo se pueda marcar un modo.
          </>
        }
      >
        <Specimen label="Select Game Mode" hint={<code>type=&quot;radio&quot;</code>}>
          <div className="game-demo-surface">
            <div className="flex flex-col gap-3">
              <GameCheckbox type="radio" name="mode" label="1v1" hint="Average waiting time 20s." />
              <GameCheckbox type="radio" name="mode" label="2v2" hint="Average waiting time 20s." />
              <GameCheckbox
                type="radio"
                name="mode"
                label="50v50"
                hint="Average waiting time 20s."
                defaultChecked
              />
            </div>
          </div>
        </Specimen>
      </Family>

      <Family
        title="Desplegable"
        note={
          <>
            <code>GameSelect</code> viste un <code>&lt;select&gt;</code> nativo: la lista que despliega
            la pinta el sistema operativo, no CSS del tema —el precio de que funcione de verdad con
            teclado y lector de pantalla sin una línea de JS propia.
          </>
        }
      >
        <Specimen label="Visual Style" hint={<code>&lt;GameSelect&gt;</code>}>
          <div className="game-demo-surface">
            <GameSelect defaultValue="notes-of-music" aria-label="Visual Style">
              <option value="notes-of-music">Notes of Music</option>
              <option value="dark-fantasy">Dark Fantasy</option>
              <option value="grimdark">Grimdark</option>
            </GameSelect>
          </div>
        </Specimen>
      </Family>

      <Family
        title="Deslizador"
        note={
          <>
            <code>GameSlider</code> es un <code>&lt;input type=&quot;range&quot;&gt;</code> con el tramo
            recorrido pintado a mano: dejarlo en manos de <code>accent-color</code> se probó primero y
            desentonaba —un tinte sobre el gris de fábrica del navegador, no una pieza del tema—.
            Chrome/Safari no tienen un pseudo-elemento para esa franja, así que el propio componente
            mantiene una custom property con el porcentaje en cada arrastre; Firefox sí lo tiene (
            <code>::-moz-range-progress</code>) y no necesita ese empujón.
          </>
        }
      >
        <Specimen label="Target Lock Strength" hint={<code>&lt;GameSlider&gt;</code>}>
          <div className="game-demo-surface">
            <Cluster>
              <GameSlider
                className="w-48"
                defaultValue={65}
                aria-label="Target Lock Strength"
              />
              <GameSlider
                className="w-48"
                defaultValue={30}
                aria-label="Enemy Priority Bias"
              />
            </Cluster>
          </div>
        </Specimen>
      </Family>
    </div>
  );
}
