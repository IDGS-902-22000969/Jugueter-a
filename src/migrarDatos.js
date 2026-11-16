
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc
} from 'firebase/firestore'

import { db } from './firebase'

export async function migrarDatosAntiguos(uid) {
  if (!uid) {
    throw new Error('No hay un usuario autenticado.')
  }

  const modulos = ['productos', 'categorias', 'proveedores']

  const resultados = {}

  for (const modulo of modulos) {
    const referenciaAntigua = collection(
      db,
      'usuarios',
      uid,
      modulo
    )

    const snapshot = await getDocs(referenciaAntigua)

    let copiados = 0
    let existentes = 0

    for (const registro of snapshot.docs) {
      const referenciaNueva = doc(
        db,
        modulo,
        registro.id
      )

      const documentoExistente = await getDoc(referenciaNueva)

      if (documentoExistente.exists()) {
        existentes++
        continue
      }

      await setDoc(referenciaNueva, registro.data())

      copiados++
    }

    resultados[modulo] = {
      copiados,
      existentes
    }
  }

  return resultados
}
