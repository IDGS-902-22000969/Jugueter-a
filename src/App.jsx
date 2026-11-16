import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './state/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CrudPage from './components/CrudPage'
function PrivateLayout(){return <ProtectedRoute><Layout/></ProtectedRoute>}
export default function App(){
 const {loading}=useAuth()
 if(loading)return <div className="loading">Preparando tu juguetería…</div>
 return <Routes><Route path="/login" element={<Login/>}/><Route element={<PrivateLayout/>}><Route path="/" element={<Dashboard/>}/><Route path="/productos" element={<CrudPage type="productos"/>}/><Route path="/categorias" element={<CrudPage type="categorias"/>}/><Route path="/proveedores" element={<CrudPage type="proveedores"/>}/><Route path="/tareas" element={<CrudPage type="tareas"/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>
}