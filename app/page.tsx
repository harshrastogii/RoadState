"use client";
import {useState} from "react";
import {nt} from "@/lib/data";
import TabOverview from "@/components/TabOverview";
import TabTraffic from "@/components/TabTraffic";
import TabSeasonal from "@/components/TabSeasonal";
import TabSafety from "@/components/TabSafety";

const TABS=["Overview","Traffic & Commutes","Seasonal Access","Road Safety Context"];

export default function Page(){
  const [tab,setTab]=useState(0);
  const {meta}=nt;
  return <>
    <header className="masthead">
      <div className="wrap">
        <div className="dateline"><span>Northern Territory · Open Data</span>
          <span className="rule"/><span>Annual Traffic Report {meta.latest} · filed 2026</span></div>
        <div className="brand">
          <img src="/logo.svg" alt="RoadState logo" width={38} height={38}/>
          <h1>RoadState: <em>access, not congestion</em></h1>
        </div>
        <p className="standfirst"><b>Outside Darwin, the Territory barely has a traffic problem.</b> What
          disrupts travel is the wet season, which cuts off roads on a predictable Nov–Mar cycle. This
          report maps where that access risk concentrates — so travellers, councils and services can plan
          around a recurring event instead of reacting to it.</p>
      </div>
    </header>

    <nav className="nav"><div className="wrap">
      {TABS.map((t,i)=><button key={t} className={i===tab?"active":""} onClick={()=>setTab(i)}>{t}</button>)}
    </div></nav>

    <main className="wrap">
      {tab===0&&<TabOverview/>}
      {tab===1&&<TabTraffic/>}
      {tab===2&&<TabSeasonal/>}
      {tab===3&&<TabSafety/>}
    </main>

    <footer><div className="wrap">
      <div className="foot-data">Data: Northern Territory Government, Annual Traffic Report {meta.latest} (CC-BY).
        Independent project, not affiliated with or endorsed by the NT Government.</div>
      <div className="foot-by">Built by <a href="https://harshrastogii.com" target="_blank" rel="noopener">Harsh Rastogi</a></div>
      <a className="kofi" href="https://ko-fi.com/harshrastogi" target="_blank" rel="noopener">☕ Support this project</a>
    </div></footer>
  </>;
}
