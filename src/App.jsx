import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Volume2, VolumeX, ArrowUpRight } from 'lucide-react'
import { aliens as classicAliens } from './data/aliensData'
import { characters, extraAliens, archiveAliens, series } from './data/universeData'
import { omnitrixVersions } from './data/omnitrixData'
import Navbar from './components/Navbar'
import Hero3D from './components/CinematicHero'
import AlienCard from './components/AlienCard'
import AlienModal from './components/AlienModal'
import CharacterArt from './components/CharacterArt'
import WatchLab from './components/WatchLab'
import DnaScanner from './components/DnaScanner'
import BootScreen from './components/SyncGate'
import Starfield from './components/Starfield'
import './redesign.css'
import variants from './data/variants.json'
import AlienProfile from './components/AlienProfile'
import Relationships from './components/Relationships'
import { useLocation } from 'react-router-dom'

const aliens=[...classicAliens.map(a=>({...a,era:'Original'})),...extraAliens,...archiveAliens,...variants]
const pages=['home','aliens','characters','omnitrix','series','profile']
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
  const locationRoute=useLocation()
  const route=readRoute()
  const [watch,setWatch]=useState(omnitrixVersions.find(v=>v.id==='original'))
  const [selected,setSelected]=useState(null),[search,setSearch]=useState(''),[power,setPower]=useState('All powers'),[world,setWorld]=useState('All worlds'),[era,setEra]=useState(readRoute().era),[sound,setSound]=useState(false),[booted,setBooted]=useState(false),[activating,setActivating]=useState(false),[activation,setActivation]=useState(0),[invasion,setInvasion]=useState(false)
  useEffect(()=>{const navigate=()=>{const next=readRoute();setEra(next.era);setSearch('');setPower('All powers');setWorld('All worlds');setSelected(null);window.scrollTo({top:0,behavior:'instant'})};addEventListener('hashchange',navigate);return()=>removeEventListener('hashchange',navigate)},[])
  useEffect(()=>{document.title=`${route.page[0].toUpperCase()+route.page.slice(1)} | Omnitrix Universe`},[route.page])
  const close=useCallback(()=>setSelected(null),[])
  const choose=item=>{if(!item)return;if(item.role)setSelected(item);else location.hash='/profile?id='+encodeURIComponent(item.id);playScan(sound)}
  const activate=()=>{setBooted(true);location.hash='/home';setActivation(v=>v+1);playScan(sound)}
  useEffect(()=>{let keys=[];const onKey=e=>{
 if(e.repeat||e.target.closest('input,textarea,select,[contenteditable="true"]'))return
 keys=[...keys,e.key.toLowerCase()].slice(-20)
 const text=keys.join('')
 if(text.endsWith('herotime')||text.endsWith('hero time'))activate()
 if(text.endsWith('omni')){setBooted(true);setSelected(aliens[Math.floor(Math.random()*aliens.length)])}
 if(keys.slice(-10).join(',')==='arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a')setInvasion(v=>!v)
 if(text.endsWith('alienx')){setBooted(true);setSelected(aliens.find(a=>a.id==='alien-x'))}
 };addEventListener('keydown',onKey);return()=>removeEventListener('keydown',onKey)},[sound])
  const filtered=useMemo(()=>aliens.filter(a=>[a.name,a.code,a.species,a.homeworld,a.powerType,...a.abilities].join(' ').toLowerCase().includes(search.trim().toLowerCase())&&(power==='All powers'||a.powerType===power)&&(world==='All worlds'||a.homeworld===world)&&(era==='All series'||a.era===era)),[search,power,world,era])
  const reset=()=>{setSearch('');setPower('All powers');setWorld('All worlds');setEra('All series')}
  if(!booted)return <BootScreen onEnter={()=>setBooted(true)}/>
  return <div className={`site ${invasion?'vilgax-mode':''}`} id="top" style={{'--accent':watch.color}}>
    <AnimatePresence>{!booted&&<BootScreen onEnter={()=>setBooted(true)}/>}</AnimatePresence>
    <AnimatePresence>{activating&&<motion.div className="activation-flash" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><div className="activation-ring"/><b>DNA SYNCHRONIZED</b></motion.div>}</AnimatePresence>
    <Starfield/>
    <Navbar accent={watch.color} page={route.page}/>
    <main><AnimatePresence mode="wait"><motion.div key={route.page} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.22}}>
      {route.page==='profile'&&<AlienProfile alien={aliens.find(a=>a.id===new URLSearchParams(locationRoute.search).get('id'))}/>}
      {route.page==='home'&&<>
        <Hero3D accent={watch.color} alienCount={aliens.length} characterCount={characters.length} version={watch.id} onSelect={id=>choose(aliens.find(a=>a.id===id))} activation={activation}/>
        <section className="home-discovery"><div className="page-heading"><span>YOUR NEXT TRANSFORMATION</span><h2>A universe worth exploring.</h2></div>
          <div className="destination-grid">{[['aliens','Alien archive',`${aliens.length} transformations across five eras`,'heatblast'],['characters','Meet the cast','Heroes, allies, and iconic villains','gwen-tennyson'],['omnitrix','Inside the Omnitrix','Five series designs. Interactive 3D.','upgrade']].map(([path,title,copy,id])=><a href={`#/${path}`} key={path}><CharacterArt item={{id,name:title}}/><div><span>{copy}</span><h3>{title}<ArrowUpRight/></h3></div></a>)}</div>
        </section>
      </>}
      {route.page==='aliens'&&<section className="database-section">
        <div className="database-head"><div><span>THE TRANSFORMATION ARCHIVE</span><h2>Choose your alien.</h2><p>Original cartoon artwork. Signature powers. Worlds beyond Earth.</p></div><div className="record-count"><b>{filtered.length}</b><span>OF {aliens.length}<br/>PROFILES</span></div></div>
        <div className="series-filters" aria-label="Filter by debut series">{['All series',...new Set(aliens.map(a=>a.era))].map(s=><button key={s} aria-pressed={era===s} className={era===s?'active':''} onClick={()=>setEra(s)}>{s}</button>)}</div>
        <div className="filter-bar"><label><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search DNA sample, species, planet, or power..." aria-label="Search aliens"/></label><div>
          <div className="power-chips">{['All powers',...new Set(aliens.map(a=>a.powerType))].map(x=><button key={x} aria-pressed={power===x} onClick={()=>setPower(x)}>{x}</button>)}</div>
          <select value={world} onChange={e=>setWorld(e.target.value)} aria-label="Filter by homeworld">{['All worlds',...new Set(aliens.map(a=>a.homeworld))].map(x=><option key={x}>{x}</option>)}</select>
          <button onClick={()=>setSound(!sound)} aria-label={sound?'Disable sounds':'Enable sounds'} aria-pressed={sound}>{sound?<Volume2/>:<VolumeX/>}</button>
        </div></div>
        {search&&<div className="search-suggestions" aria-label="DNA search suggestions">{filtered.slice(0,5).map(a=><button key={a.id} onClick={()=>choose(a)}><b>{a.name}</b><span>{a.species} / {a.homeworld}</span></button>)}</div>}
        <p className="collection-note">Base forms, Ultimates, fusions, and alternate-wielder forms are labeled separately. Fan ratings are illustrative, not official measurements.</p>
        {filtered.length?<div className="alien-grid">{filtered.map(alien=><AlienCard key={alien.id} alien={alien} onSelect={choose}/>)}</div>:<div className="empty-state"><span>No matching DNA</span><p>Try another name, power, world, or series.</p><button onClick={reset}>Clear filters</button></div>}
      </section>}
      {route.page==='characters'&&<section className="database-section"><div className="page-heading"><span>THE PEOPLE BEHIND THE ADVENTURE</span><h1>Heroes. Rivals. Family.</h1><p>Meet the main cast of the Ben 10 universe.</p></div><label className="cast-search"><Search/><input aria-label="Search characters" placeholder="Search a character…" value={search} onChange={e=>setSearch(e.target.value)}/></label>
        <div className="cast-grid">{characters.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())).map(c=><button className="cast-card" key={c.id} style={{'--alien':c.color}} onClick={()=>choose(c)}><div className="cast-role">{c.role}<ArrowUpRight size={18}/></div><CharacterArt item={c}/><div className="cast-copy"><small>{c.species} · {c.homeworld}</small><h2>{c.name}</h2><p>{c.abilities.join(' / ')}</p></div></button>)}</div>
        {!characters.some(c=>c.name.toLowerCase().includes(search.toLowerCase()))&&<div className="empty-state">No character matches this search.</div>}
        <Relationships/>
      </section>}
      {route.page==='omnitrix'&&<><div className="device-intro"><span>AZMUTH’S GREATEST INVENTION</span><h1>One device. Infinite possibility.</h1><p>Inspect the watch from every angle. Drag to rotate, scroll to zoom, or pause the display.</p></div><WatchLab versions={omnitrixVersions} active={watch} onChange={setWatch}/><p className="model-note">Procedural 3D interpretations inspired by the cartoon designs.</p></>}
      {route.page==='series'&&<section className="database-section"><div className="page-heading"><span>FIVE ERAS OF HERO TIME</span><h1>Follow the adventure.</h1><p>Four connected series. One reimagined road trip.</p></div><div className="series-timeline">{series.map((s,i)=><article key={s.id} style={{'--alien':s.color}}><div className="timeline-year">{s.year}<span>0{i+1}</span></div><div><span>{s.id==='Reboot'?'SEPARATE CONTINUITY':'CLASSIC CONTINUITY'}</span><h2>{s.title}</h2><h3>{s.subtitle}</h3><p>{s.description}</p><a href={`#/aliens?series=${encodeURIComponent(s.id)}`}>Explore {aliens.filter(a=>a.era===s.id).length} alien profiles <ArrowUpRight size={18}/></a></div></article>)}</div></section>}
    </motion.div></AnimatePresence></main>
    <footer><a href="#/home" className="brand-lockup"><span className="brand-mark"><i/><i/></span><b>OMNITRIX</b></a><p>Unofficial fan archive · Character artwork belongs to its respective owners.</p><a href="#/series">Explore all five series ↗</a></footer>
    <AlienModal alien={selected} onClose={close}/>
  </div>
}
