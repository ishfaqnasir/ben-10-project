import {useRef} from 'react'
import localArtwork from '../data/localArtwork.json'
import './RealisticWatch.css'
export default function RealisticWatch({phase='idle',onActivate=()=>{},paused=false,disabled=false}){
 const root=useRef()
 const move=e=>{
  if(paused||matchMedia('(prefers-reduced-motion: reduce)').matches)return
  const rect=e.currentTarget.getBoundingClientRect()
  root.current.style.setProperty('--tilt-x',`${(e.clientX-rect.left)/rect.width*12-6}deg`)
  root.current.style.setProperty('--tilt-y',`${6-(e.clientY-rect.top)/rect.height*12}deg`)
 }
 const reset=()=>{root.current?.style.setProperty('--tilt-x','0deg');root.current?.style.setProperty('--tilt-y','0deg')}
 return <div ref={root} className={`realistic-watch ${phase} ${paused?'paused':''}`} onPointerMove={move} onPointerLeave={reset}>
  <div className="real-watch-halo" aria-hidden="true"/>
  {phase==='projected'&&<div className="real-watch-projection" aria-hidden="true"><div className="projection-beam"/><img src={localArtwork.feedback.image} alt=""/><span>DNA-039 / CONDUCTOID</span></div>}
  <button className="real-watch-touch" aria-label="Activate the Classic Omnitrix" disabled={disabled||phase==='charging'} onClick={onActivate}>
   <img className="real-watch-image" src="/realistic-classic-omnitrix.png" alt="Realistic Classic Omnitrix with graphite housing, white armor, textured black cuff and a glowing green dial" draggable="false" fetchPriority="high"/>
  </button>
  <div className="real-watch-shadow" aria-hidden="true"/>
 </div>
}
