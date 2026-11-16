import { Navigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Preparando tu juguetería…</div>
  return user ? children : <Navigate to="/login" replace />
}