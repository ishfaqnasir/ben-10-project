import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import WristScene from './WristScene'
export default function CinematicHero({accent,alienCount,characterCount,onSelect,activation=0,version='original'}){
 const [phase,setPhase]=useState('idle'),timer=useRef()
 const activate=()=>{clearTimeout(timer.current);setPhase('charging');timer.current=setTimeout(()=>setPhase('projected'),1400)}
 useEffect(()=>{if(activation)activate()},[activation])
 useEffect(()=>()=>clearTimeout(timer.current),[])
 return <section className={'hero-section cinematic-hero '+phase}>
 <div className="hero-copy"><div className="eyebrow"><span>AZMUTH PROTOCOL / 001</span><i/>THE UNIVERSE IS IN YOUR HANDS</div>
 <h1>{["IT'S","HERO","TIME."].map((word,i)=><motion.span key={word} initial={{opacity:0,y:35,filter:'blur(10px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} transition={{delay:.15+i*.18,duration:.6}}>{word}</motion.span>)}</h1>
 <p>One watch. Infinite DNA. Step inside the archive of the universe's most extraordinary transformations.</p>
 <div className="hero-actions"><a href="#/aliens">ACCESS DNA ARCHIVE ↗</a><button className="system-button" onClick={activate}>ACTIVATE OMNITRIX ◈</button></div>
 <div className="hero-metrics"><div><b>{alienCount}</b><small>DNA RECORDS</small></div><div><b>05</b><small>ERAS</small></div><div><b>{characterCount}</b><small>KEY FIGURES</small></div></div></div>
 <div className="hero-device"><div className="orbital-ring"/><div className="orbital-ring inner"/><span className="device-status">● {phase==='charging'?'CHARGING DNA CORE':phase==='projected'?'CONDUCTOID DNA LINKED':'OMNITRIX / STANDBY'}</span>
 <WristScene color={accent} version={version} phase={phase} onActivate={activate}/>
 {phase==='projected'&&<button className="projection-info" onClick={()=>onSelect?.('feedback')}><small>CONDUCTOID / TESLAVORR</small><b>FEEDBACK ↗</b><span>ENERGY ABSORPTION</span><span>Open transformation dossier</span></button>}
 <span className="model-caption">{phase==='idle'?'TOUCH THE WATCH TO SYNCHRONIZE':'DNA CONNECTION ESTABLISHED'} / {version==='original'?'MOVE TO TILT':'DRAG TO ORBIT'}</span></div></section>
}
