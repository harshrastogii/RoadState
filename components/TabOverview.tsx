"use client";
import {nt,C,fmt} from "@/lib/data";
import {HBar} from "./Charts";
import RegionMap from "./RegionMap";

const AUD=[
 ["Travellers & grey nomads","Driving the Territory Nov–Mar? These roads have historically flooded and stayed cut for days. Time your trip or pick an alternate route before you set off."],
 ["Remote community residents","If your access road is one of the long-affected ones, the pattern is your early warning — stock up on essentials and medical supplies before the wet closes it in."],
 ["Councils & road authorities","Closures cluster predictably on the same roads each wet. Pre-position drainage and sealing budget on the worst offenders before December, not after."],
 ["Emergency services & police","Wet-season cut-offs and high-volume corridors are where rescues, diversions and crash risk concentrate. Pre-stage crews by season, not by surprise."],
 ["Freight & tourism operators","Supply runs and tours can route around the predictable cut-off windows — protecting delivery schedules and bookings a mid-wet closure would wreck."],
];

export default function TabOverview(){
  const {meta,regions}=nt;
  const bars=regions.map(r=>({label:r.region,value:r.aadt}));
  return <section className="tab">
    <div className="hero fadeUp">
      <div className="num">{meta.wetPct}%</div>
      <div className="txt">of the Territory’s {fmt(meta.closureCount)} road closures and restrictions
        in {meta.latest} <b>began in the Nov–Mar wet season.</b> The disruption isn’t random — it
        arrives on a schedule.</div>
    </div>

    <div className="strip">
      <div className="stat fadeUp"><div className="v">{fmt(meta.busiest.aadt)}</div>
        <div className="l">Busiest road · veh/day</div>
        <div className="s">{meta.busiest.road}, {meta.busiest.region}</div></div>
      <div className="stat fadeUp" style={{animationDelay:".1s"}}><div className="v">{meta.darwinShare}%</div>
        <div className="l">Traffic that sits in Darwin</div>
        <div className="s">congestion is a Darwin story — the rest of the NT isn’t busy</div></div>
      <div className="stat fadeUp" style={{animationDelay:".18s"}}><div className="v">{fmt(meta.closureCount)}</div>
        <div className="l">Closures & restrictions · {meta.latest}</div>
        <div className="s">across the counted network</div></div>
    </div>

    <div className="grid2">
      <div className="card">
        <div className="eyebrow">Fig. 1</div>
        <h2 className="sec">Traffic activity by region</h2>
        <div className="cap">Total daily vehicle volume across counted roads, {meta.latest}</div>
        <HBar data={bars} height={280} colorFn={d=>d.label==="Darwin"?C.wet:C.muted}/>
        <div className="read"><b>In plain terms:</b> Darwin’s roads carry far more traffic than every
          other region combined. Elsewhere, volumes are low — so “traffic” as a daily problem is really
          a Darwin phenomenon.</div>
      </div>
      <div className="card">
        <div className="eyebrow">Fig. 2</div>
        <h2 className="sec">Where the traffic sits</h2>
        <div className="cap">Bubble size = total daily volume · hover a region</div>
        <RegionMap height={280}/>
        <div className="read"><b>In plain terms:</b> one big bubble over Darwin, small ones everywhere
          else — the map makes the imbalance obvious at a glance.</div>
      </div>
    </div>

    <div style={{marginTop:30}}>
      <div className="eyebrow">Who it’s for</div>
      <h2 className="sec">What this means for you</h2>
      <div className="cap">The same finding, read five ways</div>
      <div className="auds">
        {AUD.map(([who,what],i)=><div key={who} className="aud" style={{animationDelay:`${i*0.08}s`}}>
          <div className="who">{who}</div><div className="what">{what}</div></div>)}
      </div>
    </div>

    <div className="note"><b>The argument:</b> Congestion is confined to Darwin; everywhere else the
      network isn’t busy but is <b>seasonally fragile</b>. Because closures cluster predictably in the
      Nov–Mar wet, access risk is forecastable — councils can pre-position works and travellers can time
      trips. The NT’s road challenge is planning for a recurring event, not managing daily jams.</div>
  </section>;
}

