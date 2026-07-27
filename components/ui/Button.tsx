// Botón de las herramientas: el de la wiki, los laboratorios y los dos
// repositorios. Un <button> nuestro con las clases de styles/components/
// _button.scss, no el Button de PrimeReact: en la v11 los componentes llegan
// sin CSS —el preset Aura trae los tokens pero su hoja de estilo está vacía—
// y un <Button> se pinta como texto pelado. Lo único que aportaba era el
// ripple, que en un panel de mando no hace falta.
//
// Se exporta también `buttonClass()` porque los labs ya tienen sus <button>
// escritos y lo que necesitaban no era un componente nuevo, era dejar de
// tener la misma función de clases copiada en dos archivos.

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "neutral" | "primary" | "ghost" | "danger";

export type ButtonLook = {
  /** Peso visual. Por defecto la neutra, la de los paneles de mando. */
  variant?: ButtonVariant;
  /** Conmutación encendida (un «Giro 60°» seleccionado). Es estado, no variante. */
  active?: boolean;
  size?: "sm" | "md";
  /** Cuadrado, sin rótulo. Exige `aria-label`. */
  iconOnly?: boolean;
  /** Ocupa todo el ancho disponible. */
  block?: boolean;
};

/** Las clases del botón, para los <button> que ya existen en los labs. */
export function buttonClass(look: ButtonLook = {}, extra?: string): string {
  const { variant = "neutral", active = false, size = "md", iconOnly, block } = look;

  return [
    "ui-button",
    `ui-button--${variant}`,
    active && "ui-button--active",
    size === "sm" && "ui-button--sm",
    iconOnly && "ui-button--icon",
    block && "ui-button--block",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

type ButtonProps = ButtonLook &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    className?: string;
    children?: ReactNode;
  };

export default function Button({
  variant,
  active,
  size,
  iconOnly,
  block,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, active, size, iconOnly, block }, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
