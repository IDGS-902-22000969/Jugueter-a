import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { useAuth } from '../state/AuthContext'

export default function Login() {
  const [register,setRegister] = useState(false)
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const [busy,setBusy] = useState(false)
  const nav = useNavigate()
  const { user } = useAuth()
  if (user) nav('/')
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true)
    try {
      if (register) await createUserWithEmailAndPassword(auth,email,password)
      else await signInWithEmailAndPassword(auth,email,password)
      nav('/')
    } catch(err) { setError(errorText(err.code)) } finally { setBusy(false) }
  }
  async function google() {
    setError(''); setBusy(true)
    try { await signInWithPopup(auth,googleProvider); nav('/') }
    catch(err) { setError(errorText(err.code)) } finally { setBusy(false) }
  }
  return <main className="auth-wrap">
    <section className="auth-art"><div className="brand-mark">🧸</div><p className="eyebrow">UN MUNDO DE DIVERSIÓN</p><h1>Juguetería<br/><span>Mágica</span></h1><p>Todo en orden para que la diversión nunca termine.</p><div className="toy-cloud">🚂　🪁　🧩　🪀</div></section>
    <section className="auth-card"><div className="mobile-brand">🧸 Juguetería Mágica</div><p className="eyebrow">{register?'CREA TU CUENTA':'QUÉ BUENO TENERTE DE VUELTA'}</p><h2>{register?'¡Únete a la magia!':'Iniciar sesión'}</h2><p className="muted">Administra tu tienda de juguetes fácilmente.</p>
      <form onSubmit={submit} className="form-stack">
        <label>Correo electrónico<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="tu@correo.com"/></label>
        <label>Contraseña<input type="password" minLength="6" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Mínimo 6 caracteres"/></label>
        {error&&<div className="error">{error}</div>}
        <button className="primary full" disabled={busy}>{busy?'Espera…':register?'Crear cuenta':'Entrar a mi tienda'}</button>
      </form>
      <div className="or"><span/>o continúa con<span/></div>
      <button className="google full" onClick={google} disabled={busy}><b>G</b> Continuar con Google</button>
      <p className="switch-auth">{register?'¿Ya tienes cuenta?':'¿Primera vez aquí?'} <button onClick={()=>{setRegister(!register);setError('')}}>{register?'Inicia sesión':'Crea una cuenta'}</button></p>
    </section>
  </main>
}
function errorText(code) {
  const map={'auth/email-already-in-use':'Ese correo ya está registrado.','auth/invalid-email':'El correo no es válido.','auth/invalid-credential':'Correo o contraseña incorrectos.','auth/weak-password':'La contraseña debe tener al menos 6 caracteres.','auth/popup-closed-by-user':'Se cerró la ventana de Google.','auth/unauthorized-domain':'Agrega este dominio en Firebase Authentication.'}
  return map[code]||'No fue posible iniciar sesión. Verifica la configuración de Firebase.'
}