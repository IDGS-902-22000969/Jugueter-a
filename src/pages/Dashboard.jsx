import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../state/AuthContext'
import { Link } from 'react-router-dom'
export default function Dashboard(){
 const {user}=useAuth(),[counts,setCounts]=useState({productos:0,categorias:0,proveedores:0,tareas:0,pendientes:0})
 useEffect(()=>{
  const names=['productos','categorias','proveedores','tareas']
  const unsub=names.map(name=>onSnapshot(collection(db,'usuarios',user.uid,name),snap=>setCounts(c=>({...c,[name]:snap.size,...(name==='tareas'?{pendientes:snap.docs.filter(d=>!d.data().completada).length}:{})}))))
  return ()=>unsub.forEach(fn=>fn())
 },[user.uid])
 const cards=[['productos','🧸','Productos','#fce6ef'],['categorias','🎨','Categorías','#eee9ff'],['proveedores','🚚','Proveedores','#e3f5ee'],['tareas','⭐','Tareas','#fff1d9']]
 return <><div className="hero"><div><p className="eyebrow">BIENVENIDA A TU ESPACIO</p><h1>¡Tu juguetería está<br/>en buenas manos! ✨</h1><p>Administra cada detalle y dedica más tiempo a lo importante: la diversión.</p></div><div className="hero-toys">🧸<span>🪁</span><small>🎁</small></div></div>
 <div className="section-title"><div><h2>Resumen de tu tienda</h2><p className="muted">Tus registros se actualizan en tiempo real.</p></div><span className="live"><i/> Sincronizado</span></div>
 <div className="stats-grid">{cards.map(([key,icon,label,bg])=><Link to={'/'+key} className="stat-card" key={key}><div className="stat-icon" style={{background:bg}}>{icon}</div><span>{label}</span><strong>{counts[key]}</strong><small>Ver {label.toLowerCase()} →</small></Link>)}</div>
 <div className="tip-card"><span>💡</span><div><b>Un pequeño consejo</b><p>{counts.pendientes?`Tienes ${counts.pendientes} tarea(s) pendiente(s). ¡Vamos a por ellas!`:'Mantén actualizado tu inventario para que ningún juguete se quede sin hogar.'}</p></div><Link to="/tareas">Ir a tareas →</Link></div>
 </>}
