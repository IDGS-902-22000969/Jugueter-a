import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../state/AuthContext'
const links=[['/','▦','Resumen'],['/productos','🧸','Productos'],['/categorias','🎨','Categorías'],['/proveedores','🚚','Proveedores'],['/tareas','⭐','Tareas']]
export default function Layout() {
  const {user}=useAuth(), nav=useNavigate()
  async function logout(){await signOut(auth);nav('/login')}
  return <div className="app-shell"><aside className="sidebar"><div className="logo"><span>🧸</span><b>Juguetería<br/>Mágica</b></div><p className="nav-caption">MENÚ PRINCIPAL</p><nav>{links.map(([to,icon,label])=><NavLink end={to==='/'} to={to} key={to} className={({isActive})=>isActive?'nav-link active':'nav-link'}><span>{icon}</span>{label}</NavLink>)}</nav><div className="side-bottom"><div className="sparkle">✨</div><b>¡Que nunca pare el juego!</b><small>Tu tienda, organizada.</small></div></aside><main className="main-area"><header className="topbar"><div><span className="eyebrow">PANEL DE ADMINISTRACIÓN</span><div className="welcome">¡Hola! 👋</div></div><div className="user-box"><div className="avatar">{(user?.email||'U')[0].toUpperCase()}</div><div className="user-email">{user?.displayName||user?.email}</div><button className="logout" onClick={logout} title="Cerrar sesión">↪</button></div></header><div className="page-content"><Outlet/></div><footer>Hecho con 💜 para Juguetería Mágica</footer></main></div>
}