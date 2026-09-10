import { Float, OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function OmnitrixCore({ color='#00ff66', compact=false }) {
  const group = useRef()
  const core = useRef()
  useFrame((state, delta) => {
    group.current.rotation.y += delta * .22
    core.current.rotation.z -= delta * .6
    core.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * .035)
  })
  return <group ref={group} rotation={[.34,0,-.08]} scale={compact ? .72 : 1}>
    <mesh castShadow><cylinderGeometry args={[1.45,1.45,.52,48]} /><meshStandardMaterial color="#0b100d" metalness={.9} roughness={.25}/></mesh>
    <mesh position={[0,.3,0]} castShadow><cylinderGeometry args={[1.03,1.03,.22,48]} /><meshStandardMaterial color="#18221b" metalness={.7} roughness={.3}/></mesh>
    <group ref={core} position={[0,.44,0]}>
      {[0,Math.PI].map(angle=><mesh key={angle} rotation={[0,angle,0]} position={[0,0,0]} castShadow><shapeGeometry args={[new THREE.Shape().moveTo(-.72,-.62).lineTo(-.05,0).lineTo(-.72,.62).lineTo(-.28,0).lineTo(-.72,-.62)]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.4} side={THREE.DoubleSide}/></mesh>)}
      <pointLight color={color} intensity={compact ? 7 : 12} distance={5}/>
    </group>
    <mesh rotation={[Math.PI/2,0,0]} position={[0,-.08,0]}><torusGeometry args={[1.2,.09,12,60]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1}/></mesh>
    {[0,Math.PI/2,Math.PI,Math.PI*1.5].map(a=><mesh key={a} position={[Math.sin(a)*1.24,.05,Math.cos(a)*1.24]}><boxGeometry args={[.3,.42,.3]}/><meshStandardMaterial color="#606b63" metalness={.9}/></mesh>)}
  </group>
}

function AlienCore({ color, type='energy' }) {
  const ref=useRef()
  useFrame((s,d)=>{ref.current.rotation.x+=d*.12;ref.current.rotation.y+=d*.28})
  const geometry = type==='strength' ? <dodecahedronGeometry args={[1.1,1]}/> : type==='speed' ? <octahedronGeometry args={[1.15,2]}/> : <icosahedronGeometry args={[1.1,2]}/>
  return <Float speed={2} rotationIntensity={.4} floatIntensity={.35}><group ref={ref}>
    <mesh>{geometry}<meshStandardMaterial color="#07110a" emissive={color} emissiveIntensity={.7} wireframe/></mesh>
    <mesh scale={.72}>{geometry}<meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={1.2} transparent opacity={.22} transmission={.3}/></mesh>
    <pointLight color={color} intensity={7} distance={4}/>
  </group></Float>
}

export function HologramCanvas({ color='#00ff66', alien, compact=false, controls=true }) {
  return <Canvas shadows dpr={[1,1.75]} camera={{position:[0,compact?2.8:3.4,compact?4.6:5.5],fov:42}} gl={{alpha:true,antialias:true}}>
    <ambientLight intensity={.65}/><directionalLight position={[4,6,3]} intensity={3} color={color} castShadow/><spotLight position={[-4,3,2]} color="#ffffff" intensity={2}/>
    <Float speed={1.4} rotationIntensity={.18} floatIntensity={.25}>{alien ? <AlienCore color={color} type={alien.powerType.toLowerCase()}/> : <OmnitrixCore color={color} compact={compact}/>}</Float>
    <Sparkles count={compact?25:55} scale={5} size={2} speed={.35} color={color}/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.62,0]} receiveShadow><circleGeometry args={[2.4,64]}/><meshBasicMaterial color={color} transparent opacity={.06}/></mesh>
    {controls&&<OrbitControls enablePan={false} minDistance={3.3} maxDistance={7} autoRotate autoRotateSpeed={.55}/>} 
  </Canvas>
}
