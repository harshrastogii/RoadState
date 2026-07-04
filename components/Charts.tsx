"use client";
import {Group} from "@visx/group";
import {Bar,LinePath,AreaClosed} from "@visx/shape";
import {scaleLinear,scaleBand} from "@visx/scale";
import {AxisBottom,AxisLeft} from "@visx/axis";
import {ParentSize} from "@visx/responsive";
import {curveMonotoneX} from "@visx/curve";
import {useTooltip,TooltipWithBounds,defaultStyles} from "@visx/tooltip";
import {C,fmt} from "@/lib/data";

const axisProps={stroke:C.line,tickStroke:C.line,
  tickLabelProps:()=>({fill:C.slate,fontSize:11,fontFamily:"var(--sans)"})};
const tipStyle={...defaultStyles,background:C.ink,color:"#fff",borderRadius:4,
  fontSize:12,padding:"6px 9px",fontFamily:"var(--sans)"};

/* horizontal bar with optional per-bar color */
export function HBar({data,height=300,color=C.wet,colorFn}:{
  data:{label:string;value:number;sub?:string}[];height?:number;color?:string;
  colorFn?:(d:{label:string;value:number})=>string}){
  const {showTooltip,hideTooltip,tooltipData,tooltipTop,tooltipLeft,tooltipOpen}=useTooltip<{label:string;value:number;sub?:string}>();
  return <div style={{position:"relative"}}><ParentSize parentSizeStyles={{height}}>{({width})=>{
    if(width<10)return null;
    const m={top:6,right:60,bottom:6,left:Math.min(160,width*0.34)};
    const iw=width-m.left-m.right, ih=height-m.top-m.bottom;
    const y=scaleBand({domain:data.map(d=>d.label),range:[0,ih],padding:0.22});
    const x=scaleLinear({domain:[0,Math.max(...data.map(d=>d.value))*1.02],range:[0,iw]});
    return <svg width={width} height={height}>
      <Group left={m.left} top={m.top}>
        {data.map((d,gi)=>{const bw=x(d.value),by=y(d.label)??0,bh=y.bandwidth();
          return <g key={gi}
            onMouseMove={e=>showTooltip({tooltipData:d,tooltipTop:by+bh,tooltipLeft:e.nativeEvent.offsetX})}
            onMouseLeave={hideTooltip}>
            <Bar x={0} y={by} width={bw} height={bh} rx={2}
              fill={colorFn?colorFn(d):color}/>
            <text x={bw+7} y={by+bh/2} dy=".35em" fontSize={11} fontWeight={600}
              fill={C.slate} fontFamily="var(--sans)">{fmt(d.value)}</text>
            <text x={-8} y={by+bh/2} dy=".35em" fontSize={11.5} textAnchor="end"
              fill={C.ink} fontFamily="var(--sans)">{d.label.length>26?d.label.slice(0,25)+"…":d.label}</text>
          </g>;})}
      </Group></svg>;}}</ParentSize>
    {tooltipOpen&&tooltipData&&<TooltipWithBounds top={tooltipTop} left={tooltipLeft} style={tipStyle}>
      <b>{tooltipData.label}</b><br/>{fmt(tooltipData.value)}{tooltipData.sub?` · ${tooltipData.sub}`:""}
    </TooltipWithBounds>}
  </div>;
}

/* line chart (trend) */
export function Line({data,height=300,yLabel="AADT"}:{
  data:{x:number|string;y:number}[];height?:number;yLabel?:string}){
  const {showTooltip,hideTooltip,tooltipData,tooltipTop,tooltipLeft,tooltipOpen}=useTooltip<{x:number|string;y:number}>();
  return <div style={{position:"relative"}}><ParentSize parentSizeStyles={{height}}>{({width})=>{
    if(width<10)return null;
    const m={top:10,right:16,bottom:28,left:52};
    const iw=width-m.left-m.right, ih=height-m.top-m.bottom;
    const xs=data.map((_,i)=>i);
    const x=scaleLinear({domain:[0,data.length-1],range:[0,iw]});
    const y=scaleLinear({domain:[Math.min(...data.map(d=>d.y))*0.96,Math.max(...data.map(d=>d.y))*1.04],range:[ih,0],nice:true});
    return <svg width={width} height={height}>
      <Group left={m.left} top={m.top}>
        {y.ticks(4).map(t=><line key={t} x1={0} x2={iw} y1={y(t)} y2={y(t)} stroke={C.line}/>)}
        <LinePath data={data} x={(_,i)=>x(i)} y={d=>y(d.y)} stroke={C.wet} strokeWidth={2.5} curve={curveMonotoneX}/>
        {data.map((d,i)=><circle key={i} cx={x(i)} cy={y(d.y)} r={3.5} fill={C.wet}
          onMouseMove={()=>showTooltip({tooltipData:d,tooltipTop:y(d.y),tooltipLeft:x(i)+m.left})}
          onMouseLeave={hideTooltip}/>)}
        <AxisBottom top={ih} scale={scaleLinear({domain:[0,data.length-1],range:[0,iw]})}
          tickFormat={(v)=>String(data[Number(v)]?.x??"")} numTicks={Math.min(data.length,8)} {...axisProps}/>
        <AxisLeft scale={y} numTicks={4} tickFormat={v=>fmt(Number(v))} {...axisProps}/>
      </Group></svg>;}}</ParentSize>
    {tooltipOpen&&tooltipData&&<TooltipWithBounds top={tooltipTop} left={tooltipLeft} style={tipStyle}>
      {tooltipData.x}: <b>{fmt(tooltipData.y)}</b> {yLabel}
    </TooltipWithBounds>}
  </div>;
}

/* area (monthly rhythm) */
export function Area({data,height=300,color=C.dry}:{
  data:{x:string;y:number}[];height?:number;color?:string}){
  return <ParentSize parentSizeStyles={{height}}>{({width})=>{
    if(width<10)return null;
    const m={top:10,right:16,bottom:28,left:52};
    const iw=width-m.left-m.right, ih=height-m.top-m.bottom;
    const x=scaleBand({domain:data.map(d=>d.x),range:[0,iw],padding:0.1});
    const y=scaleLinear({domain:[0,Math.max(...data.map(d=>d.y))*1.1],range:[ih,0],nice:true});
    const xi=(i:number)=>(x(data[i].x)??0)+x.bandwidth()/2;
    return <svg width={width} height={height}>
      <Group left={m.left} top={m.top}>
        {y.ticks(4).map(t=><line key={t} x1={0} x2={iw} y1={y(t)} y2={y(t)} stroke={C.line}/>)}
        <AreaClosed data={data} x={(_,i)=>xi(i)} y={d=>y(d.y)} yScale={y}
          fill={color} fillOpacity={0.16} stroke={color} strokeWidth={2.5} curve={curveMonotoneX}/>
        <AxisBottom top={ih} scale={x} {...axisProps}/>
        <AxisLeft scale={y} numTicks={4} tickFormat={v=>fmt(Number(v))} {...axisProps}/>
      </Group></svg>;}}</ParentSize>;
}

/* multi-line (bike) + grouped closures bar */
export function MultiLine({series,height=300}:{
  series:{name:string;color:string;values:{x:string;y:number}[]}[];height?:number}){
  const labels=series[0]?.values.map(v=>v.x)??[];
  return <ParentSize parentSizeStyles={{height}}>{({width})=>{
    if(width<10)return null;
    const m={top:10,right:16,bottom:28,left:46};
    const iw=width-m.left-m.right, ih=height-m.top-m.bottom;
    const x=scaleBand({domain:labels,range:[0,iw],padding:0.1});
    const all=series.flatMap(s=>s.values.map(v=>v.y));
    const y=scaleLinear({domain:[Math.min(...all)*0.9,Math.max(...all)*1.08],range:[ih,0],nice:true});
    const xi=(lbl:string)=>(x(lbl)??0)+x.bandwidth()/2;
    return <svg width={width} height={height}>
      <Group left={m.left} top={m.top}>
        {y.ticks(4).map(t=><line key={t} x1={0} x2={iw} y1={y(t)} y2={y(t)} stroke={C.line}/>)}
        {series.map((s,i)=><LinePath key={i} data={s.values} x={d=>xi(d.x)} y={d=>y(d.y)}
          stroke={s.color} strokeWidth={2.5} curve={curveMonotoneX}/>)}
        <AxisBottom top={ih} scale={x} {...axisProps}/>
        <AxisLeft scale={y} numTicks={4} {...axisProps}/>
      </Group></svg>;}}</ParentSize>;
}

/* vertical bars, colored by season */
export function SeasonBars({data,height=340}:{
  data:{month:string;events:number;season:string}[];height?:number}){
  const {showTooltip,hideTooltip,tooltipData,tooltipTop,tooltipLeft,tooltipOpen}=useTooltip<{month:string;events:number;season:string}>();
  return <div style={{position:"relative"}}><ParentSize parentSizeStyles={{height}}>{({width})=>{
    if(width<10)return null;
    const m={top:10,right:12,bottom:28,left:40};
    const iw=width-m.left-m.right, ih=height-m.top-m.bottom;
    const x=scaleBand({domain:data.map(d=>d.month),range:[0,iw],padding:0.24});
    const y=scaleLinear({domain:[0,Math.max(...data.map(d=>d.events))*1.1],range:[ih,0],nice:true});
    return <svg width={width} height={height}>
      <Group left={m.left} top={m.top}>
        {y.ticks(4).map(t=><line key={t} x1={0} x2={iw} y1={y(t)} y2={y(t)} stroke={C.line}/>)}
        {data.map(d=><Bar key={d.month} x={x(d.month)} y={y(d.events)} width={x.bandwidth()}
          height={ih-y(d.events)} rx={2} fill={d.season==="Wet"?C.wet:C.dry}
          onMouseMove={e=>showTooltip({tooltipData:d,tooltipTop:y(d.events),tooltipLeft:(x(d.month)??0)+m.left})}
          onMouseLeave={hideTooltip}/>)}
        <AxisBottom top={ih} scale={x} {...axisProps}/>
        <AxisLeft scale={y} numTicks={4} {...axisProps}/>
      </Group></svg>;}}</ParentSize>
    {tooltipOpen&&tooltipData&&<TooltipWithBounds top={tooltipTop} left={tooltipLeft} style={tipStyle}>
      <b>{tooltipData.month}</b> · {tooltipData.season}<br/>{tooltipData.events} starting
    </TooltipWithBounds>}
  </div>;
}

/* simple donut for categories */
export function Donut({data,height=300}:{data:{category:string;count:number}[];height?:number}){
  const total=data.reduce((s,d)=>s+d.count,0);
  const colors=[C.wet,C.dry,"#3E7C89","#A9863F",C.slate,C.muted];
  const R=height/2-10,r=R*0.58,cx=height/2,cy=height/2;
  let a0=-Math.PI/2;
  const arcs=data.map((d,i)=>{const a1=a0+2*Math.PI*d.count/total;
    const large=a1-a0>Math.PI?1:0;
    const p=(ang:number,rad:number)=>[cx+rad*Math.cos(ang),cy+rad*Math.sin(ang)];
    const[x0,y0]=p(a0,R),[x1,y1]=p(a1,R),[x2,y2]=p(a1,r),[x3,y3]=p(a0,r);
    const path=`M${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 ${large} 0 ${x3},${y3} Z`;
    const seg={path,color:colors[i%colors.length],pct:Math.round(100*d.count/total),cat:d.category};a0=a1;return seg;});
  return <div style={{display:"flex",gap:18,alignItems:"center",flexWrap:"wrap"}}>
    <svg width={height} height={height}>{arcs.map((s,i)=><path key={i} d={s.path} fill={s.color}/>)}</svg>
    <div style={{fontSize:".82rem"}}>{arcs.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
      <span style={{width:10,height:10,background:s.color,borderRadius:2,display:"inline-block"}}/>
      <span style={{color:C.ink}}>{s.cat}</span><span style={{color:C.muted}}>{s.pct}%</span></div>)}</div>
  </div>;
}
