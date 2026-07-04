"""
export_json.py — turns the cleaned CSVs (data/clean/*.csv) into a single
JSON payload the Next.js site imports at build time. Run after etl.py:
    python export_json.py
Output: web/data/nt.json
"""
import pandas as pd, json, pathlib

CLEAN = pathlib.Path("data/clean")
if not (CLEAN / "aadt_10yr.csv").exists():           # fallback: repo root
    CLEAN = pathlib.Path(".")
OUT = pathlib.Path("web/data"); OUT.mkdir(parents=True, exist_ok=True)

MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
WET = {"Nov","Dec","Jan","Feb","Mar"}
COORDS = {"Darwin":[-12.46,130.84],"Katherine":[-14.46,132.26],
          "Tennant Creek":[-19.65,134.19],"Alice Springs":[-23.70,133.88],
          "Regional / Remote":[-18.50,133.50]}

aadt = pd.read_csv(CLEAN/"aadt_10yr.csv")
madt = pd.read_csv(CLEAN/"madt.csv")
clos = pd.read_csv(CLEAN/"closures.csv")
try: bike = pd.read_csv(CLEAN/"bike_madt.csv")
except FileNotFoundError: bike = pd.DataFrame()

LATEST = int(aadt.year.max())
latest = aadt[aadt.year == LATEST]

def num(x):
    try: return int(x)
    except Exception: return None

# regional totals (latest year)
region_totals = (latest.groupby("region").aadt.sum().reset_index()
                 .sort_values("aadt", ascending=False))
regions = [{"region":r.region,"aadt":int(r.aadt),
            "lat":COORDS.get(r.region,[None,None])[0],
            "lon":COORDS.get(r.region,[None,None])[1]}
           for r in region_totals.itertuples()]

darwin_share = (latest[latest.region=="Darwin"].aadt.sum()/latest.aadt.sum()
                if latest.aadt.sum() else 0)
busiest = latest.loc[latest.aadt.idxmax()]

# busiest roads (latest) — one row per road (max across its stations)
road_agg = (latest.groupby(["road","region"]).aadt.max().reset_index()
            .sort_values("aadt",ascending=False)
            .drop_duplicates(subset=["road"]).head(25))
top_roads = [{"road":r.road,"region":r.region,"aadt":int(r.aadt)}
             for r in road_agg.itertuples()]

# 10-yr trend per road (only roads with 3+ points)
trends = {}
for road, g in aadt.groupby("road"):
    s = g.groupby("year").aadt.mean().reset_index().sort_values("year")
    if len(s) >= 3:
        trends[str(road)] = [{"year":int(x.year),"aadt":int(x.aadt)} for x in s.itertuples()]

# monthly commute rhythm (avg across all MADT stations)
present = [mo for mo in MONTHS if mo in madt.columns]
monthly = [{"month":mo,"adt":num(madt[mo].mean())} for mo in present]

# bike seasonality
bike_series = []
if not bike.empty:
    bp = [mo for mo in MONTHS if mo in bike.columns]
    seen=set()
    for r in bike.itertuples():
        nm=getattr(r,"road")
        if nm in seen: continue
        seen.add(nm)
        bike_series.append({"road":nm,
            "values":[{"month":mo,"riders":num(getattr(r,mo))} for mo in bp]})

# closures by start month + wet/dry
bym = clos.dropna(subset=["start_month"]).groupby("start_month").size()
closures_by_month = [{"month":mo,"events":int(bym.get(mo,0)),
                      "season":"Wet" if mo in WET else "Dry"} for mo in MONTHS]
wet_pct = round(100*clos[clos.start_month.isin(WET)].shape[0]/len(clos)) if len(clos) else 0

# category breakdown
cats = clos.category.value_counts().reset_index()
cats.columns = ["category","count"]
categories = [{"category":c.category,"count":int(c.count)} for c in cats.itertuples()]

# longest-affected
longest = (clos.dropna(subset=["days_affected"])
           .sort_values("days_affected",ascending=False)
           .drop_duplicates(subset=["road"]).head(12))
longest_roads = [{"road":r.road,"days":int(r.days_affected),"category":r.category}
                 for r in longest.itertuples()]

# full register
def clean(v): return None if pd.isna(v) else v
register = [{"road":clean(r.road),"location":clean(r.location),
             "days":num(r.days_affected) if pd.notna(r.days_affected) else None,
             "months":clean(r.months_affected),
             "restriction":clean(r.restriction_type),"category":clean(r.category)}
            for r in clos.itertuples()]

payload = {
    "meta":{"latest":LATEST,"stations":int(aadt.station.nunique()),
            "regionCount":int(aadt.region.nunique()),
            "closureCount":int(len(clos)),"wetPct":wet_pct,
            "darwinShare":round(100*darwin_share),
            "busiest":{"road":busiest.road,"region":busiest.region,"aadt":int(busiest.aadt)}},
    "regions":regions,"topRoads":top_roads,"trends":trends,
    "monthly":monthly,"bike":bike_series,
    "closuresByMonth":closures_by_month,"categories":categories,
    "longestRoads":longest_roads,"register":register,
}

(OUT/"nt.json").write_text(json.dumps(payload,separators=(",",":")))
print("wrote web/data/nt.json |", len(register),"closures |",
      len(top_roads),"roads |",len(trends),"trend series | wet%",wet_pct,
      "| darwin%",round(100*darwin_share))
