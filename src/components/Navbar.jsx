import { Menu, Radio, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ accent, page='home' }) {
  const [open,setOpen]=useState(false)
  const links=[['Home','home'],['Aliens','aliens'],['Characters','characters'],['Omnitrix','omnitrix'],['Series','series']]
  return <header className="nav-shell" style={{'--accent':accent}}>
    <a className="brand-lockup" href="#/home" aria-label="Omnitrix Archive home"><span className="brand-mark"><i/><i/></span><b>OMNITRIX</b><small>UNIVERSE</small></a>
    <nav className={open?'open':''} aria-label="Primary navigation">{links.map(([label,id],index)=><a key={id} href={`#/${id}`} aria-current={page===id?'page':undefined} onClick={()=>setOpen(false)}><span>0{index+1}</span>{label}</a>)}</nav>
    <div className="nav-status"><Radio size={15}/><span>DNA link stable</span></div>
    <button className="menu-button" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button>
  </header>
}
