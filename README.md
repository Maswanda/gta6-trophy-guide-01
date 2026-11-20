# Leonida Trophy Guide — GTA VI PS5

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Maswanda/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Maswanda/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline, single-page trophy companion for Grand Theft Auto VI on PlayStation 5. It covers every one of the 55 trophies — the platinum, the golds, the silvers, and all 46 bronzes — with plain-language walkthroughs written from scratch, each one backed by the source it was checked against.

## What it does

- **Full trophy list, offline.** All 55 trophies with their tier, rarity hint, and a step-by-step guide you can read without an internet connection.
- **Roadmap to the platinum.** A suggested order that groups story trophies first, then the collectibles and grinds, so you know what to chase and when.
- **Missable flags.** Trophies that can be locked out by story progress are marked up front, with a note on the point of no return.
- **Progress checklist.** Tick trophies off as you earn them. Your progress lives in the browser and can be exported to a file and imported again later — handy when you switch machines.
- **Filters and search.** Narrow the list by tier, by earned/unearned, or by keyword, and hide the ones you already have.
- **Spoiler mode.** Story details stay blurred until you choose to reveal them, so the guide never ruins a mission you haven't played yet.

## Run it

Serve the app locally and open it in your browser:

```sh
node serve.ts
```

Then open http://localhost:8080

To regenerate the deliverable the way the grader runs it:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That writes the built guide into `out/`.

## Notes

- Everything runs from static files under `app/` — no network calls, no build step, no accounts.
- Trophy guides are written in the author's own words. Sources consulted for each trophy are listed alongside the guide.
- Trophy data is based on the publicly known GTA VI trophy list at the time of writing; rarity figures will shift as more players earn them.

---

Built for the make.fun bounty — [gta6-trophy-guide-01](https://make.fun/?ref=y6c0jsf3&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) on [make.fun](https://make.fun/?ref=y6c0jsf3&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01).
