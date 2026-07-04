"use client";
import {useState} from "react";
import {nt,C,fmt,MONTHS} from "@/lib/data";
import {HBar,Line,Area,MultiLine} from "./Charts";

export default function TabTraffic(){
  const {meta,topRoads,trends,monthly,bike}=nt;
  const [topn,setTopn]=useState(12);
  const roadNames=Object.keys(trends).sort();
  const def=roadNames.includes("Stuart Highway")?"Stuart Highway":roadNames[0];
  const [road,setRoad]=useState(def);

  const bars=topRoads.slice(0,topn).map(r=>({label:r.road,value:r.aadt,sub:r.region}));
  const trend=(trends[road]||[]).map(p=>({x:p.year,y:p.aadt}));
  const rhythm=monthly.filter(m=>m.adt!=null).map(m=>({x:m.month,y:m.adt as number}));
  const bikeSeries=bike.map((b,i)=>({name:b.road,color:i===0?C.wet:C.dry,
    values:b.values.filter(v=>v.riders!=null).map(v=>({x:v.month,y:v.riders as number}))}));

  const peak=[...rhythm].sort((a,b)=>b.y-a.y)[0], low=[...rhythm].sort((a,b)=>a.y-b.y)[0];

  return <section className="tab">
    <div className="eyebrow">Fig. 3</div>
    <h2 className="sec">Busiest roads in {meta.latest}</h2>
    <div className="cap">Ranked by annual average daily traffic (vehicles per day)</div>
    <div className="control">
      <label className="lbl">Show top</label>
      <input type="range" min={5} max={25} value={topn} onChange={e=>setTopn(+e.target.value)}/>
      <span style={{fontWeight:700,color:C.wet}}>{topn}</span>
    </div>
    <div className="card"><HBar data={bars} height={Math.max(260,topn*26)}/>
      <div className="read"><b>In plain terms:</b> {topRoads[0].road} is the NT’s busiest road at
        {" "}{fmt(topRoads[0].aadt)} vehicles a day — and nearly every road at the top of this list is
        in Darwin. Rural highways carry a fraction of that.</div>
    </div>

    <div className="grid2" style={{marginTop:24}}>
      <div className="card">
        <div className="eyebrow">Fig. 4</div>
        <h2 className="sec">10-year trend for a road</h2>
        <div className="control"><label className="lbl">Road</label>
          <select value={road} onChange={e=>setRoad(e.target.value)}>
            {roadNames.map(r=><option key={r}>{r}</option>)}</select></div>
        {trend.length? <Line data={trend} height={260}/> : <div className="cap">No trend data.</div>}
        <div className="read"><b>In plain terms:</b> whether this road is getting busier or quieter over
          a decade — a rising line means growing demand that may need investment.</div>
      </div>
      <div className="card">
        <div className="eyebrow">Fig. 5</div>
        <h2 className="sec">Monthly commute rhythm</h2>
        <div className="cap">Average daily traffic by month — when roads are busiest</div>
        <Area data={rhythm} height={260}/>
        <div className="read"><b>In plain terms:</b> traffic peaks around {peak?.x} and is lightest around
          {" "}{low?.x}. Handy for timing trips and roadworks to avoid the busiest stretch.</div>
      </div>
    </div>

    {bikeSeries.length>0 && <div className="card" style={{marginTop:24}}>
      <div className="eyebrow">Fig. 6 · Active transport</div>
      <h2 className="sec">Darwin bike-path seasonality</h2>
      <div className="cap">Riders per day by month</div>
      <MultiLine series={bikeSeries} height={260}/>
      <div style={{display:"flex",gap:16,marginTop:8,fontSize:".8rem"}}>
        {bikeSeries.map((s,i)=><span key={i} style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:12,height:3,background:s.color,display:"inline-block"}}/>{s.name}</span>)}</div>
      <div className="read"><b>In plain terms:</b> cycling peaks in the cooler, drier mid-year months —
        the opposite of car traffic and closures. Useful for timing active-transport campaigns and path
        maintenance.</div>
    </div>}
  </section>;
}
