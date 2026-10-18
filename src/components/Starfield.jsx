import { useEffect,useRef } from 'react'
export default function Starfield(){
 const canvas=useRef()
 useEffect(()=>{
  const el=canvas.current,ctx=el.getContext('2d');let frame,t=0,w=0,h=0
  const reduce=matchMedia('(prefers-reduced-motion: reduce)')
  const stars=Array.from({length:75},()=>({x:Math.random(),y:Math.random(),s:Math.random()*1.5+.3}))
  const resize=()=>{w=el.width=innerWidth;h=el.height=innerHeight}
  const draw=()=>{ctx.clearRect(0,0,w,h);ctx.fillStyle='#a2ffae';stars.forEach(s=>{ctx.globalAlpha=.2+s.s*.22;ctx.beginPath();ctx.arc(s.x*w,(s.y*h+t*s.s*.09)%h,s.s,0,Math.PI*2);ctx.fill()});t++;if(!reduce.matches&&!document.hidden)frame=requestAnimationFrame(draw)}
  const visibility=()=>{cancelAnimationFrame(frame);if(!document.hidden)draw()}
  resize();draw();addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility)
  return()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility)}
 },[])
 return <canvas className="starfield" ref={canvas} aria-hidden="true"/>
}
