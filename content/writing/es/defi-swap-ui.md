---
title: Construir una UI de swap DeFi que no asuste
description: Lo que aprendí reduciendo el ruido visual en CaveSwap — progressive disclosure, números honestos y estados de transacción que se leen como frases y no como hashes.
date: 2026-08-03
category: Web3
i18nKey: defiUi
readingTime: 7 min de lectura
---

Hacer un swap de tokens es, en lo funcional, un formulario de dos inputs. Y sin embargo la mayoría de las UIs de swap logran parecer una terminal de Bloomberg en un mal día: tipos de cambio, price impact, configuración de slippage, diagramas de rutas, estimaciones de gas, valores en USD, fees del pool. Todo renderizado a la vez, todo al mismo volumen visual.

El problema de audiencia lo empeora. Una interfaz DeFi atiende a dos usuarios en la misma URL: alguien que está haciendo su tercer swap en la vida y alguien que mira el price impact con dos decimales. Trabajando en CaveSwap, la pregunta de diseño nunca fue "¿cómo mostramos todos estos datos?", sino **"¿quién necesita qué número, y cuándo?"**

## El miedo viene de la irreversibilidad, no de la complejidad

Las web apps acostumbran a la gente a que los errores se pueden deshacer. Crypto rompe ese contrato: una transacción confirmada es definitiva, y los usuarios lo saben. Esa ansiedad de fondo cambia cómo leen tu UI: cada label ambiguo se vuelve una amenaza, cada loader girando, una pequeña crisis.

Entonces el objetivo de diseño no es "simple". Es **legible bajo estrés**. Alguien a punto de mover plata real relee todo, y la interfaz tiene que aguantar esa segunda lectura desconfiada. En concreto:

- **La acción principal dice lo que hace.** "Swap ETH for USDC" le gana a "Confirmar". Si el botón puede decir la consecuencia, que la diga.
- **El paso de confirmación es una frase, no una tabla.** "Pagás 0.5 ETH. Recibís al menos 1,643.20 USDC. El precio vence en 24s." Una frase humana con el número del peor caso le gana a doce filas de clave–valor.
- **El peor caso es explícito.** Ese "al menos" de ahí arriba hace un trabajo real: convierte el slippage de una configuración en una promesa.

## Progressive disclosure: la perilla de volumen

El rediseño de CaveSwap se redujo a ordenar cada dato en tres niveles:

**Nivel 1, siempre visible:** los dos montos, los tokens, tu balance de cada uno, el botón principal. Nada más. Esa es toda la interfaz para el 90% de los casos.

**Nivel 2, a un tap:** precio, price impact, mínimo a recibir, fee de red, ruta. Colapsado en una sola fila de resumen ("1 ETH ≈ 3,291 USDC · detalles") que se expande. Los power users la abren siempre y está perfecto: *abrirla es una elección*, y el principiante nunca paga el costo cognitivo.

**Nivel 3, configuración:** tolerancia de slippage, deadline, toggles para expertos. Detrás de un ícono de engranaje, con defaults lo bastante buenos como para que la mayoría nunca lo mire.

La excepción que confirma la regla: **las advertencias saltan de nivel.** El price impact vive en el nivel 2, hasta que supera un umbral; en ese momento pasa al nivel 1, con color, al lado del botón sobre el que te está advirtiendo ("Price impact 4.8%: estás operando contra poca liquidez"). La información se gana su lugar en pantalla por ser *importante ahora*, no por existir.

## Los números son un componente de UI

Los números en DeFi son hostiles por defecto: 18 decimales, notación científica, balances de polvo. Formatearlos es trabajo de diseño de verdad:

- **Los balances se truncan, los inputs no.** Mostrá `1.2847 ETH`, pero al tocar **Max** el input se completa con el valor exacto. Si truncás un input, o bloqueaste un swap completo o inventaste polvo.
- **Mostrá el valor en fiat al lado del crypto.** `0.5 ETH ($1,645)`: el valor en dólares es lo que detecta el cero de más *antes* que la pantalla de confirmación.
- **Los dígitos significativos escalan con la magnitud.** `1,643.20` y `0.000032` son, los dos, cuatro dígitos significativos haciendo su trabajo; `1,643.204818` es ruido de traje y corbata.
- **Nunca dejes que un número quede viejo en silencio.** Las cotizaciones envejecen. Mostralo: "el precio se actualiza en 12s", y volvé a cotizar antes de confirmar si venció. Un usuario que hace un swap con una cotización muerta y obtiene un precio peor te va a echar la culpa, y con razón.

## Estados de transacción que se leen como una historia

Entre "hice clic" y "listo" vive la UX más angustiante del software. Los estados tienen que estar *narrados*:

1. **Esperando la wallet**: "Confirmá en tu wallet", con el ícono de la wallet. Es el momento de confusión número uno: la acción se pasó a otra ventana y la UI lo tiene que decir.
2. **Pendiente**: hash truncado, link al explorer, tiempo transcurrido. El link al explorer importa incluso para quienes nunca lo tocan: *que se pueda verificar* es lo que hace confiable al estado.
3. **Confirmada**: lo que pasó de verdad, con los montos finales: "Swapped 0.5 ETH → 1,650.80 USDC". El monto recibido puede diferir de la cotización; mostrá el número real.
4. **Fallida**: traducida. "Transacción revertida: se superó el slippage. El precio se movió más de 0.5% mientras tu transacción estaba pendiente. Probá de nuevo o subí tu tolerancia." Los errores crudos de RPC no son mensajes, son stack traces con fees de gas.

Y cuando el usuario vuelve más tarde: las transacciones pendientes sobreviven a un refresh de la página. Perderle el rastro a una transacción en curso es la forma más rápida de enseñarle a alguien que no se le puede confiar plata a tu app.

## La contención es la feature

La parte incómoda de este trabajo es que consiste sobre todo en *sacar* cosas: datos, bordes, colores, urgencia. Cada elemento que eliminás hace más legibles los que quedan, y en una interfaz donde los usuarios ya tienen miedo, la legibilidad es todo el juego. El power user no pierde nada (el nivel 2 está a un tap); el usuario nuevo gana la posibilidad de completar un swap sin sentir que está desactivando una bomba.

Diseño y desarrollo estas interfaces de punta a punta: Vue/Nuxt, Wagmi/Viem, desde la exploración en Figma hasta la app deployada. Si la UI de tu protocolo está espantando usuarios, [te puedo ayudar](/#contact).
