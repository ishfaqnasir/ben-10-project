import { ChevronLeft, ChevronRight, Cpu, Fingerprint } from 'lucide-react'
import { HologramCanvas } from './Holograms'

export default function OmnitrixShowcase({ versions, active, onChange }) {
  const index=versions.findIndex(v=>v.id===active.id)
  const move=step=>onChange(versions[(index+step+versions.length)%versions.length])
  return <section className="watch-section" id="omnitrix" style={{'--accent':active.color}}>
    <div className="section-kicker">DEVICE EVOLUTION <span>04 VERSIONS INDEXED</span></div>
    <div className="watch-layout">
      <div className="watch-copy"><span className="watch-number">0{index+1}</span><p>{active.short} / {active.year}</p><h2 key={active.id}>{active.name}</h2><p className="summary">{active.summary}</p>
        <dl><div><dt>CREATOR</dt><dd>{active.creator}</dd></div><div><dt>FIRST APPEARANCE</dt><dd>{active.firstAppearance}</dd></div><div><dt>CORE CAPABILITIES</dt><dd>{active.capabilities}</dd></div></dl>
        <div className="watch-controls"><button onClick={()=>move(-1)} aria-label="Previous Omnitrix"><ChevronLeft/></button><span>{index+1} / {versions.length}</span><button onClick={()=>move(1)} aria-label="Next Omnitrix"><ChevronRight/></button></div>
      </div>
      <div className="watch-view"><div className="watch-orbit"/><HologramCanvas color={active.color}/><span className="watch-chip"><Cpu/> CORE MK.{index+1}</span><span className="watch-auth"><Fingerprint/> DNA AUTHENTICATED</span></div>
      <div className="watch-tabs">{versions.map((watch,i)=><button key={watch.id} className={watch.id===active.id?'active':''} onClick={()=>onChange(watch)}><span>0{i+1}</span><b>{watch.name.replace(' Omnitrix','')}</b><small>{watch.year}</small></button>)}</div>
    </div>
  </section>
}
