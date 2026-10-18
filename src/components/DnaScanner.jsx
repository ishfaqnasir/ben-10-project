import { useEffect, useState } from 'react'
export default function DnaScanner({id}){
 const [progress,setProgress]=useState(0),[running,setRunning]=useState(false)
 useEffect(()=>{setProgress(0);setRunning(false)},[id])
 useEffect(()=>{if(!running)return;const t=setInterval(()=>setProgress(p=>Math.min(p+4,100)),60);return()=>clearInterval(t)},[running])
 useEffect(()=>{if(progress===100)setRunning(false)},[progress])
 return <div className={'dna-scanner '+(running?'scanning':'')}><div className="scanner-header"><span>GENETIC DIAGNOSTICS</span><button onClick={()=>{setProgress(0);setRunning(true)}} disabled={running}>{running?'SCANNING…':'SCAN DNA ↗'}</button></div>
 <p>Simulated Omnitrix telemetry</p><div role="status" aria-live="polite">{progress===100?'Scan complete':running?'Analyzing DNA signature':'Ready for genetic analysis'}</div>
 {['DNA integrity','Hybrid compatibility','Transformation stability','Genetic match','Ben compatibility'].map((label,i)=><div className="scan-row" key={label}><span>{label}</span><b>{Math.round(progress*[.998,.823,.978,.992,.985][i])}%</b><i><em style={{width:progress*[.998,.823,.978,.992,.985][i]+'%'}}/></i></div>)}</div>
}
