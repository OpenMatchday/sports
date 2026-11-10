# Basketball package sources

Retrieved 2026-11-10. Values in `rules/` and `variants/` are limited to what these publications state.

## FIBA

- PDF: https://assets.fiba.basketball/image/upload/documents-corporate-fiba-official-rules-2026-v1-1.pdf
- Index: https://about.fiba.basketball/en/services/resource-hub/downloads
- News (in force 1 October 2026): https://about.fiba.basketball/en/news/fiba-official-basketball-rules-2026-to-take-effect-october-1
- Used: Art. 2 court 28 m x 15 m; Art. 4 max 12 entitled players / 5 on court; Art. 8 four 10-minute quarters + 5-minute overtimes; Art. 16 scoring 1/2/3; Art. 29 24-second shot clock; centre circle radius 1.80 m; 3-point arc radius 6.75 m; basket centre 1.575 m from endline mid-point; free-throw line furthest edge 5.80 m from endline and 3.60 m long (restricted-area width).

## NBA

- PDF: https://cdn.nba.com/manage/2026/01/Official-2025-26-NBA-Playing-Rules.pdf
- Used: court diagram length 94 feet (inside); Rule 3 five players; Rule 5 scoring 1/2/3 and twelve-minute periods / five-minute overtime; Rule 7 24-second shot clock.

## NCAA Men's

- Landing: https://www.ncaa.org/championships/playing-rules/mens-basketball-playing-rules/
- Rules book text verified from the 2025-26 Men's Basketball Rules Book (August 2025 publication line in that book).
- Used: Rule 1 court 94 ft x 50 ft; Rule 3 five players to start; Rule 5 two 20-minute halves, five-minute extra periods, scoring 1/2/3; 30-second shot clock (timer / shot-clock provisions).

## Youth (Mini-Basketball)

- PDF: https://assets.fiba.basketball/image/upload/documents-corporate-mini-basketball-mini-basketball-coaches-manual-eng.pdf
- Index Mini Basketball section: https://about.fiba.basketball/en/services/resource-hub/downloads
- Used: section 5.2 (shot clock not before U14; quarter-based competition modifications); section 5.3/5.4 (3x3/4x4 options). Period length not fixed by the manual; `rules/youth.json` documents FIBA Art. 8.1 as parent baseline only.

## Package field geometry

`field.json` uses FIBA Art. 2 metric court (28 m x 15 m) as the shared package geometry. NBA/NCAA imperial courts are recorded in variant notes and this file; per-variant field files are out of schema scope for v0.1.0.
