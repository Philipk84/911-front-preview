export const entityConfigs = [
  {
    key: 'users',
    title: 'Usuarios',
    singular: 'usuario',
    route: '/usuarios',
    endpoint: '/api/users',
    menuGroup: 'Administración',
    cardColor: 'cream',
    requiredPermission: 'MANAGE_USERS',
    mainField: 'firstName',
    columns: [
      { name: 'id', label: 'ID' },
      { name: 'firstName', label: 'Nombre' },
      { name: 'lastName', label: 'Apellido' },
      { name: 'email', label: 'Correo' },
      { name: 'age', label: 'Edad' },
      { name: 'weight', label: 'Peso' },
      { name: 'height', label: 'Estatura' },
      { name: 'roleIds', label: 'Roles' }
    ],
    fields: [
      { name: 'firstName', label: 'Nombre', type: 'text', required: true },
      { name: 'lastName', label: 'Apellido', type: 'text', required: true },
      { name: 'email', label: 'Correo', type: 'email', required: true },
      { name: 'password', label: 'Contraseña', type: 'password', required: true },
      { name: 'age', label: 'Edad', type: 'number', required: true },
      { name: 'weight', label: 'Peso', type: 'number', required: true },
      { name: 'height', label: 'Estatura', type: 'number', required: true },
      { name: 'roleIds', label: 'Roles', type: 'multiSelect', optionsEndpoint: '/api/roles', optionLabel: 'name', optionValue: 'id' }
    ]
  },
  {
    key: 'roles',
    title: 'Roles',
    singular: 'rol',
    route: '/roles',
    endpoint: '/api/roles',
    menuGroup: 'Administración',
    requiredPermission: 'MANAGE_ROLES',
    mainField: 'name',
    columns: [
      { name: 'id', label: 'ID' },
      { name: 'name', label: 'Nombre' },
      { name: 'permissionIds', label: 'Permisos' }
    ],
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'permissionIds', label: 'Permisos', type: 'multiSelect', optionsEndpoint: '/api/permissions', optionLabel: 'name', optionValue: 'id' }
    ]
  },
  {
    key: 'permissions',
    title: 'Permisos',
    singular: 'permiso',
    route: '/permisos',
    endpoint: '/api/permissions',
    menuGroup: 'Administración',
    requiredPermission: 'MANAGE_PERMISSIONS',
    mainField: 'name',
    columns: [
      { name: 'id', label: 'ID' },
      { name: 'name', label: 'Nombre' }
    ],
    fields: [{ name: 'name', label: 'Nombre', type: 'text', required: true }]
  },
  {
    key: 'events',
    title: 'Eventos',
    singular: 'evento',
    route: '/eventos',
    endpoint: '/api/events',
    menuGroup: 'Operación',
    requiredPermission: 'VIEW_EVENT',
    createPermission: 'CREATE_EVENT',
    editPermission: 'EDIT_EVENT',
    deletePermission: 'DELETE_EVENT',
    mainField: 'name',
    columns: [
      { name: 'id', label: 'ID' },
      { name: 'name', label: 'Nombre' },
      { name: 'date', label: 'Fecha' },
      { name: 'description', label: 'Descripción' },
      { name: 'physicalSpaceId', label: 'Espacio físico' }
    ],
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'date', label: 'Fecha', type: 'date', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea' },
      { name: 'physicalSpaceId', label: 'Espacio físico', type: 'select', required: true, optionsEndpoint: '/api/physicalspaces', optionLabel: 'name', optionValue: 'id' }
    ]
  },
  {
    key: 'physicalspaces',
    title: 'Espacios físicos',
    singular: 'espacio físico',
    route: '/espacios',
    endpoint: '/api/physicalspaces',
    menuGroup: 'Operación',
    mainField: 'name',
    columns: [
      { name: 'id', label: 'ID' },
      { name: 'name', label: 'Nombre' },
      { name: 'location', label: 'Ubicación' },
      { name: 'capacity', label: 'Capacidad' }
    ],
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'location', label: 'Ubicación', type: 'text', required: true },
      { name: 'capacity', label: 'Capacidad', type: 'number', required: true }
    ]
  },
  {
    key: 'routines',
    title: 'Rutinas',
    singular: 'rutina',
    route: '/rutinas',
    endpoint: '/api/routines',
    menuGroup: 'Entrenamiento',
    requiredPermission: 'VIEW_ROUTINE',
    createPermission: 'CREATE_ROUTINE',
    editPermission: 'EDIT_ROUTINE',
    deletePermission: 'DELETE_ROUTINE',
    mainField: 'routineName',
    columns: [
      { name: 'id', label: 'ID' },
      { name: 'routineName', label: 'Nombre' },
      { name: 'visibility', label: 'Pública' },
      { name: 'difficultyId', label: 'Dificultad' },
      { name: 'typeId', label: 'Tipo' },
      { name: 'ownerId', label: 'Propietario' }
    ],
    fields: [
      { name: 'routineName', label: 'Nombre', type: 'text', required: true },
      { name: 'visibility', label: 'Pública', type: 'boolean', required: true },
      { name: 'difficultyId', label: 'Dificultad', type: 'select', required: true, optionsEndpoint: '/api/difficulties', optionLabel: 'difficultyName', optionValue: 'id' },
      { name: 'typeId', label: 'Tipo', type: 'select', required: true, optionsEndpoint: '/api/types', optionLabel: 'typeName', optionValue: 'id' },
      { name: 'ownerId', label: 'Propietario', type: 'select', required: true, optionsEndpoint: '/api/users', optionLabel: ['firstName', 'lastName'], optionValue: 'id' },
      { name: 'routineExerciseIds', label: 'IDs rutina-ejercicio', type: 'multiNumber' }
    ]
  },
  {
    key: 'exercises',
    title: 'Ejercicios',
    singular: 'ejercicio',
    route: '/ejercicios',
    endpoint: '/api/exercises',
    menuGroup: 'Entrenamiento',
    requiredPermission: 'VIEW_EXERCISE',
    createPermission: 'CREATE_EXERCISE',
    editPermission: 'EDIT_EXERCISE',
    deletePermission: 'DELETE_EXERCISE',
    mainField: 'exerciseName',
    columns: [
      { name: 'id', label: 'ID' },
      { name: 'exerciseName', label: 'Nombre' },
      { name: 'description', label: 'Descripción' },
      { name: 'visualSupportIds', label: 'Soportes' }
    ],
    fields: [
      { name: 'exerciseName', label: 'Nombre', type: 'text', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', required: true },
      { name: 'visualSupportIds', label: 'Soportes visuales', type: 'multiNumber' },
      { name: 'routineExerciseIds', label: 'IDs rutina-ejercicio', type: 'multiNumber' }
    ]
  },
  {
    key: 'progressrecords',
    title: 'Progreso',
    singular: 'registro de progreso',
    route: '/progreso',
    endpoint: '/api/progressrecords',
    menuGroup: 'Entrenamiento',
    requiredPermission: 'VIEW_OWN_PROGRESS',
    createPermission: 'REGISTER_PROGRESS',
    editPermission: 'REGISTER_PROGRESS',
    mainField: 'date',
    columns: [
      { name: 'id', label: 'ID' },
      { name: 'date', label: 'Fecha' },
      { name: 'time', label: 'Hora' },
      { name: 'series', label: 'Series' },
      { name: 'repetitions', label: 'Repeticiones' },
      { name: 'weight', label: 'Peso' },
      { name: 'routineExerciseId', label: 'Rutina-ejercicio' }
    ],
    fields: [
      { name: 'date', label: 'Fecha', type: 'date', required: true },
      { name: 'time', label: 'Hora', type: 'time', required: true, helperText: 'Usa formato HH:mm:ss si tu navegador lo requiere.' },
      { name: 'progressNotes', label: 'Notas', type: 'textarea' },
      { name: 'series', label: 'Series', type: 'number', required: true },
      { name: 'repetitions', label: 'Repeticiones', type: 'number', required: true },
      { name: 'weight', label: 'Peso', type: 'number', required: true },
      { name: 'equipmentUsed', label: 'Equipo usado', type: 'text' },
      { name: 'routineExerciseId', label: 'ID rutina-ejercicio', type: 'number', required: true }
    ]
  },
  {
    key: 'recommendations',
    title: 'Recomendaciones',
    singular: 'recomendación',
    route: '/recomendaciones',
    endpoint: '/api/recommendations',
    menuGroup: 'Entrenamiento',
    requiredPermission: 'VIEW_RECOMMENDATIONS',
    createPermission: 'GENERATE_RECOMMENDATIONS',
    editPermission: 'GENERATE_RECOMMENDATIONS',
    mainField: 'message',
    columns: [
      { name: 'id', label: 'ID' },
      { name: 'message', label: 'Mensaje' },
      { name: 'date', label: 'Fecha' },
      { name: 'senderId', label: 'Remitente' },
      { name: 'receiverId', label: 'Receptor' }
    ],
    fields: [
      { name: 'message', label: 'Mensaje', type: 'textarea', required: true },
      { name: 'date', label: 'Fecha', type: 'date' },
      { name: 'senderId', label: 'Remitente', type: 'select', required: true, optionsEndpoint: '/api/users', optionLabel: ['firstName', 'lastName'], optionValue: 'id' },
      { name: 'receiverId', label: 'Receptor', type: 'select', required: true, optionsEndpoint: '/api/users', optionLabel: ['firstName', 'lastName'], optionValue: 'id' }
    ]
  },
  {
    key: 'visualsupports',
    title: 'Soportes visuales',
    singular: 'soporte visual',
    route: '/soportes',
    endpoint: '/api/visual-supports',
    menuGroup: 'Catálogos',
    mainField: 'supportType',
    columns: [
      { name: 'id', label: 'ID' },
      { name: 'supportType', label: 'Tipo' },
      { name: 'url', label: 'URL' },
      { name: 'exerciseId', label: 'Ejercicio' }
    ],
    fields: [
      { name: 'supportType', label: 'Tipo de soporte', type: 'text', required: true },
      { name: 'url', label: 'URL', type: 'url', required: true },
      { name: 'exerciseId', label: 'Ejercicio', type: 'select', required: true, optionsEndpoint: '/api/exercises', optionLabel: 'exerciseName', optionValue: 'id' }
    ]
  },
  {
    key: 'difficulties',
    title: 'Dificultades',
    singular: 'dificultad',
    route: '/dificultades',
    endpoint: '/api/difficulties',
    menuGroup: 'Catálogos',
    mainField: 'difficultyName',
    columns: [
      { name: 'id', label: 'ID' },
      { name: 'difficultyName', label: 'Nombre' }
    ],
    fields: [{ name: 'difficultyName', label: 'Nombre', type: 'text', required: true }]
  },
  {
    key: 'types',
    title: 'Tipos',
    singular: 'tipo',
    route: '/tipos',
    endpoint: '/api/types',
    menuGroup: 'Catálogos',
    mainField: 'typeName',
    columns: [
      { name: 'id', label: 'ID' },
      { name: 'typeName', label: 'Nombre' }
    ],
    fields: [{ name: 'typeName', label: 'Nombre', type: 'text', required: true }]
  },
  {
    key: 'subscriptions',
    title: 'Inscripciones',
    singular: 'inscripción',
    route: '/inscripciones',
    endpoint: '/api/subscriptions',
    menuGroup: 'Operación',
    idFields: ['userId', 'eventId'],
    mainField: 'userId',
    columns: [
      { name: 'userId', label: 'Usuario' },
      { name: 'eventId', label: 'Evento' },
      { name: 'attendance', label: 'Asistencia' }
    ],
    fields: [
      { name: 'userId', label: 'Usuario', type: 'select', required: true, optionsEndpoint: '/api/users', optionLabel: ['firstName', 'lastName'], optionValue: 'id' },
      { name: 'eventId', label: 'Evento', type: 'select', required: true, optionsEndpoint: '/api/events', optionLabel: 'name', optionValue: 'id' },
      { name: 'attendance', label: 'Asistencia', type: 'boolean', required: true }
    ]
  }
]
