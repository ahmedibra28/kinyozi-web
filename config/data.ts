const roles = [
  {
    id: 'HzdmUa40IctkReRd2Pofm',
    name: 'Super Admin',
    description:
      'Super Admins can access and manage all features and settings.',
    type: 'SUPER_ADMIN',
  },
  {
    id: 'a75POUlJzMDmaJtz0JCxp',
    name: 'Barber',
    description: 'Default role given to barber user.',
    type: 'BARBER',
  },
  {
    id: 'jopfvuBeup6d3mjyQqYgD',
    name: 'Client',
    description: 'Default role given to client user.',
    type: 'CLIENT',
  },
]

const users = {
  id: 'e5cTUpLtGS7foE42nJuwp',
  name: 'Ahmed Ibrahim',
  email: 'info@ahmedibra.com',
  password: '123456',
  confirmed: true,
  blocked: false,
  mobile: 615301507,
  address: 'Mogadishu',
  image: 'https://github.com/ahmedibra28.png',
  bio: 'Full Stack Developer',
}

const profile = {
  id: 'hMXCyzI2MLXNI6tQ-sU0i',
  mobile: 615301507,
  address: 'Mogadishu',
  image: 'https://github.com/ahmedibra28.png',
  bio: 'Full Stack Developer',
}

const sort = {
  hidden: 0,
  profile: 1,
  admin: 2,
}

const clientPermissions = [
  {
    id: 'MZ4Qsx2e-g96eMw0X2qul',
    name: 'Home',
    path: '/',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Home page',
  },
  {
    id: 'IYN1EVSvUg0o5pAxgPEPi',
    name: 'Users',
    path: '/admin/users',
    menu: 'admin',
    sort: sort.admin,
    description: 'Users page',
  },
  {
    id: 'VFGo5W_hc3O85QCOouabO',
    name: 'Roles',
    path: '/admin/roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'Roles page',
  },
  {
    id: 't-Snd86AW-TlIlMEDmYyt',
    name: 'Profile',
    path: '/account/profile',
    menu: 'profile',
    sort: sort.profile,
    description: 'Profile page',
  },
  {
    id: 'eWpbNJ9LkTVO4BYyaO1mJ',
    name: 'Permissions',
    path: '/admin/permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Permissions page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC2',
    name: 'Client Permissions',
    path: '/admin/client-permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Client Permissions page',
  },
]

const permissions = [
  // Users
  {
    id: 'fCuAED2qkbOmWYmKsOa-_',
    description: 'Users',
    route: '/api/users',
    name: 'Users',
    method: 'GET',
  },
  {
    id: 'UzN2L6RQ_gUM0_JN4ALkB',
    description: 'User Client Permissions',
    route: '/api/users/:id',
    name: 'Users',
    method: 'GET',
  },
  {
    id: 'rqRYCpC0yytkColvHwY3C',
    description: 'User',
    route: '/api/users',
    name: 'Users',
    method: 'POST',
  },
  {
    id: 'xsei4vGvYpoXw3V0_Bgcy',
    description: 'User',
    route: '/api/users/:id',
    name: 'Users',
    method: 'PUT',
  },
  {
    id: '27vMGpNbQGLKtuaIsTAcF',
    description: 'User',
    route: '/api/users/:id',
    name: 'Users',
    method: 'DELETE',
  },

  //   Profile
  {
    id: 'Fyph8SxjGayAHr8g65Rie',
    description: 'Profile',
    route: '/api/profile',
    name: 'Profile',
    method: 'GET',
  },
  {
    id: 'LMG211l6gxRRkjAHPvhgw',
    description: 'Profile',
    route: '/api/profile/:id',
    name: 'Profile',
    method: 'PUT',
  },

  //   Role
  {
    id: '2xiakJtuDptmlP7fxgggo',
    description: 'Roles',
    route: '/api/roles',
    name: 'Roles',
    method: 'GET',
  },
  {
    id: 'HQ8Drbd0-KOMequqhQVuG',
    description: 'Role',
    route: '/api/roles',
    name: 'Roles',
    method: 'POST',
  },
  {
    id: 'GzrnbouFYGvGfvdAfbiZT',
    description: 'Role',
    route: '/api/roles/:id',
    name: 'Roles',
    method: 'PUT',
  },
  {
    id: 'KrZ76u2VUI9qICSJhsuW5',
    description: 'Role',
    route: '/api/roles/:id',
    name: 'Roles',
    method: 'DELETE',
  },

  //   Permission
  {
    id: '9P0mpbew9dYW4oF9cM-mO',
    description: 'Permissions',
    route: '/api/permissions',
    name: 'Permissions',
    method: 'GET',
  },
  {
    id: 'n0dw4GMpgiXfySbdlGhs0',
    description: 'Permission',
    route: '/api/permissions',
    name: 'Permissions',
    method: 'POST',
  },
  {
    id: 'tK5RgtYLe9yFNgF93m6TO',
    description: 'Permission',
    route: '/api/permissions/:id',
    name: 'Permissions',
    method: 'PUT',
  },
  {
    id: 'cn25W3-inLybNRkCMHgNC',
    description: 'Permission',
    route: '/api/permissions/:id',
    name: 'Permissions',
    method: 'DELETE',
  },

  //   Client Permission
  {
    id: 'X26iEN1J-LBaC4HlPsRgh',
    description: 'Client Permissions',
    route: '/api/client-permissions',
    name: 'ClientPermissions',
    method: 'GET',
  },
  {
    id: 'HRu69jNp0j4pJXs_cjCQ5',
    description: 'Client Permission',
    route: '/api/client-permissions',
    name: 'ClientPermissions',
    method: 'POST',
  },
  {
    id: 'X9ACZfrFX9CAl-2uPXyw9',
    description: 'Client Permission',
    route: '/api/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxA',
    description: 'Client Permission',
    route: '/api/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'DELETE',
  },
  //  Upload
  {
    id: 'YTU-o6vjJk4A-4uM8kgxM',
    description: 'Upload',
    route: '/api/uploads',
    name: 'Upload',
    method: 'POST',
  },

  // ================== MOBILE ==================
  // Profile
  {
    id: 'rgaUJfv5AGZ-REPynliek',
    description: 'Get Profile',
    route: '/api/mobile/profile',
    name: 'Mobile - Profile',
    method: 'GET',
  },
  {
    id: 'Qji-QgizslIejbnwrKAXF',
    description: 'Update Profile',
    route: '/api/mobile/profile/:id',
    name: 'Mobile - Profile',
    method: 'PUT',
  },

  // Barbers
  {
    id: '-6qLQx55i6ri-gqCNOgIn',
    description: 'Get Barbers',
    route: '/api/mobile/barbers',
    name: 'Mobile - Barbers',
    method: 'GET',
  },
  {
    id: '-6qLQx55i6rg-gqCNOgIn',
    description: 'Update Barber Status',
    route: '/api/mobile/barbers/:id',
    name: 'Mobile - Barbers',
    method: 'PUT',
  },
  // Appointments
  {
    id: '7KXhE9P2Jg5QyZgjxHg8K',
    description: 'Create Appointment',
    route: '/api/mobile/appointments',
    name: 'Mobile - Appointments',
    method: 'POST',
  },
  {
    id: '7KXhE9P2Jg5QyZgjxHg8L',
    description: 'Update Appointment',
    route: '/api/mobile/appointments/:id',
    name: 'Mobile - Appointments',
    method: 'PUT',
  },
  {
    id: '7KXhE9P2Jg5QyZgjxHg8N',
    description: 'Get Appointments by Client ID',
    route: '/api/mobile/appointments/client/:id',
    name: 'Mobile - Appointments',
    method: 'GET',
  },
  {
    id: '7KXhE9P2Jg5QyZgjxHg8O',
    description: 'Get Appointments by Barber ID',
    route: '/api/mobile/appointments/barber/:id',
    name: 'Mobile - Appointments',
    method: 'GET',
  },

  // Transactions
  {
    id: '7KXhE9P2Jg5QyZgjxHg8R',
    description: 'Get Transactions by Client ID',
    route: '/api/mobile/transactions/client/:id',
    name: 'Mobile - Transactions',
    method: 'GET',
  },
  {
    id: '7KXhE9P2Jg5QyZgjxHg8S',
    description: 'Get Transactions by Barber ID',
    route: '/api/mobile/transactions/barber/:id',
    name: 'Mobile - Transactions',
    method: 'GET',
  },
  // Unrated Appointments
  {
    id: '7KXhE9P2Jg5QyZgjxHg8T',
    description: 'Get Unrated Appointments by Client ID',
    route: '/api/mobile/appointments/unrated',
    name: 'Mobile - Ratings',
    method: 'GET',
  },
  {
    id: '7KXhE9P2Jg5QyZgjxHg8V',
    description: 'Update Rating',
    route: '/api/mobile/appointments/ratings/:id',
    name: 'Mobile - Ratings',
    method: 'PUT',
  },
]

export { roles, users, profile, permissions, clientPermissions }
