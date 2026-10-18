import { Component, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sparkles, Float, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import RealisticWatch from './RealisticWatch'
export const parts=[['Crystal shield','Protects the transformation interface.'],['Transformation dial','Selects and authorizes the active genetic template.'],['DNA core','Holds the genetic template during synchronization.'],['AI core','Coordinates selection, diagnostics and safeguards.'],['Translator','Interprets communication across species.'],['Power cell','Supplies energy to the transformation assembly.'],['Species sampler','Acquires genetic signatures for analysis.']]
const designs={
 original:{shell:'#101512',trim:'#d9d7bf',glow:'#9bea13',wide:1,bezel:1.12},
 recalibrated:{shell:'#15231b',trim:'#6d756e',glow:'#63ff69',wide:.72,bezel:.94},
 ultimatrix:{shell:'#141a16',trim:'#717a73',glow:'#8fff31',wide:1.7,bezel:1},
 complete:{shell:'#121813',trim:'#e9ede5',glow:'#54ff70',wide:.85,bezel:.96},
 reboot:{shell:'#0b110d',trim:'#dde2ce',glow:'#a0fa29',wide:1.15,bezel:1.18}
}
class Boundary extends Component{
 state={failed:false}
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<div className="viewer-fallback">3D unavailable. Use the activation controls below.</div>:this.props.children}
}
function Watch({version,exploded,phase,onActivate,onPart,paused}){
 const d=designs[version]||designs.original,core=useRef()
 const symbol=useMemo(()=>new THREE.Shape()
  .moveTo(-.47,-.72).lineTo(.47,-.72).lineTo(.16,0).lineTo(.47,.72).lineTo(-.47,.72).lineTo(-.16,0).closePath(),[])
 useFrame(({clock})=>{if(core.current&&!paused)core.current.emissiveIntensity=phase==='charging'?2+Math.sin(clock.elapsedTime*16):.35+Math.sin(clock.elapsedTime*Math.PI/4)*.18})
 const steel='#90968e',dark='#111512',black='#060907'
 const layerNames=parts.map(p=>p[0])
 const layerPosition=i=>exploded?(.4+(6-i)*.56):(i===0?.97:i===1?.78:i===2?.59:.49)
 const layer=(i,geometry,material)=><mesh key={layerNames[i]} position={[0,layerPosition(i),0]} onClick={e=>{if(exploded){e.stopPropagation();onPart(i)}}}>{geometry}{material}</mesh>
 return <group rotation={[.27,0,-.12]} onClick={e=>{e.stopPropagation();if(!exploded)onActivate()}}>
  {!exploded&&<group>
   {/* Classic 2005 black wristband, built from separate molded links. */}
   {[-1,1].map(side=><group key={side}>
    {Array.from({length:7},(_,i)=>{
      const z=side*(1.18+i*.24), taper=i===0||i===6
      return <mesh key={i} position={[0,-.035+(Math.abs(i-3)*.012),z]} rotation={[side*(i-3)*.025,0,0]}>
       <boxGeometry args={[taper?.9:1.02,.24,taper?.25:.22]}/>
       <meshStandardMaterial color={i%2?'#171b18':'#242925'} roughness={.32} metalness={.62}/>
      </mesh>
    })}
    <mesh position={[0,-.02,side*2.92]}><boxGeometry args={[.82,.3,.27]}/><meshStandardMaterial color="#101411" roughness={.26} metalness={.72}/></mesh>
   </group>)}
   {/* Heavy black-and-brushed-metal housing from the original series. */}
   <mesh position={[0,.035,0]}><cylinderGeometry args={[1.34,1.38,.5,12]}/><meshStandardMaterial color="#080a09" roughness={.24} metalness={.8}/></mesh>
   <mesh position={[0,.292,0]}><cylinderGeometry args={[1.27,1.32,.16,12]}/><meshStandardMaterial color="#a9ada2" roughness={.24} metalness={.86}/></mesh>
   <mesh position={[0,.388,0]}><cylinderGeometry args={[1.15,1.2,.09,12]}/><meshStandardMaterial color="#121613" roughness={.18} metalness={.76}/></mesh>
   <mesh rotation={[Math.PI/2,0,0]} position={[0,.442,0]}><torusGeometry args={[1.11,.055,16,80]}/><meshStandardMaterial color="#c4c8b9" roughness={.2} metalness={.92}/></mesh>
   {/* The unmistakable bright-green original-series dial and black hourglass. */}
   <mesh position={[0,.443,0]}><cylinderGeometry args={[1.015,1.04,.065,64]}/><meshStandardMaterial color={d.glow} roughness={.18} metalness={.22} emissive={d.glow} emissiveIntensity={phase==='charging'?1.3:.22}/></mesh>
   <mesh rotation={[-Math.PI/2,0,0]} position={[0,.482,0]}><shapeGeometry args={[symbol]}/><meshBasicMaterial color="#080b08" side={THREE.DoubleSide}/></mesh>
   {/* Four raised silver armor grips frame the dial like the 2005 prop. */}
   {[-1,1].flatMap(x=>[-1,1].map(z=><group key={`${x}-${z}`} position={[x*.91,.43,z*.91]} rotation={[0,Math.atan2(x,z),x*z*.22]}>
    <mesh><boxGeometry args={[.34,.2,.22]}/><meshStandardMaterial color="#c5c8ba" roughness={.22} metalness={.9}/></mesh>
    <mesh position={[0,.11,0]}><boxGeometry args={[.24,.08,.16]}/><meshStandardMaterial color="#393e37" roughness={.2} metalness={.82}/></mesh>
   </group>))}
   {[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return <mesh key={i} position={[Math.cos(a)*1.2,.34,Math.sin(a)*1.2]}><boxGeometry args={[.13,.16,.1]}/><meshStandardMaterial color={i%2?steel:'#515850'} roughness={.2} metalness={.9}/></mesh>})}
   {[-1,1].map(side=><group key={side}>
    <mesh position={[side*1.31,.03,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.2,.2,.23,24]}/><meshStandardMaterial color={steel} metalness={.8} roughness={.25}/></mesh>
    <mesh position={[side*1.44,.03,0]}><sphereGeometry args={[.12,20,20]}/><meshStandardMaterial color={d.glow} emissive={d.glow} emissiveIntensity={phase==='charging'?2:.25}/></mesh>
   </group>)}
  </group>}
  {exploded&&<group>
   {layer(0,<cylinderGeometry args={[1.22,1.22,.07,64]}/>,<meshPhysicalMaterial color="#baffdf" transparent opacity={.15} roughness={.04} depthWrite={false}/>)}
   {layer(1,<cylinderGeometry args={[1.05,1.12,.18,64]}/>,<meshStandardMaterial color={steel} metalness={.9} roughness={.2}/>)}
   {layer(2,<cylinderGeometry args={[.8,.8,.18,48]}/>,<meshStandardMaterial color={d.glow} emissive={d.glow} emissiveIntensity={.8}/>)}
   {[3,4,5,6].map((i)=><group key={i} position={[0,layerPosition(i),0]} onClick={e=>{e.stopPropagation();onPart(i)}}>
    <mesh><cylinderGeometry args={[.35-i*.025,.35-i*.025,.13,32]}/><meshStandardMaterial color={i===3?'#35423a':i===4?'#9cb5a1':i===5?'#646a64':'#26342a'} metalness={.72} roughness={.28}/></mesh>
   </group>)}
  </group>}
  {phase==='projected'&&!exploded&&<group position={[0,2.15,0]}>
   <mesh position={[0,-.25,0]}><coneGeometry args={[.8,1.7,48,1,true]}/><meshBasicMaterial color={d.glow} transparent opacity={.065} depthWrite={false} side={THREE.DoubleSide}/></mesh>
   {[[0,1.15,.22,.28],[0,.65,.36,.45],[-.56,.65,.12,.45],[.56,.65,.12,.45],[-.2,0,.14,.5],[.2,0,.14,.5]].map(([x,y,r,h],i)=><mesh key={i} position={[x,y,0]}><cylinderGeometry args={[r,r*.8,h,8]}/><meshStandardMaterial color={d.glow} wireframe emissive={d.glow} emissiveIntensity={2}/></mesh>)}
   {Array.from({length:36},(_,i)=><mesh key={i} position={[Math.cos(i*.55)*.85,i*.055-.35,Math.sin(i*.55)*.85]}><sphereGeometry args={[.025,8,8]}/><meshBasicMaterial color={d.glow}/></mesh>)}
  </group>}
 </group>
}
export default function WristScene({color='#7bff65',exploded=false,onPart=()=>{},phase='idle',onActivate=()=>{},version='original'}){
 const [paused,setPaused]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)
 if(version==='original'&&!exploded)return <div className="wrist-scene"><RealisticWatch {...{phase,onActivate,paused}}/><button className="scene-pause" onClick={()=>setPaused(!paused)}>{paused?'Resume motion':'Pause motion'}</button></div>
 return <div className="wrist-scene"><Boundary><Canvas dpr={[1,1.5]} camera={{position:[4,3.8,5.3],fov:40}} frameloop={paused?'demand':'always'}>
 <ambientLight intensity={.7}/><directionalLight position={[2,6,5]} intensity={3}/><directionalLight position={[-4,2,-2]} intensity={2} color="#c3dbcf"/><pointLight position={[0,2,0]} color={color} intensity={3}/>
 <Float speed={paused?0:1.1} rotationIntensity={.15} floatIntensity={.15}><Watch {...{version,exploded,phase,onActivate,onPart,paused}}/></Float>
 <ContactShadows position={[0,-1.85,0]} opacity={.5} scale={8} blur={2.8} far={5} frames={1}/>
 {!paused&&<Sparkles count={40} scale={7} size={1.5} speed={.25} color={color}/>}<OrbitControls enablePan={false} enableZoom={false} target={[0,phase==='projected'?.8:exploded?.7:0,0]}/></Canvas></Boundary><button className="scene-pause" onClick={()=>setPaused(!paused)}>{paused?'Resume motion':'Pause motion'}</button></div>
}
