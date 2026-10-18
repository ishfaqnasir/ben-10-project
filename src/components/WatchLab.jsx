import { useEffect, useRef, useState } from 'react'
import WristScene,{parts} from './WristScene'
export default function WatchLab({versions,active,onChange}){
 const [exploded,setExploded]=useState(false),[part,setPart]=useState(2)
 const [phase,setPhase]=useState('idle'),timer=useRef()
 const activate=()=>{clearTimeout(timer.current);setPhase('charging');timer.current=setTimeout(()=>setPhase('projected'),1400)}
 useEffect(()=>{clearTimeout(timer.current);setPhase('idle');return()=>clearTimeout(timer.current)},[active.id,exploded])
 return <section className="lab-page"><div className="page-heading"><span>GALVAN ENGINEERING / RESTRICTED ACCESS</span><h1>INSIDE THE<br/><em>IMPOSSIBLE.</em></h1><p>Explore the device that makes a universe of possibilities wearable.</p></div>
 <div className="lab-grid"><div className="lab-specs"><span className="eyebrow">{active.year} / {active.short}</span><h2>{active.name}</h2><p>{active.summary}</p><dl><dt>ARCHITECT</dt><dd>{active.creator}</dd><dt>FIRST APPEARANCE</dt><dd>{active.firstAppearance}</dd></dl><button className="system-button" aria-pressed={exploded} onClick={()=>setExploded(!exploded)}>{exploded?'Assemble device':'Explode blueprint'} ↗</button></div>
 <div className="lab-model"><WristScene color={active.color} version={active.id} exploded={exploded} onPart={setPart} phase={phase} onActivate={activate}/><span className="model-caption">{exploded?'DRAG TO ORBIT / SELECT A LAYER':active.id==='original'?'TOUCH TO PROJECT / MOVE TO TILT':'DRAG TO ORBIT / TOUCH TO ACTIVATE'}</span></div>
 <aside className="part-inspector"><span>COMPONENT / 0{part+1}</span><h3>{parts[part][0]}</h3><p>{parts[part][1]}</p>{parts.map(([name],i)=><button key={name} aria-pressed={part===i} onClick={()=>{setPart(i);setExploded(true)}}><small>0{i+1}</small>{name}</button>)}</aside></div>
 <div className="device-timeline">{versions.map((v,i)=><button key={v.id} aria-pressed={v.id===active.id} onClick={()=>onChange(v)}><span>0{i+1} / {v.year}</span><b>{v.name}</b><i/></button>)}</div>
 <p className="model-note">Interactive fan interpretation of the device architecture.</p></section>
}
