# PokéTypeDex

A Pokemon type effectiveness app for web and mobile. Look up type matchups, search the Pokédex, and simulate battles — all in real time with no submit buttons.

**Live:** [pokemon-types-liart.vercel.app](https://pokemon-types-liart.vercel.app)

---

## Features

### Type Chart (`/types`)
Select 1 or 2 Pokemon types from the icon grid and instantly see:
- **Offensive matchups** — what your types hit super effectively, not very effectively, or not at all
- **Defensive matchups** — what hits you hard, what you resist, and what you're immune to
- Supports dual-type combinations with combined multipliers (e.g. 4× weakness, ¼× resistance)

### Pokédex Search (`/pokemon`)
Search any of the 1,300+ Pokemon by name with autocomplete. Select one and it auto-fills its types and shows the full matchup breakdown.

### Battle (`/battle`)
Pick two Pokemon and see who has the type edge:
- **Advantage bar** — animated tug-of-war bar showing who has the type advantage
- **Type matchup breakdown** — what each Pokemon's types hit against the opponent specifically
- **Base stats comparison** — HP, Attack, Defense, Sp. Atk, Sp. Def, Speed side by side
- **Pokédex flavor text** — description for each Pokemon from the latest game

---

## Stack

| Tool | Purpose |
|---|---|
| React + Vite | Core framework |
| React Router v6 | Client-side routing |
| TanStack Query | PokeAPI data fetching & caching |
| Framer Motion | Animations |
| Lucide React | UI icons |

**Data:** Type effectiveness chart is bundled locally (Gen 9). Pokemon data is fetched from [PokeAPI](https://pokeapi.co). Type icons from [duiker101/pokemon-type-svg-icons](https://github.com/duiker101/pokemon-type-svg-icons).

---

## Running Locally

```bash
git clone https://github.com/seb-rios/pokemon-types.git
cd pokemon-types
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Dark & Light Mode

Toggle in the side drawer or top bar. Preference is saved to `localStorage`.
