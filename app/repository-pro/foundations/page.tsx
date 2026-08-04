import type { Metadata } from "next";
import { gameFontVars } from "@/components/game/ui/game-fonts";
import { Family, GroupHeader, Specimen, SpecimenGrid } from "@/components/repository/Showcase";
import { GAME_COLOR_GROUPS, GAME_COLORS } from "@/lib/game-theme";
import { groupBySlug } from "@/lib/repository";

// Primera familia real del repositorio de producción: la paleta y el rótulo
// de example1.jpg (public/assets/UI/), no el pergamino que proponía el primer
// boceto de este apartado (ver la nota de styles/settings/_game.scss). Lo que
// documenta esta página es $game y $font-game-display —los dos SIN los
// cuales un botón o un panel serían una pieza suelta sin tema.

const group = groupBySlug("pro", "foundations")!;

export const metadata: Metadata = {
  title: group.label,
  description: group.summary,
};

export default function FoundationsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <GroupHeader group={group} />

      <div className="mb-8 rounded-lg border-l-4 border-[var(--wiki-callout-border)] bg-[var(--wiki-callout-bg)] p-4 text-sm text-[var(--wiki-text)]">
        <b>Por qué cambia de pergamino a cuero.</b> El registro de esta familia hablaba de
        «pergamino, hierro, madera y sangre»: una aventura a la luz del día. La referencia elegida
        —<code>example1.jpg</code>— no tiene ni una superficie clara: es cuero y metal casi negros,
        con la sangre como único acento cálido. Se sigue esa referencia y no el boceto original, así
        que el tema pasa a ser <b>hierro y cuero oscuro</b>. Cada token es su propia constante en{" "}
        <code>$game</code> —ninguno es un alias del <code>$gold</code> del marco legendario ni de
        ningún otro mapa—, por la misma razón por la que <code>$deck-select</code> dejó de tomar
        prestado <code>--rarity</code>: dos conceptos que hoy se parecen acaban divergiendo, y un
        alias compartido los arrastra a los dos a la vez.
      </div>

      <Family
        title="Paleta"
        note={
          <>
            Se pide por nombre a <code>game(&quot;…&quot;)</code> (
            <code>styles/tools/_functions.scss</code>), nunca en hexadecimal suelto. No conmuta con
            el claro/oscuro de las herramientas —es una constante de diseño, como{" "}
            <code>rarity()</code> o <code>terrain()</code>—, así que cada muestra va sobre su propia
            superficie <code>game(&quot;surface&quot;)</code> y no sobre el lienzo de la vitrina: un
            token del tema no se lee contra el blanco de un panel de mando.
          </>
        }
      >
        <div className="flex flex-col gap-6">
          {GAME_COLOR_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]">
                {group.title}
              </h3>
              <div className="game-swatch-row">
                {group.tokens.map((token) => (
                  <div key={token} className="game-swatch">
                    <div className={`game-swatch__block game-swatch__block--${token}`} />
                    <span className="game-swatch__name">{token}</span>
                    <span className="game-swatch__hex">{GAME_COLORS[token]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Family>

      <Family
        title="Tipografía"
        note={
          <>
            Rótulo condensado y pesado —Oswald, cargada por{" "}
            <code>components/game/ui/game-fonts.ts</code>— para todo lo que en la referencia va en
            mayúsculas grabadas: títulos de panel, botones. Geist (<code>$font-sans</code>, la de las
            herramientas) sigue sirviendo al cuerpo de texto largo: en la referencia esas líneas son
            un sans genérico sin peculiaridad, así que no hace falta una segunda familia por
            capricho.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Rótulo" hint={<code>$font-game-display</code>}>
            <div className="game-demo-surface">
              <span className={`${gameFontVars} game-type-display text-4xl`}>Change Class</span>
            </div>
          </Specimen>
          <Specimen label="Cuerpo" hint={<code>$font-sans</code>}>
            <div className="game-demo-surface">
              <span className="game-type-body text-sm">Lvl. 20 · K&amp;D Ratio: 2.1</span>
            </div>
          </Specimen>
        </SpecimenGrid>
      </Family>
    </div>
  );
}
