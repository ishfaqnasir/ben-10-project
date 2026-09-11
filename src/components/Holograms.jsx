import { OrbitControls, Sparkles, ContactShadows } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Component, useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play, RotateCcw, Orbit } from 'lucide-react'
import * as THREE from 'three'

class ViewerBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed
      ? <div className="viewer-fallback"><Orbit size={42}/><p>3D preview unavailable</p><small>Enable hardware acceleration to explore this model.</small></div>
      : this.props.children
  }
}

function Watch({ color, version }) {
  const symbol = useMemo(() => new THREE.Shape()
    .moveTo(-.62,-.55).lineTo(.62,-.55).lineTo(.2,0)
    .lineTo(.62,.55).lineTo(-.62,.55).lineTo(-.2,0).closePath(), [])
  const square = version === 'complete'
  const gauntlet = version === 'ultimatrix'
  return <group rotation={[.35,0,0]}>
    <mesh castShadow position={[0,-.18,0]}>
      <boxGeometry args={[gauntlet?1.65:1.05,.38,gauntlet?4:3.4]}/>
      <meshStandardMaterial color="#18221e" roughness={.5} metalness={.4}/>
    </mesh>
    <mesh castShadow>
      {square ? <boxGeometry args={[2.2,.55,2.2]}/> : <cylinderGeometry args={[1.3,1.4,.55,64]}/>}
      <meshStandardMaterial color="#84958c" metalness={.75} roughness={.32}/>
    </mesh>
    <mesh position={[0,.31,0]}>
      <cylinderGeometry args={[1.12,1.12,.15,64]}/>
      <meshStandardMaterial color="#101b15" metalness={.35} roughness={.4}/>
    </mesh>
    <mesh position={[0,.41,0]} rotation={[-Math.PI/2,0,0]}>
      <shapeGeometry args={[symbol]}/>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} side={THREE.DoubleSide}/>
    </mesh>
    <mesh position={[0,.42,0]} rotation={[Math.PI/2,0,0]}>
      <torusGeometry args={[1.05,.055,12,64]}/>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1}/>
    </mesh>
    {[-1,1].map(side=><group key={side}>
      <mesh position={[side*1.3,0,0]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[.18,.18,.32,24]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.6}/>
      </mesh>
      {[1.4,1.65].map(z=><mesh key={z} position={[0,.04,side*z]}>
        <boxGeometry args={[.8,.055,.08]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.6}/>
      </mesh>)}
    </group>)}
  </group>
}

function DnaHologram({ alien, running }) {
  const core=useRef()
  useFrame((state)=>{if(running&&core.current)core.current.position.y=Math.sin(state.clock.elapsedTime)*.12})
  return <group ref={core}>
    <mesh><icosahedronGeometry args={[.85,1]}/><meshStandardMaterial color={alien.color} wireframe emissive={alien.color} emissiveIntensity={1.2}/></mesh>
    {Object.values(alien.stats||{a:70,b:60,c:80,d:65,e:90}).map((value,i)=><group key={i} rotation={[i*.5,i*.8,i*.3]}>
      <mesh><torusGeometry args={[1.1+i*.12,.015,6,64]}/><meshStandardMaterial color={alien.color} emissive={alien.color} emissiveIntensity={1}/></mesh>
      <mesh position={[1.1+i*.12,0,0]}><sphereGeometry args={[value/650,12,12]}/><meshStandardMaterial color={alien.color} emissive={alien.color} emissiveIntensity={2}/></mesh>
    </group>)}
  </group>
}

export function HologramCanvas({ color='#00ff66', alien, version='original', controls=true }) {
  const host=useRef(), orbit=useRef()
  const [visible,setVisible]=useState(false)
  const [paused,setPaused]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'160px'})
    if(host.current)observer.observe(host.current)
    return()=>observer.disconnect()
  },[])
  return <div ref={host} className="hologram-stage">
    <ViewerBoundary key={alien?.id || version}>
      {visible&&<Canvas shadows dpr={[1,1.5]} frameloop={paused?'demand':'always'} camera={{position:[0,4.2,5.8],fov:42}} gl={{alpha:true,antialias:true}}>
        <ambientLight intensity={1.7}/>
        <directionalLight position={[4,7,5]} intensity={3} castShadow/>
        <directionalLight position={[-4,3,-3]} intensity={2} color={color}/>
        {alien?<DnaHologram alien={alien} running={!paused}/>:<Watch color={color} version={version}/>}
        {!paused&&<Sparkles count={35} scale={5} size={2} speed={.3} color={color}/>}
        <ContactShadows position={[0,-1.35,0]} opacity={.5} scale={8} blur={2.5} far={5} frames={1}/>
        <OrbitControls ref={orbit} enablePan={false} enableZoom={controls} enableRotate={controls} minDistance={3.3} maxDistance={8} autoRotate={!paused} autoRotateSpeed={.6} enableDamping/>
      </Canvas>}
    </ViewerBoundary>
    <div className="viewer-toolbar">
      <button onClick={()=>setPaused(!paused)} aria-label={paused?'Play 3D animation':'Pause 3D animation'}>{paused?<Play size={16}/>:<Pause size={16}/>}</button>
      <button onClick={()=>orbit.current?.reset()} aria-label="Reset 3D camera"><RotateCcw size={16}/></button>
      <span>{alien?'DNA hologram':'Interactive 3D'} · Drag / zoom</span>
    </div>
  </div>
}
