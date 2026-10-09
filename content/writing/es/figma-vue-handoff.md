---
title: El handoff Figma → Vue que uso de verdad
description: Tokens como variables CSS, componentes con el mismo nombre 1:1, variants que se convierten en props — las pequeñas convenciones que mantienen diseño y código sincronizados sin cargar con un proceso.
date: 2026-08-03
category: Frontend
i18nKey: figmaVue
readingTime: 7 min de lectura
---

Estoy de los dos lados del handoff: diseño en Figma y desarrollo en Vue. Ese lugar me enseñó algo incómodo: la mayor parte del dolor del handoff no es un problema de herramientas, es un problema de *nombres*. El diseño dice `Primary/Hover`, el código dice `btn-main-alt`, y cada conversación sobre la UI necesita un traductor.

Nada de lo que sigue requiere un plugin, un equipo de design ops ni un "proyecto de design system". Es un puñado de convenciones que aplico en todos los proyectos, incluso en los que hago sola, porque la persona que va a traducir mi propio archivo de Figma a código tres semanas después soy yo, sin acordarme de qué quise decir.

## Los tokens viven en un solo lugar, y ese lugar es CSS

Todo valor que Figma llama *variable* (colores, escala tipográfica, radios, espaciado) se convierte en una variable CSS en el código. Con Tailwind v4 esto es buenísimo de directo, porque el theme *es* CSS:

```css
/* main.css */
@theme static {
  --font-sans: 'Inter', sans-serif;
  --font-serif: 'Instrument Serif', serif;

  --color-primary: #a11ee2;
  --color-secondary: #fac789;
  --color-heading: #0f172b;
  --color-body: #45556c;

  --radius-card: 1rem;
}
```

La regla que hace que esto funcione: **el nombre de la variable en Figma y el de la variable CSS son el mismo nombre.** `color/primary` ↔ `--color-primary`. Cuando quien diseña (yo, o el diseñador de un cliente) renombra o ajusta un token, el diff en el código es una línea, y nadie tiene que hacer ingeniería inversa para descubrir cuál de cinco violetas casi idénticos se suponía que usaba este botón.

El antipatrón son los valores hex desparramados por los templates. En el momento en que aparece un `#a11ee2` inline, ese elemento se fue en silencio del design system, y ningún cambio en Figma lo va a volver a alcanzar.

## Los componentes se mapean 1:1: mismo nombre, mismos límites

Si el archivo de Figma tiene un componente que se llama `ProjectCard`, el repo tiene `ProjectCard.vue`. No `WorkItem.vue`, ni un `Card.vue` con quince slots condicionales. Mismo nombre, mismo límite.

Parece cosmético. No lo es. El límite del componente es donde pasa cada conversación sobre una UI ("la card de testimonios se ve rara en mobile"), y cuando los límites coinciden, esa frase apunta exactamente a un archivo y a un frame de Figma. Cuando no coinciden, te toca hacer arqueología.

El corolario: **las variants se convierten en props.** Un componente de Figma con variants `size: sm | md` y `tone: default | featured` se convierte en:

```vue
<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md'
  tone?: 'default' | 'featured'
}>()
</script>
```

Mismos nombres de ejes, mismos nombres de opciones. Si una combinación de variants no existe en Figma, no debería poder expresarse en el código: para eso están los union types. Con el tiempo empecé a tratar una prop sin su variant correspondiente como una señal de alarma: o al diseño le falta un estado, o al código le creció una opción que nadie diseñó.

## El auto layout es una spec de flexbox: leelo como tal

El panel de auto layout de Figma *es* la spec de flex, escrita con otras palabras. El mapeo es mecánico:

| Figma | CSS |
|---|---|
| Direction: horizontal | `flex` (row) |
| Gap: 24 | `gap-6` |
| Padding: 16 / 24 | `px-6 py-4` |
| Hug contents | (tamaño natural, sin clase) |
| Fill container | `flex-1` / `w-full` |
| Fixed width | un `w-*` real, y una pregunta |

Dos hábitos además de la tabla. Primero, **ajustá los valores de Figma a la escala de espaciado**: un gap de 24 es `gap-6`; un gap de 23 es un error en el archivo, no un `gap-[23px]` en el código. Los valores arbitrarios son la forma en que un design system se muere de a un píxel. Segundo, tomá cada *Fixed width* como una invitación a preguntar "¿qué pasa cuando el contenido crece?": los tamaños fijos en Figma suelen ser placeholders de una regla responsive que el diseño todavía no explicitó. Mejor resolverlo en el handoff que en un reporte de bug.

## Especificá estados, no capturas

El frame estático es la parte menos interesante de un handoff. Lo que el desarrollo necesita de verdad, y lo que escribo como un bloque corto de notas al lado de cada componente en el archivo de Figma:

- **Hover / focus / active**: aunque sea "oscurecer 5%, ring en focus"
- **Vacío, cargando, error**: los estados que todos diseñamos al final y que los usuarios ven primero
- **Overflow de texto**: ¿el título se trunca, salta de línea o empuja el layout?
- **Intención de movimiento**: una línea, tipo "la card se levanta en hover, aparece con fade al scrollear, 300ms"

Cinco minutos de escritura por componente. Eso reemplaza toda la categoría de bugs del tipo "el diseño no lo decía", que en mi experiencia superan cómodamente a los de "el código lo hizo mal".

## La idea es traducir menos

Nada de esto es un proceso. No hay reunión de sincronización, ni pipeline de tokens, ni suscripción a un plugin. Es un solo principio aplicado en todas partes: **diseño y código deberían usar las mismas palabras para las mismas cosas**: nombres de tokens, de componentes, de variants, pasos de espaciado. Cada lugar donde los vocabularios coinciden es una traducción que ya no hace falta, y cada traducción que eliminás es un bug que no se puede introducir.

Esto lo ofrezco de punta a punta: la misma persona diseña el archivo y entrega la app en Nuxt, así que el costo del handoff tiende a cero. Si es el tipo de ayuda que necesita tu proyecto, [hablemos](/#contact).
