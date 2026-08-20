import type { Metadata } from "next";
import { gameFontVars } from "@/components/game/ui/game-fonts";
import { Cluster, Family, GroupHeader, Specimen, SpecimenGrid } from "@/components/repository/Showcase";
import { groupBySlug } from "@/lib/repository";

// Cuatro papeles de texto sacados de example1.jpg (public/concepts/UI/), no
// una escala de tamaños: el tamaño lo pone quien use la clase. Ver la nota
// de styles/components/_game-typography.scss para el porqué de cada uno.

const group = groupBySlug("pro", "typography")!;

export const metadata: Metadata = {
  title: group.label,
  description: group.summary,
};

export default function TypographyPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <GroupHeader group={group} />

      <div className="mb-8 rounded-lg border-l-4 border-[var(--wiki-callout-border)] bg-[var(--wiki-callout-bg)] p-4 text-sm text-[var(--wiki-text)]">
        <b>Sin capitulares, de momento.</b> El registro de esta familia hablaba también de
        capitulares —la inicial grande de un párrafo—, pero ni <code>example1.jpg</code> ni el resto
        de referencias en <code>public/concepts/UI/</code> tienen una sola superficie de lectura larga
        (diario, pergamino de misión, biografía) donde una inicial grande tenga sitio. Se aparca hasta
        que exista esa pantalla, en vez de inventar un párrafo de relleno para lucirla.
      </div>

      <Family
        title="Rótulos grabados"
        note={
          <>
            Mismo oro, dos recetas. A tamaño de titular (<code>.game-type-display</code>) hay alto de
            sobra para un degradado de tres paradas recortado al glifo. A tamaño de título de panel
            (<code>.game-type-heading</code>, PARTY INTERFACE o CHANGE CLASS en la referencia) ese
            mismo degradado se ensucia, así que es oro plano con sombra de contacto —la receta de{" "}
            <code>game-button__label</code>, compartida vía el mixin{" "}
            <code>game-engraved-text()</code>.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Titular" hint={<code>.game-type-display</code>}>
            <div className="game-demo-surface">
              <span className={`${gameFontVars} game-type-display text-4xl`}>Victory</span>
            </div>
          </Specimen>
          <Specimen label="Título de panel" hint={<code>.game-type-heading</code>}>
            <div className="game-demo-surface">
              <span className={`${gameFontVars} game-type-heading text-lg`}>Party Interface</span>
            </div>
          </Specimen>
        </SpecimenGrid>
      </Family>

      <Family
        title="Cuerpo y texto secundario"
        note={
          <>
            <code>.game-type-body</code> (crema) para lo que es el dato principal —USERNAME—, y{" "}
            <code>.game-type-meta</code> (tostado apagado) para lo que lo acompaña sin competir con
            él —Lvl. 20, Not in Game—. Los dos en $font-sans: en la referencia ese texto es un sans
            genérico, sin peculiaridad que justifique una segunda familia.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Cuerpo" hint={<code>.game-type-body</code>}>
            <div className="game-demo-surface">
              <span className="game-type-body text-base font-semibold">Username</span>
            </div>
          </Specimen>
          <Specimen label="Secundario" hint={<code>.game-type-meta</code>}>
            <div className="game-demo-surface">
              <span className="game-type-meta text-sm">Lvl. 20 · K&amp;D Ratio: 2.1</span>
            </div>
          </Specimen>
        </SpecimenGrid>
      </Family>

      <Family
        title="Cifra de estadística"
        note={
          <>
            <code>.game-stat</code> empareja etiqueta y valor: tostado apagado para la etiqueta,
            crema en negrita para el número —así se leen Strength, Health o Hit Speed en la ficha de
            personaje de la referencia—. No son un alias de body/meta: el valor va más grueso que los
            dos.
          </>
        }
      >
        <Specimen label="Fila de estadísticas" hint={<code>.game-stat</code>}>
          <div className="game-demo-surface">
            <Cluster>
              <span className="game-stat text-sm">
                <span className="game-stat__label">Strength:</span>
                <span className="game-stat__value">200</span>
              </span>
              <span className="game-stat text-sm">
                <span className="game-stat__label">Health:</span>
                <span className="game-stat__value">2.200</span>
              </span>
              <span className="game-stat text-sm">
                <span className="game-stat__label">Hit Speed:</span>
                <span className="game-stat__value">15.23</span>
              </span>
            </Cluster>
          </div>
        </Specimen>
      </Family>
    </div>
  );
}
