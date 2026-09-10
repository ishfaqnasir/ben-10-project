import { Brain, ChevronUp, CircleDot, Flame, Gem, Ghost, Radar, Waves, Wind, Zap } from 'lucide-react'

const icons={flame:Flame,fist:ChevronUp,zap:Zap,gem:Gem,circle:CircleDot,radar:Radar,brain:Brain,waves:Waves,wind:Wind,ghost:Ghost}

export default function AlienCard({ alien, onSelect }) {
  const Icon=icons[alien.icon]||CircleDot
  return <button className="alien-card" style={{'--alien':alien.color}} onClick={()=>onSelect(alien)}>
    <div className="card-top"><span>{alien.code}</span><span>{alien.powerType}</span></div>
    <div className="alien-portrait"><div className="portrait-rings"/><Icon/><span className="portrait-scan"/></div>
    <div className="alien-title"><div><h3>{alien.name}</h3><p>{alien.species}</p></div><span>↗</span></div>
    <div className="origin"><span>HOMEWORLD</span><b>{alien.homeworld}</b></div>
    <div className="mini-stats">{Object.entries(alien.stats).map(([name,value])=><div key={name}><span>{name.slice(0,3).toUpperCase()}</span><i><b style={{width:`${value}%`}}/></i><em>{value}</em></div>)}</div>
  </button>
}
