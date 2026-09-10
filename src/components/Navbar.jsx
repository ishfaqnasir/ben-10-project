import { Menu, Radio, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ accent }) {
  const [open,setOpen]=useState(false)
  const links=[['Archive','archive'],['Omnitrix','omnitrix'],['Database','database']]
  return <header className="nav-shell" style={{'--accent':accent}}>
    <a className="brand-lockup" href="#top" aria-label="Omnitrix Archive home"><span className="brand-mark"><i/><i/></span><b>OMNITRIX</b><small>ARCHIVE / 10</small></a>
    <nav className={open?'open':''} aria-label="Primary navigation">{links.map(([label,id],index)=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}><span>0{index+1}</span>{label}</a>)}</nav>
    <div className="nav-status"><Radio size={15}/><span>DNA link stable</span></div>
    <button className="menu-button" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button>
  </header>
}
