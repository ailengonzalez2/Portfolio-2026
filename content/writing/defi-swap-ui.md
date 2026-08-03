---
title: Building a DeFi swap UI users don't fear
description: What I learned reducing visual noise in CaveSwap — progressive disclosure, honest numbers, and transaction states that read like sentences instead of hashes.
date: 2026-08-03
category: Web3
i18nKey: defiUi
readingTime: 7 min read
---

Swapping tokens is, functionally, a two-input form. Yet most swap UIs manage to look like a Bloomberg terminal having a bad day: exchange rates, price impact, slippage settings, route diagrams, gas estimates, USD values, pool fees — all rendered at once, all at the same visual volume.

The audience problem makes it worse. A DeFi interface serves two users at the same URL: someone making their third swap ever, and someone who checks price impact to two decimals. Working on CaveSwap, the design question was never "how do we show all this data" — it was **"who needs which number, and when?"**

## Fear comes from irreversibility, not complexity

Web apps train people that mistakes are undoable. Crypto breaks that contract: a confirmed transaction is final, and users know it. That background anxiety changes how they read your UI — every ambiguous label becomes a threat, every spinning loader a small crisis.

So the design goal isn't "simple". It's **legible under stress**. A user about to move real money re-reads everything, and the interface has to survive that suspicious second reading. Concretely:

- **The primary action names what it does.** "Swap ETH for USDC" beats "Confirm". If the button can say the consequence, it should.
- **The confirm step is a sentence, not a table.** "You pay 0.5 ETH. You receive at least 1,643.20 USDC. Rate expires in 24s." A human sentence with a worst-case number beats twelve rows of key–value pairs.
- **The worst case is explicit.** "At least" is doing real work up there — it converts slippage from a setting into a promise.

## Progressive disclosure: the volume knob

The CaveSwap redesign boiled down to sorting every data point into three tiers:

**Tier 1 — always visible:** the two amounts, the tokens, your balance of each, the primary button. That's it. This is the whole interface for the 90% case.

**Tier 2 — one tap away:** rate, price impact, minimum received, network fee, route. Collapsed into a single summary row ("1 ETH ≈ 3,291 USDC · details") that expands. Power users open it every time and that's fine — *opening it is a choice*, and the beginner never pays the cognitive cost.

**Tier 3 — settings:** slippage tolerance, deadline, expert toggles. Behind a gear icon, with defaults good enough that most users never look.

The exception that proves the rule: **warnings jump tiers.** Price impact lives in tier 2 — until it exceeds a threshold, at which point it moves into tier 1, colored, next to the button it's warning you about ("Price impact 4.8% — you're trading into thin liquidity"). Information earns screen space by being *currently important*, not by existing.

## Numbers are a UI component

DeFi numbers are user-hostile by default: 18 decimals, scientific notation, dust balances. Formatting them is real design work:

- **Balances truncate, inputs don't.** Display `1.2847 ETH`, but tapping **Max** fills the input with the exact value. Truncate an input and you've either blocked a full swap or invented dust.
- **Show fiat next to crypto.** `0.5 ETH ($1,645)` — the dollar value is what catches the extra zero *before* the confirm screen does.
- **Significant digits scale with magnitude.** `1,643.20` and `0.000032` are both four significant digits doing their job; `1,643.204818` is noise wearing a suit.
- **Never let a number silently be stale.** Quotes age. Show it: "rate updates in 12s", and re-quote before confirm if it expired. A user who swaps on a dead quote and gets a worse fill will — correctly — blame you.

## Transaction states that read like a story

Between "I clicked" and "it's done" lives the most anxious UX in software. The states need to be *narrated*:

1. **Waiting for wallet** — "Confirm in your wallet" with the wallet's icon. The #1 confusion moment: the action moved to another window and the UI should say so.
2. **Pending** — hash truncated, explorer link, elapsed time. The explorer link matters even for users who never click it: *being checkable* is what makes the state trustworthy.
3. **Confirmed** — what actually happened, with final amounts: "Swapped 0.5 ETH → 1,650.80 USDC". Received amount can differ from the quote; show the real number.
4. **Failed** — translated. "Transaction reverted: slippage exceeded — the price moved more than 0.5% while your transaction was pending. Try again or raise your tolerance." Raw RPC errors are not messages, they're stack traces with gas fees.

And when the user comes back later: pending transactions survive a page refresh. Losing track of an in-flight transaction is the single fastest way to teach someone your app can't be trusted with money.

## Restraint is the feature

The uncomfortable part of this work is that it mostly consists of *removing* things — data, borders, colors, urgency. Every element you delete makes the remaining ones more legible, and in an interface where users are already scared, legibility is the entire game. The power user loses nothing (tier 2 is one tap away); the new user gains the ability to complete a swap without feeling like they're defusing something.

I design and build these interfaces end to end — Vue/Nuxt, Wagmi/Viem, from the Figma exploration to the deployed app. If your protocol's UI is scaring users away, [I can help](/#contact).
