"use client";
import {nt,C} from "@/lib/data";
import {HBar} from "./Charts";

export default function TabSafety(){
  const {topRoads}=nt;
  const exposure=topRoads.slice(0,10).map(r=>({label:r.road,value:r.aadt,sub:r.region}));

  return <section className="tab">
    <h2 className="sec">Road safety context for the Northern Territory</h2>
    <div className="note" style={{marginTop:10}}>The granular crash dataset is released by NT Police /
      Road Safety on request (road.safety@nt.gov.au) rather than as a direct download. This view frames
      the safety picture using traffic-exposure data — the strongest available public signal for where
      crash risk concentrates.</div>

    <div style={{marginTop:26}}>
      <div className="eyebrow">Fig. 10</div>
      <h2 className="sec">High-volume corridors to watch</h2>
      <div className="cap">Traffic exposure concentrates crash risk</div>
      <div className="card"><HBar data={exposure} height={300} color={C.alert}/>
        <div className="read"><b>In plain terms:</b> the more vehicles a road carries, the more crash
          exposure it has. These ten corridors are where safety investment — lighting, signals, audits —
          tends to yield the most benefit.</div>
      </div>
    </div>
  </section>;
}
