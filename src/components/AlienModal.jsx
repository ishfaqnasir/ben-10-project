import { AlertTriangle, Dna, ShieldCheck, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { HologramCanvas } from './Holograms'
import CharacterArt from './CharacterArt'
import { artwork } from '../data/artwork'

export default function AlienModal({ alien, onClose }) {
  const panel=useRef()
  useEffect(()=>{
    if(!alien)return
    const previous=document.activeElement
    const key=e=>{
      if(e.key==='Escape')onClose()
      if(e.key==='Tab'){
        const items=panel.current?.querySelectorAll('button, [tabindex="0"]')
        if(!items?.length)return
        const first=items[0],last=items[items.length-1]
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
      }
    }
    panel.current?.querySelector('button')?.focus()
    document.addEventListener('keydown',key)
    document.body.classList.add('modal-open')
    return()=>{document.removeEventListener('keydown',key);document.body.classList.remove('modal-open');previous?.focus()}
  },[alien,onClose])
  return alien&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <section ref={panel} className="alien-modal" role="dialog" aria-modal="true" aria-labelledby="alien-modal-title" style={{'--alien':alien.color}}>
      <button className="modal-close" onClick={onClose} aria-label="Close alien details"><X/></button>
      <div className="modal-visual"><div className="modal-code">{alien.code} / CHARACTER FILE</div><CharacterArt item={alien} eager/><div className="visual-name"><span>{alien.species}</span><b>{alien.era}</b></div></div>
      <div className="modal-copy">
        <div className="eyebrow"><span>TRANSFORMATION FILE</span><i/>{alien.homeworld}</div><h2 id="alien-modal-title">{alien.name}</h2><p className="lore">{alien.lore}</p>
        {alien.stats&&<><p className="stat-note">Fan-made relative ratings · not official measurements</p><div className="full-stats">{Object.entries(alien.stats).map(([name,value])=><div key={name}><span>{name}</span><i><b style={{width:`${value}%`}}/></i><strong>{value}</strong></div>)}</div></>}
        <div className="ability-grid"><div><h3><Dna/> Abilities</h3>{alien.abilities.map(x=><span key={x}><ShieldCheck/>{x}</span>)}</div><div><h3>Origin</h3><span>{alien.homeworld}</span>{alien.weaknesses?.length>0&&<><h3><AlertTriangle/> Weaknesses</h3>{alien.weaknesses.map(x=><span key={x}>{x}</span>)}</>}</div></div>
        {artwork[alien.id]&&<a className="art-source" href={artwork[alien.id].source} target="_blank" rel="noreferrer">Character & artwork source ↗</a>}
        {!alien.role&&<div className="mini-hologram"><HologramCanvas color={alien.color} alien={alien}/></div>}
      </div>
    </section>
  </div>
}
