import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Volume2, VolumeX } from 'lucide-react'
import { aliens, homeworlds, powerTypes } from './data/aliensData'
import { omnitrixVersions } from './data/omnitrixData'
import Navbar from './components/Navbar'
import Hero3D from './components/Hero3D'
import AlienCard from './components/AlienCard'
import AlienModal from './components/AlienModal'
import OmnitrixShowcase from './components/OmnitrixShowcase'

function playScan(enabled){if(!enabled)return;try{const ctx=new AudioContext();const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(190,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(720,ctx.currentTime+.12);gain.gain.setValueAtTime(.035,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.16);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.17)}catch{}}

export default function App(){
  const [watch,setWatch]=useState(omnitrixVersions[0]),[selected,setSelected]=useState(null),[search,setSearch]=useState(''),[power,setPower]=useState('All'),[world,setWorld]=useState('All worlds'),[sound,setSound]=useState(false)
  const filtered=useMemo(()=>aliens.filter(a=>a.name.toLowerCase().includes(search.toLowerCase())&&(power==='All'||a.powerType===power)&&(world==='All worlds'||a.homeworld===world)),[search,power,world])
  const choose=alien=>{setSelected(alien);playScan(sound)}
  return <div className="site" id="top" style={{'--accent':watch.color}}>
    <Navbar accent={watch.color}/><main><Hero3D accent={watch.color}/><OmnitrixShowcase versions={omnitrixVersions} active={watch} onChange={setWatch}/>
      <section className="database-section" id="database">
        <div className="database-head"><div><span>TRANSFORMATION DATABASE</span><h2>Choose your alien.</h2><p>Ten original DNA signatures. One universe to protect.</p></div><div className="record-count"><b>{String(filtered.length).padStart(2,'0')}</b><span>RECORDS<br/>FOUND</span></div></div>
        <div className="filter-bar"><label><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search DNA archive..." aria-label="Search aliens"/></label><div><SlidersHorizontal/><select value={power} onChange={e=>setPower(e.target.value)} aria-label="Filter by power type">{powerTypes.map(x=><option key={x}>{x}</option>)}</select><select value={world} onChange={e=>setWorld(e.target.value)} aria-label="Filter by homeworld">{homeworlds.map(x=><option key={x}>{x}</option>)}</select><button className={sound?'sound-on':''} onClick={()=>setSound(!sound)} aria-label={`${sound?'Disable':'Enable'} interface sounds`}>{sound?<Volume2/>:<VolumeX/>}</button></div></div>
        {filtered.length?<div className="alien-grid">{filtered.map(alien=><AlienCard key={alien.id} alien={alien} onSelect={choose}/>)}</div>:<div className="empty-state"><span>NO DNA MATCH</span><p>Adjust the search or clear a filter to restore the archive.</p><button onClick={()=>{setSearch('');setPower('All');setWorld('All worlds')}}>Reset archive</button></div>}
      </section>
    </main><footer><div className="brand-lockup"><span className="brand-mark"><i/><i/></span><b>OMNITRIX</b></div><p>Galvan DNA Archive // Earth access node</p><span>© 2026 FAN EXPERIENCE</span></footer><AlienModal alien={selected} onClose={()=>setSelected(null)}/>
  </div>
}
