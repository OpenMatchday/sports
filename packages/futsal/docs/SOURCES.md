# Futsal package sources

Retrieved 2026-11-10. Values in `rules/` and `variants/` are limited to what these publications state.

## FIFA Futsal Laws of the Game 2025-26

- PDF (FIFA publication mirrored by AFC; cover names FIFA / Bureau of the Council; effective 5 September 2025): https://assets.the-afc.com/downloads/referees/Futsal---Laws-of-the-Game-2025-2026---Sep-12-update.pdf
- Same FIFA text mirrored by DFB: https://assets.dfb.de/uploads/000/326/961/original_Futsal_Laws_of_the_Game_2025-2026_EN.pdf
- FIFA index page: https://www.fifa.com/en/futsal-laws-of-the-game
- FIFA Circular no. 1941 (5 September 2025) announces Futsal Laws of the Game 2025-2026 approval by the Bureau of the Council
- Used:
  - Law 1.3 international pitch: length 38-42 m, width 20-25 m; centre circle radius 3 m; penalty mark 6 m; 10 m mark; corner arc radius 0.25 m; goals inside 3 m x 2 m
  - Law 3.1/3.2: max five players including goalkeeper; min three to start/resume; max nine substitutes in official competitions
  - Law 7.1: two equal periods of 20 minutes playing time
  - Law 7.3: one one-minute timeout per team per period
  - Law 10.1/10.2: goal scoring; extra time two equal periods not exceeding five minutes each when required
  - Law 13.5: DFKSAF from the sixth accumulated foul per team per period
  - Notes (organisational modifications for youth / veterans / disability / grassroots): pitch, ball, goals, period duration, GK throw limitations; age bands set by FA/confederation/FIFA

## Youth variant

There is no separate FIFA youth Futsal Laws booklet for 2025-26. The youth variant cites the same 2025-26 Laws PDF Notes section that authorises organisational modifications for youth competitions. `rules/youth.json` keeps Law 7.1 20-minute halves as parent baseline when a competition elects unmodified duration.

## Package field geometry

`field.json` uses Law 1 international-match minimums (38 m x 20 m) as the shared package geometry. Competition rules may choose any size within Law 1 international ranges (length 38-42 m, width 20-25 m). Penalty-area polygons are simplified approximations of Law 1.4 quarter-circle geometry for declarative overlays; penalty/10 m marks and goal mouth widths match Law 1 distances.
