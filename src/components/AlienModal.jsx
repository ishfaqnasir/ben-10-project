import { AlertTriangle, Dna, ShieldCheck, X } from 'lucide-react'
import { useEffect } from 'react'
import { HologramCanvas } from './Holograms'

export default function AlienModal({ alien, onClose }) {
  useEffect(()=>{const key=e=>e.key==='Escape'&&onClose();document.addEventListener('keydown',key);document.body.classList.toggle('modal-open',!!alien);return()=>{document.removeEventListener('keydown',key);document.body.classList.remove('modal-open')}},[alien,onClose])
  return alien&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <section className="alien-modal" role="dialog" aria-modal="true" aria-labelledby="alien-modal-title" style={{'--alien':alien.color}}>
      <button className="modal-close" onClick={onClose} aria-label="Close alien details"><X/></button>
      <div className="modal-visual"><div className="modal-code">{alien.code} / HOLOGRAPHIC DNA MAP</div><HologramCanvas color={alien.color} alien={alien}/><div className="visual-name"><span>{alien.species}</span><b>STABLE MATCH</b></div></div>
      <div className="modal-copy">
        <div className="eyebrow"><span>TRANSFORMATION FILE</span><i/>{alien.homeworld}</div><h2 id="alien-modal-title">{alien.name}</h2><p className="lore">{alien.lore}</p>
        <div className="full-stats">{Object.entries(alien.stats).map(([name,value])=><div key={name}><span>{name}</span><i><b style={{width:`${value}%`}}/></i><strong>{value}</strong></div>)}</div>
        <div className="ability-grid"><div><h3><Dna/> Abilities</h3>{alien.abilities.map(x=><span key={x}><ShieldCheck/>{x}</span>)}</div><div><h3><AlertTriangle/> Weaknesses</h3>{alien.weaknesses.map(x=><span key={x}><AlertTriangle/>{x}</span>)}</div></div>
      </div>
    </section>
  </div>
}
