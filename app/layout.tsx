import type {Metadata} from "next";
import "./globals.css";

export const metadata:Metadata={
  title:"RoadState — access, not congestion",
  description:"An interactive report on Northern Territory traffic, commuting and wet-season road access, built from open NT Government data.",
};

export const viewport={width:"device-width",initialScale:1};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>;
}
