import type { Metadata } from "next";
import GameButton from "@/components/game/ui/GameButton";
import { Cluster, Family, GroupHeader, Specimen, SpecimenGrid } from "@/components/repository/Showcase";
import { groupBySlug } from "@/lib/repository";

// El botón de producción (components/game/ui/GameButton.tsx), calcado del
// remache con bisel de example1.jpg (public/concepts/UI/). Dos pesos nada más,
// los dos que aparecen en la referencia: no hay variante "fantasma" ni
// "destructiva" porque ahí no existen —inventarlas sería documentar un
// componente que la fuente no respalda.

const group = groupBySlug("pro", "buttons")!;

export const metadata: Metadata = {
  title: group.label,
  description: group.summary,
};

export default function ProButtonsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <GroupHeader group={group} />

      <Family
        title="Variantes"
        note={
          <>
            <b>Neutro</b> es el peso por defecto: acero y cuero oscuros, el de LEADERBOARDS, ACCEPT o
            CHANGE CLASS en la referencia. <b>Primario</b> es sangre con halo propio —la acción que
            la pantalla existe para ejecutar, PLAY NOW o READY— y va <b>una sola</b> por panel.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Neutro" hint="Por defecto">
            <GameButton>Game Options</GameButton>
          </Specimen>
          <Specimen label="Primario" hint={<code>variant=&quot;primary&quot;</code>}>
            <GameButton variant="primary">Play Now</GameButton>
          </Specimen>
        </SpecimenGrid>
      </Family>

      <Family
        title="Tamaños y formas"
        note={
          <>
            <code>iconOnly</code> exige <code>aria-label</code>, igual que en el botón de las
            herramientas: sin él no tiene nombre accesible.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Tamaños" hint={<code>size=&quot;sm&quot; | &quot;md&quot;</code>}>
            <Cluster>
              <GameButton variant="primary" size="sm">
                Ready
              </GameButton>
              <GameButton variant="primary">Ready</GameButton>
            </Cluster>
          </Specimen>
          <Specimen label="Con icono" hint="El icono hereda el mismo grabado dorado">
            <Cluster>
              <GameButton>
                <i className="pi pi-cog" />
                Game Options
              </GameButton>
              <GameButton variant="primary">
                <i className="pi pi-play" />
                Play Now
              </GameButton>
            </Cluster>
          </Specimen>
          <Specimen label="Solo icono" hint={<code>iconOnly</code>}>
            <Cluster>
              <GameButton iconOnly aria-label="Opciones de partida">
                <i className="pi pi-cog" />
              </GameButton>
              <GameButton variant="primary" iconOnly aria-label="Refrescar">
                <i className="pi pi-refresh" />
              </GameButton>
            </Cluster>
          </Specimen>
          <Specimen label="Ancho completo" hint={<code>block</code>}>
            <div className="w-full">
              <GameButton variant="primary" block>
                Play Now
              </GameButton>
            </div>
          </Specimen>
        </SpecimenGrid>
      </Family>

      <Family
        title="Deshabilitado"
        note="El atributo nativo: apaga el bisel a base de grises y quita el puntero, sin clase aparte."
      >
        <SpecimenGrid>
          <Specimen label="Sin puntos de acción" hint="Las dos variantes, deshabilitadas">
            <Cluster>
              <GameButton disabled>Game Options</GameButton>
              <GameButton variant="primary" disabled>
                Play Now
              </GameButton>
            </Cluster>
          </Specimen>
        </SpecimenGrid>
      </Family>
    </div>
  );
}
