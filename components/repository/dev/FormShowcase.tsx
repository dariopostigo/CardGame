"use client";

// Los controles de formulario de las herramientas, vivos: un catálogo de
// campos sin estado no enseña nada, porque la mitad de lo que hay que juzgar
// —el foco, el marcado, el desplegable abierto— solo existe al usarlos.
//
// PrimeReact 11 es COMPUESTO: un desplegable no es <Dropdown/> con props, son
// Select.Root + Trigger + Popup + List, y un radio son Root + Box + Indicator.
// A cambio, el marcado es nuestro y el tema no pelea con el skin. Los ejemplos
// usan vocabulario del proyecto a propósito: así se ve el ancho real que pide
// un rótulo como «Generación de tablero» y no un «Lorem» de cortesía.

import { useState, type ChangeEvent } from "react";
// Los tipos de los eventos hay que pedirlos a mano: las props de los
// componentes de la v11 son genéricas (aceptan `as`), así que TypeScript no
// infiere el parámetro del manejador y sin esto sale un `any` implícito.
import type { UseCheckboxChangeEvent } from "@primereact/types/headless/checkbox";
import type { UseInputNumberValueChangeEvent } from "@primereact/types/headless/inputnumber";
import type { UseRadioButtonGroupValueChangeEvent } from "@primereact/types/headless/radiobuttongroup";
import type { UseSelectValueChangeEvent } from "@primereact/types/headless/select";
import type { UseSliderChangeEvent } from "@primereact/types/headless/slider";
import type { UseToggleSwitchChangeEvent } from "@primereact/types/headless/toggleswitch";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { RadioButtonGroup } from "primereact/radiobuttongroup";
import { Select } from "primereact/select";
import { Slider } from "primereact/slider";
import { Textarea } from "primereact/textarea";
import { ToggleSwitch } from "primereact/toggleswitch";
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

const LABEL = "text-xs font-semibold uppercase tracking-wide text-[var(--wiki-muted)]";

export default function FormShowcase() {
  const [seed, setSeed] = useState("peñasco-01");
  const [note, setNote] = useState("Cierra el paso por el norte; la roca no parte el camino.");
  const [tileCount, setTileCount] = useState<number | null>(9);
  const [size, setSize] = useState<string>("pequena");
  const [terrain, setTerrain] = useState<string>("B");
  const [weight, setWeight] = useState<number>(8);
  const [anchors, setAnchors] = useState<string[]>(["NE"]);
  const [showFog, setShowFog] = useState(true);

  return (
    <>
      <Family
        title="Campos de texto"
        note={
          <>
            <code>InputText</code> y <code>Textarea</code> son los dos únicos controles de la v11
            que siguen siendo de una pieza. El rótulo va <b>encima</b> y en versalitas, igual que
            los de sección: los paneles de los labs son columnas estrechas y un rótulo al lado
            roba la mitad del ancho.
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSeed(e.target.value)}
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
          <Specimen label="Área de texto" hint={<code>Textarea</code>}>
            <div className="w-full">
              <label htmlFor="rf-note" className={`${LABEL} mb-1 block`}>
                Nota de la variante
              </label>
              <Textarea
                id="rf-note"
                rows={3}
                value={note}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
                className="w-full"
              />
            </div>
          </Specimen>
          <Specimen
            label="Número con pasos"
            hint={
              <>
                <code>InputNumber.Root</code> + <code>Group</code>, <code>Decrement</code>,{" "}
                <code>Input</code>, <code>Increment</code>
              </>
            }
          >
            <div className="w-full">
              <label className={`${LABEL} mb-1 block`}>Losetas por tablero</label>
              <InputNumber.Root
                value={tileCount}
                onValueChange={(e: UseInputNumberValueChangeEvent) => setTileCount(e.value)}
                min={1}
                max={30}
              >
                <InputNumber.Group>
                  <InputNumber.Decrement>
                    <i className="pi pi-minus" />
                  </InputNumber.Decrement>
                  <InputNumber.Input />
                  <InputNumber.Increment>
                    <i className="pi pi-plus" />
                  </InputNumber.Increment>
                </InputNumber.Group>
              </InputNumber.Root>
            </div>
          </Specimen>
        </SpecimenGrid>
      </Family>

      <Family
        title="Desplegable"
        note={
          <>
            Lo que en la v10 era <code>&lt;Dropdown/&gt;</code> aquí son seis partes, y{" "}
            <code>Select.List</code> pinta las opciones solo si no le pasas hijos. Va en{" "}
            <code>Portal</code> para que el desplegable no lo recorte el panel del laboratorio.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Selección simple" hint={`Valor: ${size}`}>
            <div className="w-full">
              <label className={`${LABEL} mb-1 block`}>Tamaño de la variante</label>
              <Select.Root
                value={size}
                onValueChange={(e: UseSelectValueChangeEvent) => setSize(String(e.value))}
                options={TILE_SIZES}
                optionLabel="label"
                optionValue="value"
                className="w-full"
              >
                <Select.Trigger>
                  <Select.Value placeholder="Elige un tamaño" />
                  <Select.Indicator>
                    <i className="pi pi-chevron-down text-[0.75em]" />
                  </Select.Indicator>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner>
                    <Select.Popup>
                      <Select.List />
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
            </div>
          </Specimen>
          <Specimen label="Deshabilitado" hint="Mismo marcado, prop en la raíz">
            <div className="w-full">
              <label className={`${LABEL} mb-1 block`}>Capítulo (aún no hay campaña)</label>
              <Select.Root options={[]} disabled className="w-full">
                <Select.Trigger>
                  <Select.Value placeholder="Partida rápida" />
                  <Select.Indicator>
                    <i className="pi pi-chevron-down text-[0.75em]" />
                  </Select.Indicator>
                </Select.Trigger>
              </Select.Root>
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
            área de clic es la casilla de 14px.
          </>
        }
      >
        <SpecimenGrid>
          <Specimen label="Radios" hint={`Terreno: ${terrain}`}>
            <div className="w-full">
              <span className={`${LABEL} mb-2 block`}>Terreno del hexágono</span>
              <RadioButtonGroup
                name="rf-terrain"
                value={terrain}
                onValueChange={(e: UseRadioButtonGroupValueChangeEvent) => setTerrain(String(e.value))}
              >
                <div className="grid grid-cols-2 gap-y-2">
                  {TERRAINS.map((t) => (
                    <div key={t.value} className="flex items-center gap-2">
                      <RadioButton.Root value={t.value} inputId={`rf-terrain-${t.value}`}>
                        <RadioButton.Box>
                          <RadioButton.Indicator />
                        </RadioButton.Box>
                      </RadioButton.Root>
                      <label
                        htmlFor={`rf-terrain-${t.value}`}
                        className="cursor-pointer text-sm text-[var(--wiki-text)]"
                      >
                        {t.label}
                      </label>
                    </div>
                  ))}
                </div>
              </RadioButtonGroup>
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
                    <Checkbox.Root
                      inputId={`rf-anchor-${dir}`}
                      checked={anchors.includes(dir)}
                      onCheckedChange={(e: UseCheckboxChangeEvent) =>
                        setAnchors((prev) =>
                          e.checked ? [...prev, dir] : prev.filter((d) => d !== dir),
                        )
                      }
                    >
                      <Checkbox.Box>
                        <Checkbox.Indicator />
                      </Checkbox.Box>
                    </Checkbox.Root>
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
              <ToggleSwitch.Root
                inputId="rf-fog"
                checked={showFog}
                onCheckedChange={(e: UseToggleSwitchChangeEvent) => setShowFog(e.checked)}
              >
                <ToggleSwitch.Control>
                  <ToggleSwitch.Handle />
                </ToggleSwitch.Control>
              </ToggleSwitch.Root>
              <label
                htmlFor="rf-fog"
                className="cursor-pointer text-sm text-[var(--wiki-text)]"
              >
                Pintar la niebla ({showFog ? "sí" : "no"})
              </label>
            </Cluster>
          </Specimen>
          <Specimen label="Deshabilitados" hint="El estado apagado también es especimen">
            <Cluster>
              <div className="flex items-center gap-2">
                <Checkbox.Root inputId="rf-off-a" checked disabled>
                  <Checkbox.Box>
                    <Checkbox.Indicator />
                  </Checkbox.Box>
                </Checkbox.Root>
                <label htmlFor="rf-off-a" className="text-sm text-[var(--wiki-muted)]">
                  Marcada
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox.Root inputId="rf-off-b" disabled>
                  <Checkbox.Box>
                    <Checkbox.Indicator />
                  </Checkbox.Box>
                </Checkbox.Root>
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
          <Specimen label="Valor simple" hint={<code>Slider.Root + Track + Range + Handle</code>}>
            <div className="w-full">
              <label className={`${LABEL} mb-2 flex items-center justify-between`}>
                <span>Peso en la bolsa</span>
                <span className="tabular-nums text-[var(--wiki-text)]">{weight}</span>
              </label>
              <Slider.Root
                value={weight}
                onValueChange={(e: UseSliderChangeEvent) => setWeight(Number(e.value))}
                min={1}
                max={20}
              >
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Handle />
              </Slider.Root>
            </div>
          </Specimen>
        </SpecimenGrid>
      </Family>
    </>
  );
}
