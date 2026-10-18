import { useEffect, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { artwork } from '../data/artwork'
import localArtwork from '../data/localArtwork.json'

export default function CharacterArt({ item, eager=false }) {
  const [failed,setFailed]=useState(false)
  const art=localArtwork[item.id]||artwork[item.id]
  useEffect(()=>setFailed(false),[item.id,art?.image])
  return <div className="character-art">
    {art&&!failed?<img src={art.image} alt={item.name+' cartoon character'} loading={eager?'eager':'lazy'} decoding="async" onError={()=>setFailed(true)}/>:<div className="art-unavailable"><ImageOff/><span>{item.name}</span><small>Artwork unavailable</small></div>}
  </div>
}
