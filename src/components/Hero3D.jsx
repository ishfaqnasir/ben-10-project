import { ArrowDownRight, Crosshair, Rotate3D, ScanLine } from 'lucide-react'
import { HologramCanvas } from './Holograms'

export default function Hero3D({ accent }) {
  return <section className="hero-section" id="archive" style={{'--accent':accent}}>
    <div className="hero-copy">
      <div className="eyebrow"><span>AZMUTH PROTOCOL</span><i/>DNA ARCHIVE ONLINE</div>
      <h1>IT’S HERO<br/><em>TIME.</em></h1>
      <p>Access the Omnitrix core. Explore ten legendary transformations and four generations of the most powerful device in the galaxy.</p>
      <div className="hero-actions"><a href="#database">Open alien database <ArrowDownRight/></a><span><Rotate3D/>Drag to rotate<br/><small>Scroll to zoom</small></span></div>
      <div className="hero-metrics"><div><b>1,000,912</b><small>DNA SAMPLES</small></div><div><b>10</b><small>ACTIVE FORMS</small></div><div><b>100%</b><small>CORE CHARGE</small></div></div>
    </div>
    <div className="hero-viewer" aria-label="Interactive 3D Omnitrix hologram">
      <div className="hud-corners"/><div className="viewer-label"><ScanLine/> LIVE CORE RENDER</div><HologramCanvas color={accent}/>
      <div className="orbit-label"><Crosshair/> ORBIT LOCK<br/><b>36° 44′ 12″</b></div>
    </div>
  </section>
}
