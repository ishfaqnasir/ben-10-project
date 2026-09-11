import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Volume2, VolumeX, ArrowUpRight } from 'lucide-react'
import { aliens as classicAliens } from './data/aliensData'
import { characters, extraAliens, series } from './data/universeData'
import { omnitrixVersions } from './data/omnitrixData'
import Navbar from './components/Navbar'
import Hero3D from './components/Hero3D'
import AlienCard from './components/AlienCard'
import AlienModal from './components/AlienModal'
import CharacterArt from './components/CharacterArt'
import OmnitrixShowcase from './components/OmnitrixShowcase'

const aliens=[...classicAliens.map(a=>({...a,era:'Original'})),...extraAliens]
const pages=['home','aliens','characters','omnitrix','series']
const readRoute=()=>{const [page='home',query='']=location.hash.replace(/^#\/?/,'').split('?');return {page:pages.includes(page)?page:'home',era:new URLSearchParams(query).get('series')||'All series'}}
let audioContext
function playScan(enabled){
  if(!enabled)return
  try{
    audioContext ||= new AudioContext()
    audioContext.resume()
    const osc=audioContext.createOscillator(),gain=audioContext.createGain(),now=audioContext.currentTime
    osc.frequency.setValueAtTime(190,now);osc.frequency.exponentialRampToValueAtTime(720,now+.12)
    gain.gain.setValueAtTime(.03,now);gain.gain.exponentialRampToValueAtTime(.001,now+.18)
    osc.connect(gain).connect(audioContext.destination);osc.start();osc.stop(now+.2)
    osc.onended=()=>{osc.disconnect();gain.disconnect()}
  }catch{}
}

export default function App(){
  const [route,setRoute]=useState(readRoute),[watch,setWatch]=useState(omnitrixVersions[0])
  const [selected,setSelected]=useState(null),[search,setSearch]=useState(''),[power,setPower]=useState('All powers'),[world,setWorld]=useState('All worlds'),[era,setEra]=useState(readRoute().era),[sound,setSound]=useState(false)
  useEffect(()=>{const navigate=()=>{const next=readRoute();setRoute(next);setEra(next.era);setSearch('');setPower('All powers');setWorld('All worlds');setSelected(null);window.scrollTo({top:0,behavior:'instant'})};addEventListener('hashchange',navigate);return()=>removeEventListener('hashchange',navigate)},[])
  useEffect(()=>{document.title=`${route.page[0].toUpperCase()+route.page.slice(1)} | Omnitrix Universe`},[route.page])
  const close=useCallback(()=>setSelected(null),[])
  const choose=item=>{setSelected(item);playScan(sound)}
  const filtered=useMemo(()=>aliens.filter(a=>a.name.toLowerCase().includes(search.trim().toLowerCase())&&(power==='All powers'||a.powerType===power)&&(world==='All worlds'||a.homeworld===world)&&(era==='All series'||a.era===era)),[search,power,world,era])
  const reset=()=>{setSearch('');setPower('All powers');setWorld('All worlds');setEra('All series')}
  return <div className="site" id="top" style={{'--accent':watch.color}}>
    <Navbar accent={watch.color} page={route.page}/>
    <main><AnimatePresence mode="wait"><motion.div key={route.page} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.22}}>
      {route.page==='home'&&<>
        <Hero3D accent={watch.color} alienCount={aliens.length} characterCount={characters.length}/>
        <section className="home-discovery"><div className="page-heading"><span>YOUR NEXT TRANSFORMATION</span><h2>A universe worth exploring.</h2></div>
          <div className="destination-grid">{[['aliens','Alien archive',`${aliens.length} transformations across five eras`,'heatblast'],['characters','Meet the cast','Heroes, allies, and iconic villains','gwen-tennyson'],['omnitrix','Inside the Omnitrix','Four generations. Interactive 3D.','upgrade']].map(([path,title,copy,id])=><a href={`#/${path}`} key={path}><CharacterArt item={{id,name:title}}/><div><span>{copy}</span><h3>{title}<ArrowUpRight/></h3></div></a>)}</div>
        </section>
      </>}
      {route.page==='aliens'&&<section className="database-section">
        <div className="database-head"><div><span>THE TRANSFORMATION ARCHIVE</span><h2>Choose your alien.</h2><p>Original cartoon artwork. Signature powers. Worlds beyond Earth.</p></div><div className="record-count"><b>{filtered.length}</b><span>OF {aliens.length}<br/>PROFILES</span></div></div>
        <div className="series-filters" aria-label="Filter by debut series">{['All series',...series.map(s=>s.id)].map(s=><button key={s} aria-pressed={era===s} className={era===s?'active':''} onClick={()=>setEra(s)}>{s}</button>)}</div>
        <div className="filter-bar"><label><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find your next transformation…" aria-label="Search aliens"/></label><div>
          <select value={power} onChange={e=>setPower(e.target.value)} aria-label="Filter by power">{['All powers',...new Set(aliens.map(a=>a.powerType))].map(x=><option key={x}>{x}</option>)}</select>
          <select value={world} onChange={e=>setWorld(e.target.value)} aria-label="Filter by homeworld">{['All worlds',...new Set(aliens.map(a=>a.homeworld))].map(x=><option key={x}>{x}</option>)}</select>
          <button onClick={()=>setSound(!sound)} aria-label={sound?'Disable sounds':'Enable sounds'} aria-pressed={sound}>{sound?<Volume2/>:<VolumeX/>}</button>
        </div></div>
        <p className="collection-note">Browse by debut series. Artwork may show a later-series design. This collection excludes Ultimate forms, fusions, and alternate versions.</p>
        {filtered.length?<div className="alien-grid">{filtered.map(alien=><AlienCard key={alien.id} alien={alien} onSelect={choose}/>)}</div>:<div className="empty-state"><span>No matching DNA</span><p>Try another name, power, world, or series.</p><button onClick={reset}>Clear filters</button></div>}
      </section>}
      {route.page==='characters'&&<section className="database-section"><div className="page-heading"><span>THE PEOPLE BEHIND THE ADVENTURE</span><h1>Heroes. Rivals. Family.</h1><p>Meet the main cast of the Ben 10 universe.</p></div><label className="cast-search"><Search/><input aria-label="Search characters" placeholder="Search a character…" value={search} onChange={e=>setSearch(e.target.value)}/></label>
        <div className="cast-grid">{characters.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())).map(c=><button className="cast-card" key={c.id} style={{'--alien':c.color}} onClick={()=>choose(c)}><div className="cast-role">{c.role}<ArrowUpRight size={18}/></div><CharacterArt item={c}/><div className="cast-copy"><small>{c.species} · {c.homeworld}</small><h2>{c.name}</h2><p>{c.abilities.join(' / ')}</p></div></button>)}</div>
        {!characters.some(c=>c.name.toLowerCase().includes(search.toLowerCase()))&&<div className="empty-state">No character matches this search.</div>}
      </section>}
      {route.page==='omnitrix'&&<><div className="device-intro"><span>AZMUTH’S GREATEST INVENTION</span><h1>One device. Infinite possibility.</h1><p>Inspect the watch from every angle. Drag to rotate, scroll to zoom, or pause the display.</p></div><OmnitrixShowcase versions={omnitrixVersions} active={watch} onChange={setWatch}/><p className="model-note">Procedural 3D interpretations inspired by the cartoon designs.</p></>}
      {route.page==='series'&&<section className="database-section"><div className="page-heading"><span>FIVE ERAS OF HERO TIME</span><h1>Follow the adventure.</h1><p>Four connected series. One reimagined road trip.</p></div><div className="series-timeline">{series.map((s,i)=><article key={s.id} style={{'--alien':s.color}}><div className="timeline-year">{s.year}<span>0{i+1}</span></div><div><span>{s.id==='Reboot'?'SEPARATE CONTINUITY':'CLASSIC CONTINUITY'}</span><h2>{s.title}</h2><h3>{s.subtitle}</h3><p>{s.description}</p><a href={`#/aliens?series=${encodeURIComponent(s.id)}`}>Explore {aliens.filter(a=>a.era===s.id).length} alien profiles <ArrowUpRight size={18}/></a></div></article>)}</div></section>}
    </motion.div></AnimatePresence></main>
    <footer><a href="#/home" className="brand-lockup"><span className="brand-mark"><i/><i/></span><b>OMNITRIX</b></a><p>Unofficial fan archive · Character artwork belongs to its respective owners.</p><a href="#/series">Explore all five series ↗</a></footer>
    <AlienModal alien={selected} onClose={close}/>
  </div>
}
