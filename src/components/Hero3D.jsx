import { ArrowDownRight, Crosshair, Rotate3D, ScanLine } from 'lucide-react'
import { HologramCanvas } from './Holograms'
import CharacterArt from './CharacterArt'

export default function Hero3D({ accent, alienCount, characterCount }) {
  return <section className="hero-section" id="archive" style={{'--accent':accent}}>
    <div className="hero-copy">
      <div className="eyebrow"><span>AZMUTH PROTOCOL</span><i/>DNA ARCHIVE ONLINE</div>
      <h1>IT’S HERO<br/><em>TIME.</em></h1>
      <p>One watch. Five eras. A universe of heroes. Discover the transformations, meet the Tennysons, and explore the technology that started it all.</p>
      <div className="hero-actions"><a href="#/aliens">Explore the aliens <ArrowDownRight/></a><a className="secondary-action" href="#/characters">Meet the characters</a></div>
      <div className="hero-metrics"><div><b>{alienCount}</b><small>ALIEN PROFILES</small></div><div><b>{characterCount}</b><small>CHARACTERS</small></div><div><b>05</b><small>SERIES</small></div></div>
    </div>
    <div className="hero-viewer" aria-label="Interactive 3D Omnitrix hologram">
      <div className="hud-corners"/><div className="viewer-label"><ScanLine/> THE HERO BEHIND THE WATCH</div><CharacterArt item={{id:'ben-tennyson',name:'Ben Tennyson'}} eager/>
      <a className="hero-watch-link" href="#/omnitrix"><Rotate3D/> Explore the 3D Omnitrix ↗</a>
    </div>
  </section>
}
