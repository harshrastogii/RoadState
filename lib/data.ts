import raw from "@/data/nt.json";

export type Meta={latest:number;stations:number;regionCount:number;closureCount:number;
  wetPct:number;darwinShare:number;busiest:{road:string;region:string;aadt:number}};
export type RegionRow={region:string;aadt:number;lat:number|null;lon:number|null};
export type RoadRow={road:string;region:string;aadt:number};
export type TrendPt={year:number;aadt:number};
export type MonthPt={month:string;adt:number|null};
export type BikeSeries={road:string;values:{month:string;riders:number|null}[]};
export type ClosureMonth={month:string;events:number;season:"Wet"|"Dry"};
export type CatRow={category:string;count:number};
export type LongRoad={road:string;days:number;category:string};
export type RegRow={road:string|null;location:string|null;days:number|null;
  months:string|null;restriction:string|null;category:string|null};

export type NT={meta:Meta;regions:RegionRow[];topRoads:RoadRow[];
  trends:Record<string,TrendPt[]>;monthly:MonthPt[];bike:BikeSeries[];
  closuresByMonth:ClosureMonth[];categories:CatRow[];longestRoads:LongRoad[];register:RegRow[]};

export const nt=raw as unknown as NT;
export const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const C={ink:"#0B1F2A",wet:"#1A6E7E",wetD:"#124E5A",dry:"#C6803A",
  alert:"#D4342A",slate:"#5A6B72",muted:"#8A979D",line:"#E4E7E9"};
export const fmt=(n:number)=>n.toLocaleString("en-AU");
