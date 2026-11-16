export const modules = {
  productos: {
    title: 'Productos', singular: 'producto', icon: '🧸', description: 'Controla el catálogo y las existencias.',
    fields: [
      {name:'nombre',label:'Nombre del juguete',required:true},
      {name:'descripcion',label:'Descripción',type:'textarea'},
      {name:'precio',label:'Precio (MXN)',type:'number',required:true},
      {name:'existencia',label:'Existencia',type:'number',required:true},
      {name:'categoria',label:'Categoría'}
    ]
  },
  categorias: {
    title: 'Categorías', singular: 'categoría', icon: '🎨', description: 'Organiza tus juguetes por tipo.',
    fields: [
      {name:'nombre',label:'Nombre de categoría',required:true},
      {name:'descripcion',label:'Descripción',type:'textarea'}
    ]
  },
  proveedores: {
    title: 'Proveedores', singular: 'proveedor', icon: '🚚', description: 'Mantén los datos de tus proveedores.',
    fields: [
      {name:'nombre',label:'Nombre o empresa',required:true},
      {name:'telefono',label:'Teléfono'},
      {name:'correo',label:'Correo electrónico',type:'email'},
      {name:'direccion',label:'Dirección',type:'textarea'}
    ]
  },
  tareas: {
    title: 'Tareas', singular: 'tarea', icon: '⭐', description: 'Organiza los pendientes de la juguetería.',
    fields: [
      {name:'titulo',label:'Tarea',required:true},
      {name:'descripcion',label:'Descripción',type:'textarea'},
      {name:'fecha',label:'Fecha límite',type:'date'},
      {name:'completada',label:'Completada',type:'checkbox'}
    ]
  }
}