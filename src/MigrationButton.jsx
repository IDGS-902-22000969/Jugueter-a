
import { useState } from 'react'
import { useAuth } from './state/AuthContext'
import { migrarDatosAntiguos } from './migrarDatos'

export default function MigrationButton() {
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function ejecutarMigracion() {
    const confirmar = window.confirm(
      'Se copiarán los productos, categorías y proveedores antiguos a las colecciones compartidas. Los originales no se eliminarán. ¿Continuar?'
    )

    if (!confirmar) return

    try {
      setLoading(true)
      setMessage('')

      const resultados = await migrarDatosAntiguos(user.uid)

      const totalCopiados =
        resultados.productos.copiados +
        resultados.categorias.copiados +
        resultados.proveedores.copiados

      const totalExistentes =
        resultados.productos.existentes +
        resultados.categorias.existentes +
        resultados.proveedores.existentes

      setMessage(
        `Migración terminada. Copiados: ${totalCopiados}. Ya existentes: ${totalExistentes}.`
      )
    } catch (error) {
      setMessage('Error en la migración: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        className="secondary"
        onClick={ejecutarMigracion}
        disabled={loading}
      >
        {loading ? 'Migrando...' : 'Migrar datos antiguos'}
      </button>

      {message && (
        <p role="status">{message}</p>
      )}
    </div>
  )
}
