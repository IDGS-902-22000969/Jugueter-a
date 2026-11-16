import { useEffect, useState } from 'react'

import MigrationButton from '../MigrationButton'

import {

  addDoc,

  collection,

  deleteDoc,

  doc,

  onSnapshot,

  orderBy,

  query,

  serverTimestamp,

  updateDoc

} from 'firebase/firestore'



import { db } from '../firebase'

import { useAuth } from '../state/AuthContext'

import { modules } from '../data/modules'



export default function CrudPage({ type }) {

  const config = modules[type]

  const { user } = useAuth()



  const [items, setItems] = useState([])

  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(true)



  const [modal, setModal] = useState(false)

  const [editing, setEditing] = useState(null)

  const [form, setForm] = useState({})



  const [search, setSearch] = useState('')

  const [error, setError] = useState('')



// Productos, categorías y proveedores son compartidos.*

// Las tareas pertenecen a cada usuario.*

  const ref =

type === 'tareas'

      ? collection(db, 'usuarios', user.uid, 'tareas')

      : collection(db, type)



// Obtener la referencia correcta de cada documento*

  function getDocumentRef(id) {

    return type === 'tareas'

      ? doc(db, 'usuarios', user.uid, 'tareas', id)

      : doc(db, type, id)

  }



// Cargar registros en tiempo real*

  useEffect(() => {

    setLoading(true)

    setError('')



    return onSnapshot(

      query(ref, orderBy('createdAt', 'desc')),

      (snap) => {

        setItems(

snap.docs.map((d) => ({

            id: d.id,

            ...d.data()

          }))

        )

        setLoading(false)

      },

      (err) => {

        setError(

          'No se pudieron cargar los datos: ' + err.message

        )

        setLoading(false)

      }

    )

  }, [user.uid, type])



*// Cargar categorías compartidas para Productos*

  useEffect(() => {

    if (type !== 'productos') {

      setCategories([])

      return

    }



    const categoriesRef = collection(db, 'categorias')



    return onSnapshot(

      query(categoriesRef, orderBy('createdAt', 'desc')),

      (snapshot) => {

        setCategories(

snapshot.docs.map((d) => ({

            id: d.id,

            ...d.data()

          }))

        )

      },

      (err) => {

        setError(

          'No se pudieron cargar las categorías: ' + err.message

        )

      }

    )

  }, [user.uid, type])



*// Abrir formulario*

  function open(item = null) {

    setEditing(item)

    setForm(item ? { ...item } : {})

    setError('')

    setModal(true)

  }



*// Guardar registro*

  async function save(e) {

    e.preventDefault()

    setError('')



    const data = { ...form }



    delete data.id

    delete data.createdAt



    Object.keys(data).forEach((k) => {

      if (data[k] === '') {

        delete data[k]

      }

    })



    for (const field of config.fields) {

      if (

        field.type === 'number' &&

        data[field.name] !== undefined

      ) {

        data[field.name] = Number(data[field.name])

      }

    }



    try {

      if (editing) {

        await updateDoc(getDocumentRef(editing.id), {

          ...data,

          updatedAt: serverTimestamp()

        })

      } else {

        await addDoc(ref, {

          ...data,

          createdAt: serverTimestamp(),

          updatedAt: serverTimestamp()

        })

      }



      setModal(false)

      setForm({})

      setEditing(null)

    } catch (err) {

      setError('No se pudo guardar. ' + err.message)

    }

  }



// Eliminar registro*

  async function remove(item) {

    if (

      !confirm(

        `¿Eliminar "${item[config.fields[0].name]}"?`

      )

    ) {

      return

    }



    try {

      await deleteDoc(getDocumentRef(item.id))

    } catch (e) {

      alert('No se pudo eliminar: ' + e.message)

    }

  }



// Marcar o desmarcar tarea*

  async function toggle(item) {

    try {

      await updateDoc(getDocumentRef(item.id), {

        completada: !item.completada,

        updatedAt: serverTimestamp()

      })

    } catch (e) {

      setError('No se pudo actualizar la tarea: ' + e.message)

    }

  }



// Buscar registros*

  const filtered = items.filter((x) =>

    config.fields.some((f) =>

      String(x[f.name] ?? '')

        .toLowerCase()

        .includes(search.toLowerCase())

    )

  )



  return (

    <section>

      <div className="page-heading">

        <div>

          <p className="eyebrow">TU NEGOCIO EN ORDEN</p>

          <h1>

            {config.icon} {config.title}

          </h1>

          <p className="muted">{config.description}</p>

        </div>



        <button

className="primary"

onClick={() => open()}

        >

          ＋ Nuevo {config.singular}

        </button>

      {type === 'productos' && <MigrationButton />}

      </div>



      <div className="toolbar">

        <div className="search">

          <span>⌕</span>

          <input

placeholder={`Buscar ${config.title.toLowerCase()}…`}

value={search}

onChange={(e) => setSearch(e.target.value)}

          />

        </div>



        <span className="count">

          {filtered.length} registro(s)

        </span>



        <span className="live">

          <i /> En vivo

        </span>

      </div>



      {error && !modal && (

        <div className="error">{error}</div>

      )}



      {loading ? (

        <div className="empty">

          Cargando información…

        </div>

      ) : filtered.length === 0 ? (

        <div className="empty">

          <div>{config.icon}</div>



          <h3>

            {search

              ? 'Sin resultados'

              : '¡Comienza a llenar tu tienda!'}

          </h3>



          <p>

            {search

              ? 'Prueba con otra búsqueda.'

              : `Aún no tienes ${config.title.toLowerCase()}. Agrega el primero.`}

          </p>



          {!search && (

            <button

className="primary"

onClick={() => open()}

            >

              ＋ Agregar {config.singular}

            </button>

          )}

        </div>

      ) : (

        <div className="record-grid">

          {filtered.map((item) => (

            <article

className="record-card"

key={item.id}

            >

              <div className="record-top">

                <span className="record-icon">

                  {config.icon}

                </span>



                <span className="record-actions">

                  <button

onClick={() => open(item)}

title="Editar"

                  >

                    ✎

                  </button>



                  <button

onClick={() => remove(item)}

title="Eliminar"

                  >

                    ⌫

                  </button>

                </span>

              </div>



              <h3>

                {item[config.fields[0].name] || 'Sin nombre'}

              </h3>



              {config.fields.slice(1).map((f) =>

                f.type === 'checkbox' ? (

                  <p key={f.name}>

                    <span

className={

                        item[f.name]

                          ? 'status done'

                          : 'status'

                      }

                    >

                      {item[f.name]

                        ? '✓ Completada'

                        : '◷ Pendiente'}

                    </span>

                  </p>

                ) : item[f.name] !== undefined &&

                  item[f.name] !== '' ? (

                  <p

className="record-detail"

key={f.name}

                  >

                    <b>{f.label}:</b>{' '}

                    {f.type === 'number' &&

                    f.name === 'precio'

                      ? `$${Number(item[f.name]).toFixed(2)} MXN`

                      : item[f.name]}

                  </p>

                ) : null

              )}



              {type === 'tareas' && (

                <button

className={

                    item.completada

                      ? 'complete-btn done-btn'

                      : 'complete-btn'

                  }

onClick={() => toggle(item)}

                >

                  {item.completada

                    ? '↶ Reabrir tarea'

                    : '✓ Marcar completada'}

                </button>

              )}

            </article>

          ))}

        </div>

      )}



      {modal && (

        <div

className="modal-backdrop"

onMouseDown={(e) =>

            e.target === e.currentTarget &&

            setModal(false)

          }

        >

          <form className="modal" onSubmit={save}>

            <div className="modal-head">

              <div>

                <p className="eyebrow">

                  {editing

                    ? 'ACTUALIZAR REGISTRO'

                    : 'NUEVO REGISTRO'}

                </p>



                <h2>

                  {editing ? 'Editar' : 'Agregar'}{' '}

                  {config.singular}

                </h2>

              </div>



              <button

type="button"

className="close"

onClick={() => setModal(false)}

              >

                ×

              </button>

            </div>



            {config.fields.map((f) => (

              <label key={f.name}>

                {f.label}



                {type === 'productos' &&

                f.name === 'categoria' ? (

                  <select

value={form[f.name] ?? ''}

required={f.required}

onChange={(e) =>

                      setForm({

                        ...form,

                        [f.name]: e.target.value

                      })

                    }

                  >

                    <option value="">

                      Selecciona una categoría

                    </option>



                    {categories.map((category) => (

                      <option

key={category.id}

value={category.nombre}

                      >

                        {category.nombre}

                      </option>

                    ))}



                    {form[f.name] &&

                      !categories.some(

                        (c) => c.nombre === form[f.name]

                      ) && (

                        <option value={form[f.name]}>

                          {form[f.name]}

                        </option>

                      )}

                  </select>

                ) : f.type === 'textarea' ? (

                  <textarea

rows="3"

value={form[f.name] ?? ''}

required={f.required}

onChange={(e) =>

                      setForm({

                        ...form,

                        [f.name]: e.target.value

                      })

                    }

                  />

                ) : f.type === 'checkbox' ? (

                  <input

className="check-input"

type="checkbox"

checked={!!form[f.name]}

onChange={(e) =>

                      setForm({

                        ...form,

                        [f.name]: e.target.checked

                      })

                    }

                  />

                ) : (

                  <input

type={f.type || 'text'}

min={

                      f.type === 'number' ? 0 : undefined

                    }

step={

f.name === 'precio'

                        ? '0.01'

                        : undefined

                    }

value={form[f.name] ?? ''}

required={f.required}

onChange={(e) =>

                      setForm({

                        ...form,

                        [f.name]: e.target.value

                      })

                    }

                  />

                )}

              </label>

            ))}



            {error && (

              <div className="error">{error}</div>

            )}



            <div className="modal-actions">

              <button

type="button"

className="secondary"

onClick={() => setModal(false)}

              >

                Cancelar

              </button>



              <button className="primary">

                {editing

                  ? 'Guardar cambios'

                  : 'Crear registro'}

              </button>

            </div>

          </form>

        </div>

      )}

    </section>

  )

}


