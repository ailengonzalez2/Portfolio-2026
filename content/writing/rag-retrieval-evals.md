---
title: Evaluating RAG retrieval quality
description: A practical RAG eval setup — a small gold set, recall@k and MRR, an LLM judge you can actually trust, and the dashboard that catches regressions before users do.
date: 2026-08-03
category: LLM Integration
i18nKey: ragEvals
readingTime: 8 min read
---

Every RAG pipeline demos well. You ask it three questions you already know it can answer, the answers look great, everyone ships. Then a user asks something phrased slightly differently, retrieval returns the wrong chunks, and the model — confident as ever — writes a beautiful answer grounded in the wrong context.

The failure wasn't generation. In my experience, **when a RAG system is wrong, retrieval is the culprit far more often than the model** — and retrieval is also the part almost nobody measures. This is the lightweight eval setup I use on client projects: small enough to build in a day, honest enough to catch regressions.

## Separate the two questions

A RAG answer can fail in two independent places, and mixing them up makes debugging miserable:

1. **Did we retrieve the right context?** (retrieval quality)
2. **Did the model answer faithfully from that context?** (generation quality)

Evaluate them separately. If retrieval recall is bad, no prompt engineering will save you. If retrieval is fine and answers are still wrong, *then* it's a prompting or model problem. Most teams jump straight to end-to-end "does the answer look good" checks and can never tell which knob to turn.

## Build a gold set — small is fine

The eval set that actually gets maintained is a small one. Mine are usually **30–60 questions**, built from three sources:

- **Real user questions** from logs, the moment you have any. These are gold — users phrase things in ways you never will.
- **Questions written from the docs** — for each important document, write 2–3 questions it should answer.
- **Adversarial phrasings** — the same question asked colloquially, with typos, or with vocabulary that doesn't appear in the source ("¿cuánto sale?" vs "pricing tiers").

For each question, record which chunks (or at least which documents) contain the answer:

```ts
// evals/gold.ts
export const goldSet: GoldItem[] = [
  {
    id: 'refund-window',
    question: 'How long do I have to request a refund?',
    relevantDocs: ['policies/refunds.md'],
    answerContains: ['30 days']
  }
  // ...40 more
]
```

That `answerContains` field is deliberately dumb — a substring the correct answer must include. Dumb checks are underrated: they're free, deterministic, and catch a surprising share of regressions.

## The two retrieval metrics worth computing

You don't need an IR degree. Two numbers tell you nearly everything:

**Recall@k** — for what fraction of questions does the top-k contain at least one relevant chunk? This is your ceiling: if recall@5 is 70%, then 30% of questions *cannot* be answered correctly no matter how good the model is.

**MRR (mean reciprocal rank)** — how high does the first relevant chunk rank? Two systems with identical recall@5 feel very different when one puts the answer at rank 1 and the other at rank 5, because rank affects what the model attends to — and what you can afford to include in a tight context.

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
    misses: rows.filter(r => !r.hit).map(r => r.id) // ← the actionable part
  }
}
```

The `misses` list is the real product of the eval. A recall number tells you *that* something is wrong; the list of missed questions tells you *what* — and the misses almost always cluster (all the colloquial phrasings, all the questions about one badly-chunked doc).

## Judging generation without fooling yourself

For the generation side I use an LLM judge, with two rules that keep it honest:

- **Judge faithfulness, not quality.** The question for the judge is narrow: "Is every claim in this answer supported by the provided context — yes or no, and which claim isn't?" Narrow questions get reliable judgments; "rate this answer 1–10" gets vibes.
- **Calibrate it once.** Hand-label 20 answers yourself, run the judge on the same 20, and check agreement. If the judge disagrees with you more than ~15% of the time, tighten its prompt before trusting it at scale.

The judge runs with a stronger model than the pipeline uses, and its verdict lands next to the retrieval metrics — one row per gold question.

## The dashboard is a table

My "eval dashboard" is deliberately unglamorous: a run per row, a metric per column, stored as JSON and rendered in a simple Nuxt page.

| run | change | recall@5 | MRR | faithful | dumb-checks |
|---|---|---|---|---|---|
| #14 | baseline | 0.72 | 0.58 | 0.88 | 34/41 |
| #15 | smaller chunks (400 tok) | 0.83 | 0.66 | 0.90 | 37/41 |
| #16 | + hybrid search | 0.90 | 0.74 | 0.91 | 39/41 |

What matters is that **every pipeline change gets a row before it merges**. Chunking tweak? Row. New embedding model? Row. Re-ranker? Row. The table turns "I think this made it better" into a diff you can read — and it catches the sneaky cases where a change helps one cluster of questions while quietly breaking another.

## Where the wins actually come from

Across projects, the improvements that move these numbers, in rough order of return on effort:

1. **Chunking.** Oversized chunks are the most common silent killer. Respect document structure (headings, sections) instead of fixed windows, and keep a small overlap.
2. **Hybrid search.** Vector search misses exact terms — SKUs, error codes, product names. Adding BM25 alongside embeddings and merging results is a reliable recall boost.
3. **Re-ranking.** A cross-encoder re-ranker over the top-20 fixes ordering, which shows up directly in MRR.
4. **Query rewriting.** Expanding the user's question with the model before retrieval helps colloquial phrasings find formal docs.

None of these are exotic. The eval is what tells you which one *your* system needs — instead of implementing all four and hoping.

## Takeaways

Split retrieval from generation and measure them separately. Keep the gold set small enough to maintain and seeded with real user phrasings. Track recall@k and MRR per change, read the misses instead of the averages, and keep the LLM judge on a narrow, calibrated question. A day of setup buys you the thing most RAG systems never have: the ability to know you broke something *before* your users find out.

If your team is shipping a RAG feature and flying blind on retrieval, [this is exactly the kind of setup I build](/#contact).
