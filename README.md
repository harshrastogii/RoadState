# RoadState (Next.js + Visx)

**Live:** https://roadstate.harshrastogii.com

Interactive report on NT traffic, commuting and wet-season road access.
Built from the NT Government *Annual Traffic Report 2023* (CC-BY). Static site — no backend.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Data
The site reads `data/nt.json`, generated from the cleaned CSVs by `export_json.py`
(in the project root). To refresh after new data:
```bash
python etl.py          # produces data/clean/*.csv
python export_json.py  # writes web/data/nt.json
```

## Deploy (Vercel)
Push to GitHub, import the repo at vercel.com, framework auto-detects Next.js. Done.

Independent civic-data project; not affiliated with or endorsed by the NT Government.
