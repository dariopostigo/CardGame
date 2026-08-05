import type { Metadata } from "next";
import GameInput from "@/components/game/ui/GameInput";
import GameCheckboxDemo from "@/components/repository/pro/GameCheckboxDemo";
import GameRadioDemo from "@/components/repository/pro/GameRadioDemo";
import GameSelectDemo from "@/components/repository/pro/GameSelectDemo";
import GameSliderDemo from "@/components/repository/pro/GameSliderDemo";
import GameSwitchDemo from "@/components/repository/pro/GameSwitchDemo";
import { Family, GroupHeader, Specimen } from "@/components/repository/Showcase";
import { groupBySlug } from "@/lib/repository";

// La casilla sale de example1.jpg (SELECT GAME MODE). El desplegable y el
// deslizador no están ahí —se toman de preview-03/04_*.webp, mismo directorio,
// otro kit ("Crownfall")— y se redibujan con la paleta $game ya establecida
// en vez de la suya propia. El radio, el interruptor y el campo de texto no
// aparecen sueltos en ninguna referencia: extienden ese mismo vocabulario en
// vez de calcar una captura. Ver la nota de styles/components/_game-form.scss.

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
        <b>Todo PrimeReact, todo revestido.</b> Los seis controles de esta familia son{" "}
        <code>Checkbox</code>, <code>RadioButton</code>, <code>InputSwitch</code>,{" "}
        <code>Dropdown</code>, <code>InputText</code> y <code>Slider</code> de PrimeReact —ya
        dependencia del lado de herramientas—, no <code>&lt;input&gt;</code> nativos con estilos
        encima: el estado marcado, enfocado o deshabilitado ya lo gestiona la librería con nodos
        HTML reales, así que aquí solo hace falta pintarlos con <code>game(&quot;…&quot;)</code>.
      </div>

      <Family
        title="Casillas"
        note={
          <>
            <code>GameCheckbox</code> reviste <code>&lt;Checkbox&gt;</code>: cuadro hueco de acero
            oscuro que solo enseña un check dorado al marcarse, igual que en la referencia SELECT
            GAME MODE. Para lo <b>acumulable</b> —ajustes independientes entre sí—.
          </>
        }
      >
        <Specimen label="Ajustes" hint={<code>&lt;GameCheckbox&gt;</code>}>
          <div className="game-demo-surface">
            <GameCheckboxDemo />
          </div>
        </Specimen>
      </Family>

      <Family
        title="Botones de radio"
        note={
          <>
            <code>GameRadio</code> reviste <code>&lt;RadioButton&gt;</code>: mismo acero y mismo
            dorado que la casilla, pero círculo, para que se reconozca de un vistazo como elección{" "}
            <b>excluyente</b>. La referencia dibuja Select Game Mode con cuadros —de ahí la casilla
            de arriba también sirviera de radio en la versión anterior—, pero un catálogo de
            radiobuttons pide el círculo real, no el disfraz cuadrado.
          </>
        }
      >
        <Specimen label="Select Game Mode" hint={<code>&lt;GameRadio&gt;</code>}>
          <div className="game-demo-surface">
            <GameRadioDemo />
          </div>
        </Specimen>
      </Family>

      <Family
        title="Interruptor"
        note={
          <>
            <code>GameSwitch</code> reviste <code>&lt;InputSwitch&gt;</code>: pista y pomo son{" "}
            <code>&lt;span&gt;</code>/<code>&lt;div&gt;</code> reales, no un{" "}
            <code>&lt;input type=&quot;checkbox&quot;&gt;</code> con <code>accent-color</code> —esa
            receta ya falló con el deslizador nativo, ver más abajo—. Para lo que se nota al
            instante, sin confirmar nada.
          </>
        }
      >
        <Specimen label="Ajustes en caliente" hint={<code>&lt;GameSwitch&gt;</code>}>
          <div className="game-demo-surface">
            <GameSwitchDemo />
          </div>
        </Specimen>
      </Family>

      <Family
        title="Desplegable"
        note={
          <>
            <code>GameSelect</code> viste el <code>&lt;Dropdown&gt;</code> de PrimeReact en vez de
            un <code>&lt;select&gt;</code> nativo: así el panel desplegado es HTML normal, con{" "}
            <code>game(&quot;…&quot;)</code> de la cabeza a los pies, y no algo que pinte el sistema
            operativo y no se pueda temar.
          </>
        }
      >
        <Specimen label="Visual Style" hint={<code>&lt;GameSelect&gt;</code>}>
          <div className="game-demo-surface">
            <GameSelectDemo />
          </div>
        </Specimen>
      </Family>

      <Family
        title="Campo de texto"
        note={
          <>
            <code>GameInput</code> reviste <code>&lt;InputText&gt;</code>, que por debajo sigue
            siendo un <code>&lt;input&gt;</code> normal: admite <code>value</code>/
            <code>onChange</code> controlados o, como aquí, un simple <code>defaultValue</code>.
          </>
        }
      >
        <Specimen label="Character Name" hint={<code>&lt;GameInput&gt;</code>}>
          <div className="game-demo-surface">
            <GameInput defaultValue="Peñasco-01" aria-label="Character Name" />
          </div>
        </Specimen>
      </Family>

      <Family
        title="Deslizador"
        note={
          <>
            <code>GameSlider</code> reviste el <code>&lt;Slider&gt;</code> de PrimeReact: pista y
            pomo son <code>&lt;span&gt;</code> reales (<code>.p-slider-range</code>/
            <code>-handle</code>), no un <code>&lt;input type=&quot;range&quot;&gt;</code> —esa
            versión, con <code>accent-color</code>, se probó primero y desentonaba con el resto del
            tema—.
          </>
        }
      >
        <Specimen label="Target Lock Strength" hint={<code>&lt;GameSlider&gt;</code>}>
          <div className="game-demo-surface">
            <GameSliderDemo />
          </div>
        </Specimen>
      </Family>
    </div>
  );
}
