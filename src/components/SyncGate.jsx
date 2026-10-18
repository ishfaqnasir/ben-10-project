import {useEffect,useRef,useState} from 'react'
import RealisticWatch from './RealisticWatch'
export default function SyncGate({onEnter}){
 const [progress,setProgress]=useState(0),[running,setRunning]=useState(false),button=useRef()
 useEffect(()=>{button.current?.focus();const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous}},[])
 useEffect(()=>{if(!running)return;const t=setInterval(()=>setProgress(p=>Math.min(100,p+5)),65);return()=>clearInterval(t)},[running])
 useEffect(()=>{if(progress===100)onEnter()},[progress,onEnter])
 return <div className={`sync-gate ${running?'is-charging':''}`}>
  <div className="sync-heading"><span>CLASSIC OMNITRIX / ORIGINAL SERIES · 2005</span><h1>THE UNIVERSE.<br/><em>AT YOUR COMMAND.</em></h1><p>Touch the Omnitrix to synchronize DNA.</p></div>
  <div className="sync-device">
   <div className="sync-orbit" aria-hidden="true"/>
   <RealisticWatch phase={running?'charging':'idle'} onActivate={()=>setRunning(true)} disabled={running}/>
   <span className="sync-device-label">PROTOTYPE 01 / GALVAN TECHNOLOGY</span>
  </div>
  <div className="sync-action"><button ref={button} className="system-button" disabled={running} onClick={()=>setRunning(true)}>{running?'SYNCHRONIZING '+progress+'%':'SYNCHRONIZE DNA ↗'}</button><p role="status">{running?['HEATBLAST','DIAMONDHEAD','XLR8','FOUR ARMS'][Math.min(3,Math.floor(progress/25))]+' / DNA SIGNATURE LINKED':'OMNITRIX CORE / AWAITING USER'}</p></div>
 </div>
}
