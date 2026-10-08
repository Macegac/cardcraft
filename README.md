# Cardcraft

A mobile-first character card editor that runs entirely in the browser. One HTML file, no
build step, no server.

**[Open it →](https://macegac.github.io/cardcraft/)**

## What it does

- **Import** character cards — Character Card V2/V3 (PNG or JSON), Ginger cards, Agnai,
  Pygmalion, Text Generation WebUI YAML. Drag-drop or file picker.
- **Edit** every card field: description, personality, scenario, first message, example
  messages, system prompt, post-history instructions, creator notes, tags, portrait.
- **Alternate greetings** with slot reordering.
- **Lorebook** editor — keys and content per entry.
- **Recipes** — cards saved by [Ginger](https://github.com/DominaeDev/ginger) carry their
  recipe stack. It's shown read-only with the values you set, and preserved byte-for-byte
  on export.
- **AI assist** via OpenRouter — build a whole card from a one-line concept, or
  rewrite / expand / condense / fix any field, or Smart edit: name a trait to add or take
  out and the model proposes small edits across the whole card. Every change is previewed against the
  current text and applied only when you accept it.
- **Undo / redo**, 80 steps. Typing coalesces into single steps.
- **Revert** any field to the value the card was imported with.
- **Export** as a Character Card V2 PNG or JSON.

## Your data

Cards live in your browser's IndexedDB and never leave the device — except the card
text you send to OpenRouter when you press an AI button. There is no backend.

Your OpenRouter key is stored in `localStorage` on your device only. It is never part of
the page source. Use a credit-limited key.

On iOS, browser storage can be cleared under storage pressure or after long disuse, so
treat the library as a working set and export anything you want to keep.

## Diagnostics

[`probe.html`](https://macegac.github.io/cardcraft/probe.html) checks whether a
given device supports what the app needs — chiefly `DecompressionStream`, which is
required to read Ginger's compressed recipe chunk (Safari 16.4+).

## Credits

The Ginger character-card format and the desktop application it comes from are
© DominaeDev, MIT licensed: <https://github.com/DominaeDev/ginger>.

This is an independent browser implementation of that file format. It is not affiliated
with, or endorsed by, the original project.

## Licence

MIT — see [LICENSE](LICENSE).
