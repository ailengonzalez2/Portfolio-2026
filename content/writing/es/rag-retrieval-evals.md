---
title: Evaluar la calidad de retrieval en RAG
description: Un setup práctico de evals para RAG — un gold set chico, recall@k y MRR, un LLM judge en el que realmente podés confiar y el dashboard que detecta regresiones antes que los usuarios.
date: 2026-08-03
category: LLM Integration
i18nKey: ragEvals
readingTime: 8 min de lectura
---

Todo pipeline de RAG luce bien en una demo. Le hacés tres preguntas que ya sabés que puede responder, las respuestas se ven geniales, todos lanzan. Después un usuario pregunta algo formulado un poquito distinto, el retrieval devuelve los chunks equivocados y el modelo — seguro como siempre — escribe una respuesta hermosa basada en el contexto equivocado.

La falla no estuvo en la generación. En mi experiencia, **cuando un sistema RAG se equivoca, el culpable es el retrieval muchísimo más seguido que el modelo** — y el retrieval es también la parte que casi nadie mide. Este es el setup de evals liviano que uso en proyectos de clientes: lo bastante chico para armarlo en un día, lo bastante honesto para detectar regresiones.

## Separá las dos preguntas

Una respuesta de RAG puede fallar en dos lugares independientes, y mezclarlos hace que debuggear sea un infierno:

1. **¿Recuperamos el contexto correcto?** (calidad de retrieval)
2. **¿El modelo respondió fielmente a partir de ese contexto?** (calidad de generación)

Evalualas por separado. Si el recall del retrieval es malo, ningún prompt engineering te va a salvar. Si el retrieval está bien y las respuestas siguen siendo incorrectas, *ahí sí* es un problema de prompting o del modelo. La mayoría de los equipos salta directo a checks end-to-end de "¿la respuesta se ve bien?" y nunca puede saber qué perilla tocar.

## Armá un gold set — chico está bien

El set de evals que de verdad se mantiene es uno chico. Los míos suelen tener **30–60 preguntas**, armadas a partir de tres fuentes:

- **Preguntas reales de usuarios** sacadas de los logs, apenas tengas alguna. Son oro — los usuarios formulan las cosas de maneras que a vos nunca se te ocurrirían.
- **Preguntas escritas a partir de la documentación** — para cada documento importante, escribí 2–3 preguntas que debería responder.
- **Formulaciones adversariales** — la misma pregunta hecha de forma coloquial, con typos o con vocabulario que no aparece en la fuente ("¿cuánto sale?" vs "pricing tiers").

Para cada pregunta, registrá qué chunks (o al menos qué documentos) contienen la respuesta:

```ts
// evals/gold.ts
export const goldSet: GoldItem[] = [
  {
    id: 'refund-window',
    question: 'How long do I have to request a refund?',
    relevantDocs: ['policies/refunds.md'],
    answerContains: ['30 days']
  }
  // ...40 más
]
```

Ese campo `answerContains` es tonto a propósito — un substring que la respuesta correcta tiene que incluir. Los checks tontos están subestimados: son gratis, deterministas y detectan una parte sorprendente de las regresiones.

## Las dos métricas de retrieval que vale la pena calcular

No necesitás un título en information retrieval. Dos números te dicen casi todo:

**Recall@k** — ¿en qué proporción de las preguntas el top-k contiene al menos un chunk relevante? Ese es tu techo: si el recall@5 es 70%, entonces el 30% de las preguntas *no se pueden* responder bien, por más bueno que sea el modelo.

**MRR (mean reciprocal rank)** — ¿qué tan arriba aparece el primer chunk relevante? Dos sistemas con el mismo recall@5 se sienten muy distintos cuando uno pone la respuesta en el puesto 1 y el otro en el puesto 5, porque la posición afecta a qué le presta atención el modelo — y qué podés darte el lujo de incluir en un contexto ajustado.

```ts
const evalRetrieval = async (gold: GoldItem[], k = 5) => {
  const rows = []
  for (const item of gold) {
    const hits = await retrieve(item.question, k)
    const rank = hits.findIndex(h => item.relevantDocs.includes(h.doc)) + 1
    rows.push({ id: item.id, hit: rank > 0, rr: rank > 0 ? 1 / rank : 0 })
  }
  return {
    recallAtK: rows.filter(r => r.hit).length / rows.length,
    mrr: rows.reduce((s, r) => s + r.rr, 0) / rows.length,
    misses: rows.filter(r => !r.hit).map(r => r.id) // ← la parte accionable
  }
}
```

La lista de `misses` es el verdadero producto del eval. Un número de recall te dice *que* algo anda mal; la lista de preguntas falladas te dice *qué* — y los misses casi siempre se agrupan (todas las formulaciones coloquiales, todas las preguntas sobre un doc mal chunkeado).

## Evaluar la generación sin engañarte

Para el lado de la generación uso un LLM judge, con dos reglas que lo mantienen honesto:

- **Evaluá fidelidad, no calidad.** La pregunta para el judge es acotada: "¿Cada afirmación de esta respuesta está respaldada por el contexto provisto — sí o no, y cuál no?" Las preguntas acotadas dan juicios confiables; "puntuá esta respuesta del 1 al 10" da sensaciones.
- **Calibralo una vez.** Etiquetá 20 respuestas a mano, corré el judge sobre esas mismas 20 y fijate cuánto coinciden. Si el judge no está de acuerdo con vos más del ~15% de las veces, ajustá su prompt antes de confiar en él a escala.

El judge corre con un modelo más potente que el que usa el pipeline, y su veredicto queda al lado de las métricas de retrieval — una fila por pregunta del gold set.

## El dashboard es una tabla

Mi "dashboard de evals" es poco glamoroso a propósito: una corrida por fila, una métrica por columna, guardado como JSON y renderizado en una página simple de Nuxt.

| corrida | cambio | recall@5 | MRR | fiel | checks tontos |
|---|---|---|---|---|---|
| #14 | baseline | 0.72 | 0.58 | 0.88 | 34/41 |
| #15 | chunks más chicos (400 tok) | 0.83 | 0.66 | 0.90 | 37/41 |
| #16 | + búsqueda híbrida | 0.90 | 0.74 | 0.91 | 39/41 |

Lo que importa es que **cada cambio en el pipeline tenga su fila antes de mergearse**. ¿Un ajuste de chunking? Fila. ¿Un modelo de embeddings nuevo? Fila. ¿Re-ranker? Fila. La tabla convierte el "me parece que esto lo mejoró" en un diff que podés leer — y detecta los casos traicioneros donde un cambio ayuda a un grupo de preguntas mientras rompe otro en silencio.

## De dónde salen realmente las mejoras

En todos los proyectos, las mejoras que mueven estos números, más o menos ordenadas por retorno sobre el esfuerzo:

1. **Chunking.** Los chunks demasiado grandes son el asesino silencioso más común. Respetá la estructura del documento (títulos, secciones) en vez de usar ventanas fijas, y dejá un pequeño solapamiento.
2. **Búsqueda híbrida.** La búsqueda vectorial se pierde términos exactos — SKUs, códigos de error, nombres de producto. Sumar BM25 junto a los embeddings y combinar los resultados es una mejora de recall confiable.
3. **Re-ranking.** Un re-ranker cross-encoder sobre el top-20 arregla el orden, y eso se ve directo en el MRR.
4. **Reescritura de queries.** Expandir la pregunta del usuario con el modelo antes del retrieval ayuda a que las formulaciones coloquiales encuentren los docs formales.

Ninguna de estas es exótica. El eval es lo que te dice cuál necesita *tu* sistema — en vez de implementar las cuatro y cruzar los dedos.

## Conclusiones

Separá retrieval de generación y medilos por separado. Mantené el gold set lo bastante chico como para poder mantenerlo, y sembralo con formulaciones reales de usuarios. Seguí recall@k y MRR en cada cambio, leé los misses en vez de los promedios y mantené al LLM judge con una pregunta acotada y calibrada. Un día de setup te da lo que la mayoría de los sistemas RAG nunca tiene: la capacidad de saber que rompiste algo *antes* de que se enteren tus usuarios.

Si tu equipo está lanzando una feature de RAG y va a ciegas con el retrieval, [este es exactamente el tipo de setup que armo](/#contact).
