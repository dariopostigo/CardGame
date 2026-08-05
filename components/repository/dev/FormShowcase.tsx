"use client";

// Los controles de formulario de las herramientas, vivos: un catálogo de
// campos sin estado no enseña nada, porque la mitad de lo que hay que juzgar
// —el foco, el marcado, el desplegable abierto— solo existe al usarlos.
//
// PrimeReact 10 es de una pieza: un desplegable es <Dropdown/> con props, no
// seis subcomponentes, y llega VESTIDO (el tema Lara ámbar de
// styles/vendor/_primereact.scss, en claro y oscuro). Los ejemplos usan
// vocabulario del proyecto a propósito: así se ve el ancho real que pide un
// rótulo como «Generación de tablero» y no un «Lorem» de cortesía.

// Los manejadores no llevan tipo a mano: en la v10 las props no son
// genéricas, así que TypeScript infiere el evento de cada `onChange`.
import { useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { SelectButton } from "primereact/selectbutton";
import { Slider } from "primereact/slider";
import { Cluster, Family, Specimen, SpecimenGrid } from "@/components/repository/Showcase";

const TILE_SIZES = [
  { label: "Mínima · 4 hexágonos", value: "minima" },
  { label: "Pequeña · 8 hexágonos", value: "pequena" },
  { label: "Mediana · 16 hexágonos", value: "mediana" },
  { label: "Grande · 32 hexágonos", value: "grande" },
  { label: "Enorme · 64 hexágonos", value: "enorme" },
];

const TERRAINS = [
  { label: "Llanura", value: "L" },
  { label: "Camino", value: "C" },
  { label: "Bosque", value: "B" },
  { label: "Pantano", value: "P" },
  { label: "Montaña", value: "M" },
  { label: "Vado", value: "V" },
];

const HERO_CLASSES = ["Guerrero", "Pícaro", "Mago", "Clérigo"];

const LABEL = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";

export default function FormShowcase() {
  const [seed, setSeed] = useState("peñasco-01");
  const [note, setNote] = useState("Cierra el paso por el norte; la roca no parte el camino.");
  const [tileCount, setTileCount] = useState<number | null>(9);
  const [size, setSize] = useState<string>("pequena");
  const [terrain, setTerrain] = useState<string>("B");
  const [heroClass, setHeroClass] = useState<string>(HERO_CLASSES[0]);
  const [weight, setWeight] = useState<number>(8);
  const [anchors, setAnchors] = useState<string[]>(["NE"]);
  const [showFog, setShowFog] = useState(true);

  return (
    <>
      <Family
        title="Campos de texto"
        note={
          <>
            <code>InputText</code> e <code>InputTextarea</code> son los envoltorios de{" "}
            <code>&lt;input&gt;</code> y <code>&lt;textarea&gt;</code>: aceptan los atributos
            nativos tal cual. El rótulo va <b>encima</b> y en versalitas, igual que los de sección:
            los paneles de los labs son columnas estrechas y un rótulo al lado roba la mitad del
            ancho.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Texto" hint={<code>InputText</code>}>
            <div className="w-full">
              <label htmlFor="rf-seed" className={`${LABEL} mb-1 block`}>
                Semilla
              </label>
              <InputText
                id="rf-seed"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="w-full"
              />
            </div>
          </Specimen>
          <Specimen label="Texto deshabilitado" hint="Lo que el motor deriva no se escribe a mano">
            <div className="w-full">
              <label htmlFor="rf-size" className={`${LABEL} mb-1 block`}>
                Tamaño (derivado del nº de hexágonos)
              </label>
              <InputText id="rf-size" value="Pequeña · 8" disabled className="w-full" />
            </div>
          </Specimen>
          <Specimen label="Área de texto" hint={<code>InputTextarea</code>}>
            <div className="w-full">
              <label htmlFor="rf-note" className={`${LABEL} mb-1 block`}>
                Nota de la variante
              </label>
              <InputTextarea
                id="rf-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full"
              />
            </div>
          </Specimen>
          <Specimen
            label="Número con pasos"
            hint={
              <>
                <code>InputNumber</code> con <code>showButtons</code>
              </>
            }
          >
            <div className="w-full">
              <label htmlFor="rf-count" className={`${LABEL} mb-1 block`}>
                Losetas por tablero
              </label>
              <InputNumber
                inputId="rf-count"
                value={tileCount}
                onValueChange={(e) => setTileCount(e.value ?? null)}
                min={1}
                max={30}
                showButtons
                buttonLayout="horizontal"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
                className="w-full"
              />
            </div>
          </Specimen>
        </SpecimenGrid>
      </Family>

      <Family
        title="Desplegable"
        note={
          <>
            <code>Dropdown</code> recibe las opciones por prop y las pinta él. Se monta en{" "}
            <code>document.body</code> por defecto (<code>appendTo</code>), así que el panel
            desplegado no lo recorta el contenedor del laboratorio.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Selección simple" hint={`Valor: ${size}`}>
            <div className="w-full">
              <label htmlFor="rf-tile-size" className={`${LABEL} mb-1 block`}>
                Tamaño de la variante
              </label>
              <Dropdown
                inputId="rf-tile-size"
                value={size}
                onChange={(e) => setSize(String(e.value))}
                options={TILE_SIZES}
                optionLabel="label"
                optionValue="value"
                placeholder="Elige un tamaño"
                className="w-full"
              />
            </div>
          </Specimen>
          <Specimen label="Deshabilitado" hint="Mismo componente, una prop">
            <div className="w-full">
              <label htmlFor="rf-chapter" className={`${LABEL} mb-1 block`}>
                Capítulo (aún no hay campaña)
              </label>
              <Dropdown
                inputId="rf-chapter"
                options={[]}
                disabled
                placeholder="Partida rápida"
                className="w-full"
              />
            </div>
          </Specimen>
        </SpecimenGrid>
      </Family>

      <Family
        title="Elección"
        note={
          <>
            Radios para lo <b>excluyente</b> (un hexágono tiene un terreno y solo uno), casillas
            para lo <b>acumulable</b> (una loseta tiene las anclas que haga falta). El{" "}
            <code>inputId</code> y su <code>&lt;label&gt;</code> no son opcionales: sin ellos el
            área de clic es la casilla de 22px. <code>SelectButton</code> es la misma exclusividad
            que los radios pero en botones: se usa cuando el rótulo de fuera ya dice qué se elige y
            las opciones son pocas y cortas, como la clase del héroe en{" "}
            <code>MovementLab</code>.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Radios" hint={`Terreno: ${terrain}`}>
            <div className="w-full">
              <span className={`${LABEL} mb-2 block`}>Terreno del hexágono</span>
              <div className="grid grid-cols-2 gap-y-2">
                {TERRAINS.map((t) => (
                  <div key={t.value} className="flex items-center gap-2">
                    <RadioButton
                      inputId={`rf-terrain-${t.value}`}
                      name="rf-terrain"
                      value={t.value}
                      checked={terrain === t.value}
                      onChange={(e) => setTerrain(String(e.value))}
                    />
                    <label
                      htmlFor={`rf-terrain-${t.value}`}
                      className="cursor-pointer text-sm text-[var(--wiki-text)]"
                    >
                      {t.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </Specimen>
          <Specimen label="Grupo de botones" hint={<code>SelectButton</code>}>
            <div className="w-full">
              <span className={`${LABEL} mb-2 block`}>Clase del héroe</span>
              <SelectButton
                value={heroClass}
                onChange={(e) => e.value !== null && setHeroClass(e.value)}
                options={HERO_CLASSES}
                allowEmpty={false}
              />
            </div>
          </Specimen>
          <Specimen
            label="Casillas"
            hint={anchors.length > 0 ? `Anclas: ${anchors.join(", ")}` : "Sin anclas"}
          >
            <div className="w-full">
              <span className={`${LABEL} mb-2 block`}>Anclas del contorno</span>
              <div className="grid grid-cols-2 gap-y-2">
                {["N", "NE", "SE", "S", "SO", "NO"].map((dir) => (
                  <div key={dir} className="flex items-center gap-2">
                    <Checkbox
                      inputId={`rf-anchor-${dir}`}
                      checked={anchors.includes(dir)}
                      onChange={(e) =>
                        setAnchors((prev) =>
                          e.checked ? [...prev, dir] : prev.filter((d) => d !== dir),
                        )
                      }
                    />
                    <label
                      htmlFor={`rf-anchor-${dir}`}
                      className="cursor-pointer text-sm text-[var(--wiki-text)]"
                    >
                      {dir}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </Specimen>
          <Specimen
            label="Interruptor"
            hint="Para lo que se ve al instante: enciende o apaga una capa del lienzo"
          >
            <Cluster>
              <InputSwitch
                inputId="rf-fog"
                checked={showFog}
                onChange={(e) => setShowFog(e.value)}
              />
              <label htmlFor="rf-fog" className="cursor-pointer text-sm text-[var(--wiki-text)]">
                Pintar la niebla ({showFog ? "sí" : "no"})
              </label>
            </Cluster>
          </Specimen>
          <Specimen label="Deshabilitados" hint="El estado apagado también es especimen">
            <Cluster>
              <div className="flex items-center gap-2">
                <Checkbox inputId="rf-off-a" checked disabled />
                <label htmlFor="rf-off-a" className="text-sm text-[var(--wiki-muted)]">
                  Marcada
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox inputId="rf-off-b" checked={false} disabled />
                <label htmlFor="rf-off-b" className="text-sm text-[var(--wiki-muted)]">
                  Vacía
                </label>
              </div>
            </Cluster>
          </Specimen>
        </SpecimenGrid>
      </Family>

      <Family
        title="Deslizador"
        note={
          <>
            Para ajustar a ojo mirando el resultado —el peso de un tipo en la bolsa, el radio de
            visión—, no para cifras exactas: eso es un campo numérico. Siempre con su valor escrito
            al lado, que un mango sin número no se puede reproducir en un informe.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Valor simple" hint={<code>Slider</code>}>
            <div className="w-full">
              <label className={`${LABEL} mb-2 flex items-center justify-between`}>
                <span>Peso en la bolsa</span>
                <span className="tabular-nums text-[var(--wiki-text)]">{weight}</span>
              </label>
              <Slider
                value={weight}
                onChange={(e) => setWeight(Number(e.value))}
                min={1}
                max={20}
              />
            </div>
          </Specimen>
        </SpecimenGrid>
      </Family>
    </>
  );
}
