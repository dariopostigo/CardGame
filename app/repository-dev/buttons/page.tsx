import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import {
  Cluster,
  Family,
  GroupHeader,
  Specimen,
  SpecimenGrid,
} from "@/components/repository/Showcase";
import { groupBySlug } from "@/lib/repository";

// El botón de las herramientas, que es NUESTRO y no el de PrimeReact: en la
// v11 los componentes llegan sin CSS (el aviso de la página lo explica), así
// que un <Button> de la librería se pinta como texto pelado. Lo que se
// documenta aquí es components/ui/Button.tsx, el mismo que usan los labs.

const group = groupBySlug("dev", "buttons")!;

export const metadata: Metadata = {
  title: group.label,
  description: group.summary,
};

export default function ButtonsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <GroupHeader group={group} />

      <div className="mb-8 rounded-lg border-l-4 border-[var(--wiki-callout-border)] bg-[var(--wiki-callout-bg)] p-4 text-sm text-[var(--wiki-text)]">
        <b>Por qué el botón es nuestro y no de PrimeReact.</b> En PrimeReact 11 los componentes
        llegan <b>sin hoja de estilo</b>: el preset Aura de <code>@primeuix/themes</code> 3 trae los
        tokens de diseño, pero su CSS de componente está vacío y la librería no registra las clases{" "}
        <code>p-button</code> —el atributo <code>class</code> sale literalmente en blanco—. Con el
        reset de Tailwind por debajo, un <code>&lt;Button&gt;</code> se pinta como texto sin caja.
        Así que el botón es un <code>&lt;button&gt;</code> con las clases de{" "}
        <code>styles/components/_button.scss</code>. A los campos y selectores les pasa lo mismo:
        siguen sin vestir, a la espera de la misma decisión.
      </div>

      <Family
        title="Variantes"
        note={
          <>
            Cuatro pesos y ni uno más. La <b>neutra</b> es la de los paneles de mando —la que ya
            había en los labs— y la de por defecto: si dudas, es esta. La <b>primaria</b> es la
            acción que la pantalla existe para ejecutar y va <b>una sola</b> por panel.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Neutra" hint="Por defecto. La de los paneles de mando">
            <Button>Boceto en blanco</Button>
          </Specimen>
          <Specimen label="Primaria" hint={<code>variant=&quot;primary&quot;</code>}>
            <Button variant="primary">Generar tablero</Button>
          </Specimen>
          <Specimen label="Fantasma" hint="Acción terciaria: sin caja hasta que se pasa por encima">
            <Button variant="ghost">Descartar</Button>
          </Specimen>
          <Specimen label="Destructiva" hint="Solo para lo que borra datos de data/">
            <Button variant="danger">Eliminar tipo</Button>
          </Specimen>
        </SpecimenGrid>
      </Family>

      <Family
        title="Estado activo"
        note={
          <>
            <code>active</code> no es una variante, es un <b>estado</b>: un botón de «Giro 60°»
            sigue siendo neutro cuando está apagado. Es lo que pinta las conmutaciones de{" "}
            <code>/dev/losetas</code> y <code>/dev/tablero</code>, y por eso pisa a la variante.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Fila de conmutación" hint="Solo una encendida: es un giro, no un filtro">
            <Cluster>
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <Button key={deg} active={deg === 0}>
                  {deg}°
                </Button>
              ))}
            </Cluster>
          </Specimen>
          <Specimen label="Conmutación suelta" hint="Encendida y apagada, la misma pieza">
            <Cluster>
              <Button active>Coordenadas</Button>
              <Button>Coordenadas</Button>
            </Cluster>
          </Specimen>
        </SpecimenGrid>
      </Family>

      <Family title="Tamaños y formas">
        <SpecimenGrid>
          <Specimen label="Tamaños" hint={<code>size=&quot;sm&quot; | &quot;md&quot;</code>}>
            <Cluster>
              <Button size="sm">Pequeño</Button>
              <Button>Normal</Button>
            </Cluster>
          </Specimen>
          <Specimen
            label="Solo icono"
            hint={
              <>
                <code>iconOnly</code> — cuadrado y con <code>aria-label</code> obligatorio: sin él
                el botón no tiene nombre accesible
              </>
            }
          >
            <Cluster>
              <Button iconOnly aria-label="Girar loseta">
                <i className="pi pi-refresh" />
              </Button>
              <Button iconOnly variant="primary" aria-label="Guardar biblioteca">
                <i className="pi pi-save" />
              </Button>
              <Button iconOnly variant="danger" aria-label="Borrar hexágono">
                <i className="pi pi-trash" />
              </Button>
              <Button iconOnly size="sm" aria-label="Quitar variante">
                <i className="pi pi-times" />
              </Button>
            </Cluster>
          </Specimen>
          <Specimen
            label="Con icono y rótulo"
            hint="El icono va un punto más pequeño que la palabra"
          >
            <Cluster>
              <Button variant="primary">
                <i className="pi pi-save" />
                Guardar en la biblioteca
              </Button>
              <Button>
                Siguiente semilla
                <i className="pi pi-arrow-right" />
              </Button>
            </Cluster>
          </Specimen>
          <Specimen label="Ancho completo" hint={<code>block</code>}>
            <div className="w-full">
              <Button variant="primary" block>
                Generar 300 tableros
              </Button>
            </div>
          </Specimen>
        </SpecimenGrid>
      </Family>

      <Family
        title="Deshabilitado"
        note={
          <>
            El atributo nativo, sin clase aparte: baja la opacidad y quita el puntero. No hay prop{" "}
            <code>loading</code>: el estado de espera se compone con el spinner de PrimeIcons y{" "}
            <code>disabled</code>, que es lo que impide guardar dos veces mientras se escribe en{" "}
            <code>data/</code>.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Apagado" hint="Las cuatro variantes, deshabilitadas">
            <Cluster>
              <Button disabled>Neutra</Button>
              <Button variant="primary" disabled>
                Primaria
              </Button>
              <Button variant="ghost" disabled>
                Fantasma
              </Button>
              <Button variant="danger" disabled>
                Destructiva
              </Button>
            </Cluster>
          </Specimen>
          <Specimen label="Esperando" hint={<code>pi pi-spin pi-spinner</code>}>
            <Button variant="primary" disabled>
              <i className="pi pi-spin pi-spinner" />
              Guardando…
            </Button>
          </Specimen>
        </SpecimenGrid>
      </Family>
    </div>
  );
}
