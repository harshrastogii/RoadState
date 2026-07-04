"use client";
import {useState} from "react";
import {nt,C,fmt} from "@/lib/data";

// NT bounding box (approx): lat -11 to -26, lon 129 to 138
const LAT0=-10.5, LAT1=-26.5, LON0=128.5, LON1=138.5;

export default function RegionMap({height=300}:{height?:number}){
  const [hover,setHover]=useState<string|null>(null);
  const pts=nt.regions.filter(r=>r.lat!=null&&r.lon!=null);
  const max=Math.max(...pts.map(p=>p.aadt));
  return <div style={{position:"relative"}}>
    <svg viewBox="0 0 320 340" width="100%" height={height} style={{display:"block"}}>
      {/* simple NT outline */}
      <path d="M40,20 L280,20 L280,150 L250,150 L250,320 L120,320 L120,150 L40,150 Z"
        fill="#EEF3F4" stroke={C.line} strokeWidth={1.5}/>
      {pts.map(p=>{
        const x=20+((p.lon!-LON0)/(LON1-LON0))*280;
        const y=20+((p.lat!-LAT0)/(LAT1-LAT0))*300;
        const r=8+Math.sqrt(p.aadt/max)*30;
        const on=hover===p.region;
        return <g key={p.region} onMouseEnter={()=>setHover(p.region)} onMouseLeave={()=>setHover(null)}
          style={{cursor:"pointer"}}>
          <circle cx={x} cy={y} r={r} fill={C.wet} fillOpacity={on?0.85:0.5}
            stroke={C.wetD} strokeWidth={on?2:1}/>
          <text x={x} y={y-r-4} textAnchor="middle" fontSize={9.5} fontWeight={600}
            fill={C.ink} fontFamily="var(--sans)">{p.region}</text>
        </g>;
      })}
    </svg>
    {hover&&(()=>{const p=pts.find(x=>x.region===hover)!;
      return <div style={{position:"absolute",top:8,right:8,background:C.ink,color:"#fff",
        padding:"7px 11px",borderRadius:4,fontSize:12,fontFamily:"var(--sans)"}}>
        <b>{p.region}</b><br/>{fmt(p.aadt)} veh/day total</div>;})()}
  </div>;
}
