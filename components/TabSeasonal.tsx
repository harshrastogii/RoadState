"use client";
import {useState,useMemo} from "react";
import {nt,C} from "@/lib/data";
import {SeasonBars,Donut,HBar} from "./Charts";

export default function TabSeasonal(){
  const {meta,closuresByMonth,categories,longestRoads,register}=nt;
  const [q,setQ]=useState("");
  const rows=useMemo(()=>register.filter(r=>!q||(r.road||"").toLowerCase().includes(q.toLowerCase())),[q,register]);
  const worst=closuresByMonth.reduce((a,b)=>b.events>a.events?b:a);
  const longBars=longestRoads.map(r=>({label:r.road,value:r.days,sub:r.category}));

  return <section className="tab">
    <div className="eyebrow">Fig. 7</div>
    <h2 className="sec">When NT roads get cut off</h2>
    <div className="cap">Closures and restrictions by the month they began, {meta.latest}</div>
    <div className="card"><SeasonBars data={closuresByMonth} height={320}/>
      <div style={{display:"flex",gap:18,marginTop:6,fontSize:".8rem"}}>
        <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:12,height:12,background:C.wet,borderRadius:2}}/>Wet (Nov–Mar)</span>
        <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:12,height:12,background:C.dry,borderRadius:2}}/>Dry (Apr–Oct)</span></div>
      <div className="read"><b>In plain terms:</b> {worst.month} starts the most closures of any month.
        The teal bars (wet season) dominate — that’s the whole story in one chart.</div>
    </div>

    <div className="grid2" style={{marginTop:24}}>
      <div className="card">
        <div className="eyebrow">Fig. 8</div>
        <h2 className="sec">Types of disruption</h2>
        <div className="cap">What kind of restriction, {meta.latest}</div>
        <Donut data={categories} height={260}/>
        <div className="read"><b>In plain terms:</b> most disruptions are outright closures or
          drive-with-caution flooding, not minor restrictions.</div>
      </div>
      <div className="card">
        <div className="eyebrow">Fig. 9</div>
        <h2 className="sec">Longest-affected roads</h2>
        <div className="cap">Cumulative days affected during {meta.latest}</div>
        <HBar data={longBars} height={300}/>
        <div className="read"><b>In plain terms:</b> these roads were cut or restricted the longest —
          the priority list for drainage and sealing works.</div>
      </div>
    </div>

    <div style={{marginTop:26}}>
      <div className="eyebrow">Register</div>
      <h2 className="sec">Closure register</h2>
      <div className="cap">Search the full {meta.latest} record of closures and restrictions</div>
      <div className="control"><input type="text" placeholder="Filter by road name…"
        value={q} onChange={e=>setQ(e.target.value)} style={{width:260}}/>
        <span style={{color:C.muted,fontSize:".82rem"}}>{rows.length} of {register.length}</span></div>
      <div className="tableScroll"><table>
        <thead><tr><th>Road</th><th>Location</th><th>Days</th><th>Months</th><th>Restriction</th><th>Category</th></tr></thead>
        <tbody>{rows.map((r,i)=><tr key={i}>
          <td>{r.road}</td><td style={{color:C.slate}}>{r.location||"—"}</td>
          <td>{r.days??"—"}</td><td>{r.months||"—"}</td>
          <td style={{color:C.slate}}>{r.restriction||"—"}</td>
          <td><span className="chip" style={{background:"#F2F6F7",color:C.wetD}}>{r.category||"—"}</span></td>
        </tr>)}</tbody></table></div>
    </div>

    <div className="note"><b>Everyday use:</b> for Top End residents and rural travellers, this shows which
      roads historically flood or restrict access and for how long — useful for trip planning and for
      councils prioritising drainage and sealing works.</div>
  </section>;
}
