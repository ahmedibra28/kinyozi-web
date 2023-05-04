const roles = [
  {
    _id: '5e0af1c63b6482125c1b22cb',
    name: 'Super Admin',
    description:
      'Super Admins can access and manage all features and settings.',
    type: 'SUPER_ADMIN',
  },
  {
    _id: '5e0af1c63b6482125c1b44cb',
    name: 'Authenticated',
    description: 'Default role given to authenticated user.',
    type: 'AUTHENTICATED',
  },
  {
    _id: '5e0af1c63b6482125c1b44cc',
    name: 'Client',
    description: 'Default role given to client user.',
    type: 'CLIENT',
  },
  {
    _id: '5e0af1c63b6482125c1b44cd',
    name: 'Barbershop',
    description: 'Default role given to barbershop user.',
    type: 'BARBERSHOP',
  },
  {
    _id: '5e0af1c63b6482125c1b44ce',
    name: 'Barber',
    description: 'Default role given to barber user.',
    type: 'BARBER',
  },
]

const users = {
  _id: '5063114bd386d8fadbd6b00a',
  name: 'Ahmed Ibrahim',
  email: 'info@ahmedibra.com',
  password: '123456',
  mobile: 615301507,
  confirmed: true,
  blocked: false,
}

const profile = {
  _id: '5063114bd386d8fadbd6b00b',
  mobile: 252615301507,
  address: 'Mogadishu',
  image: 'https://github.com/ahmedibradotcom.png',
  bio: 'Full Stack Developer',
}

const sort = {
  hidden: 0,
  profile: 1,
  admin: 2,
}

const clientPermissions = [
  {
    _id: '637e0261fadbdf65bba856b6',
    name: 'Home',
    path: '/',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Home page',
  },
  {
    _id: '637e0261fadbdf65bba856b7',
    name: 'Users',
    path: '/admin/users',
    menu: 'admin',
    sort: sort.admin,
    description: 'Users page',
  },
  {
    _id: '637e0261fadbdf65bba856b8',
    name: 'Roles',
    path: '/admin/roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'Roles page',
  },
  {
    _id: '637e0261fadbdf65bba856b9',
    name: 'Profile',
    path: '/account/profile',
    menu: 'profile',
    sort: sort.profile,
    description: 'Profile page',
  },
  {
    _id: '637e0261fadbdf65bba856bb',
    name: 'Permissions',
    path: '/admin/permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Permissions page',
  },
  {
    _id: '637e0261fadbdf65bba856ba',
    name: 'Client Permissions',
    path: '/admin/client-permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Client Permissions page',
  },
  {
    _id: '637e0261fadbdf65bba856bc',
    name: 'User Roles',
    path: '/admin/user-roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'User Roles page',
  },
  {
    _id: '637e0261fadbdf65bba856bd',
    name: 'User Profiles',
    path: '/admin/user-profiles',
    menu: 'admin',
    sort: sort.admin,
    description: 'User Profiles page',
  },
]

const permissions = [
  // Users
  {
    _id: '637e01fbfadbdf65bba855e2',
    description: 'Users',
    route: '/api/auth/users',
    name: 'Users',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e3',
    description: 'User By Id',
    route: '/api/auth/users/:id',
    name: 'Users',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e4',
    description: 'User',
    route: '/api/auth/users',
    name: 'Users',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855e6',
    description: 'User',
    route: '/api/auth/users/:id',
    name: 'Users',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855e7',
    description: 'User',
    route: '/api/auth/users/:id',
    name: 'Users',
    method: 'DELETE',
  },

  //   User Profile
  {
    _id: '637e01fbfadbdf65bba855e5',
    description: 'Profiles',
    route: '/api/auth/user-profiles',
    name: 'User Profiles',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e8',
    description: 'Profile',
    route: '/api/auth/profile',
    name: 'User Profile',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855e9',
    description: 'Profile',
    route: '/api/auth/profile/:id',
    name: 'User Profile',
    method: 'PUT',
  },

  //   Role
  {
    _id: '637e01fbfadbdf65bba855ea',
    description: 'Roles',
    route: '/api/auth/roles',
    name: 'Roles',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855eb',
    description: 'Role',
    route: '/api/auth/roles',
    name: 'Roles',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855ec',
    description: 'Role',
    route: '/api/auth/roles/:id',
    name: 'Roles',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855ed',
    description: 'Role',
    route: '/api/auth/roles/:id',
    name: 'Roles',
    method: 'DELETE',
  },

  //   Permission
  {
    _id: '637e01fbfadbdf65bba855ee',
    description: 'Permissions',
    route: '/api/auth/permissions',
    name: 'Permissions',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855ef',
    description: 'Permission',
    route: '/api/auth/permissions',
    name: 'Permissions',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855f0',
    description: 'Permission',
    route: '/api/auth/permissions/:id',
    name: 'Permissions',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855f1',
    description: 'Permission',
    route: '/api/auth/permissions/:id',
    name: 'Permissions',
    method: 'DELETE',
  },

  //   User Role
  {
    _id: '637e01fbfadbdf65bba855f2',
    description: 'User Roles',
    route: '/api/auth/user-roles',
    name: 'User Roles',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855f4',
    description: 'User Role',
    route: '/api/auth/user-roles',
    name: 'User Roles',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855f3',
    description: 'User Role',
    route: '/api/auth/user-roles/:id',
    name: 'User Roles',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855f5',
    description: 'User Role',
    route: '/api/auth/user-roles/:id',
    name: 'User Roles',
    method: 'DELETE',
  },

  //   Client Permission
  {
    _id: '637e01fbfadbdf65bba855f6',
    description: 'Client Permissions',
    route: '/api/auth/client-permissions',
    name: 'ClientPermissions',
    method: 'GET',
  },
  {
    _id: '637e01fbfadbdf65bba855f7',
    description: 'Client Permission',
    route: '/api/auth/client-permissions',
    name: 'ClientPermissions',
    method: 'POST',
  },
  {
    _id: '637e01fbfadbdf65bba855f8',
    description: 'Client Permission',
    route: '/api/auth/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'PUT',
  },
  {
    _id: '637e01fbfadbdf65bba855f9',
    description: 'Client Permission',
    route: '/api/auth/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'DELETE',
  },

  // ================== MOBILE ======================

  //   Barbershop
  {
    _id: '643aa8570b370bf6d90c4195',
    description: 'Get all barbershops',
    route: '/api/mobile/barbershops',
    name: 'Barbershops',
    method: 'GET',
  },
  {
    _id: '643aa8570b370bf6d90c4196',
    description: 'Create barbershop',
    route: '/api/mobile/barbershops',
    name: 'Barbershops',
    method: 'POST',
  },
  {
    _id: '643aa8570b370bf6d90c4199',
    description: 'Get single barbershop',
    route: '/api/mobile/barbershops/:id',
    name: 'Barbershops',
    method: 'GET',
  },
  {
    _id: '643aa8570b370bf6d90c4197',
    description: 'Update barbershop',
    route: '/api/mobile/barbershops/:id',
    name: 'Barbershops',
    method: 'PUT',
  },
  {
    _id: '643aa8570b370bf6d90c4198',
    description: 'Delete barbershop',
    route: '/api/mobile/barbershops/:id',
    name: 'Barbershops',
    method: 'DELETE',
  },

  //   Appointment
  {
    _id: '643bde226e2f031ae50db350',
    description: 'Get all appointments',
    route: '/api/mobile/appointments',
    name: 'Appointments',
    method: 'GET',
  },
  {
    _id: '643bde226e2f031ae50db351',
    description: 'Create appointment',
    route: '/api/mobile/appointments',
    name: 'Appointments',
    method: 'POST',
  },
  {
    _id: '643bde226e2f031ae50db352',
    description: 'Get single appointment',
    route: '/api/mobile/appointments/:id',
    name: 'Appointments',
    method: 'GET',
  },
  {
    _id: '643bde226e2f031ae50db353',
    description: 'Update appointment date',
    route: '/api/mobile/appointments/:id',
    name: 'Appointments',
    method: 'PUT',
  },
  {
    _id: '643bde226e2f031ae50db354',
    description: 'Delete appointment',
    route: '/api/mobile/appointments/:id',
    name: 'Appointments',
    method: 'DELETE',
  },
  {
    _id: '643bde226e2f031ae50db355',
    description: 'Get pending appointments',
    route: '/api/mobile/appointments/pending-appointments',
    name: 'Appointments',
    method: 'GET',
  },
  {
    _id: '643bde226e2f031ae50db356',
    description: 'Get last appointment',
    route: '/api/mobile/appointments/last-appointment',
    name: 'Appointments',
    method: 'GET',
  },
  {
    _id: '643bde226e2f031ae50db357',
    description: 'Update appointment start time',
    route: '/api/mobile/appointments/start',
    name: 'Appointments',
    method: 'PUT',
  },
  {
    _id: '643bde226e2f031ae50db358',
    description: 'Update appointment end time',
    route: '/api/mobile/appointments/end',
    name: 'Appointments',
    method: 'PUT',
  },

  //   Rating
  {
    _id: '643bdfca6e2f031ae50db355',
    description: 'Get top most rated barbershop',
    route: '/api/mobile/appointments/ratings',
    name: 'Ratings',
    method: 'GET',
  },
  {
    _id: '643bdfca6e2f031ae50db356',
    description: 'Get unrated appointments',
    route: '/api/mobile/appointments/ratings/:id',
    name: 'Ratings',
    method: 'GET',
  },
  {
    _id: '643bdfca6e2f031ae50db357',
    description: 'Update appointment rating',
    route: '/api/mobile/appointments/ratings/:id',
    name: 'Ratings',
    method: 'PUT',
  },

  // Payments
  {
    _id: '643bdfca6e2f031ae50db358',
    description: 'Get all payments',
    route: '/api/mobile/payments',
    name: 'Payments',
    method: 'GET',
  },

  // Profile
  {
    _id: '643bdfca6e2f031ae50db338',
    description: 'Get profile',
    route: '/api/mobile/profile',
    name: 'Profile',
    method: 'GET',
  },
  {
    _id: '643bdfca6e2f031ae50db339',
    description: 'Update profile',
    route: '/api/mobile/profile',
    name: 'Profile',
    method: 'POST',
  },

  //   Chat
  {
    _id: '643bdfca6e2f031ae50db335',
    description: 'Get list of chats / chat history',
    route: '/api/mobile/chats/:id/:id',
    name: 'Chats',
    method: 'GET',
  },
  {
    _id: '643bdfca6e2f031ae50db336',
    description: 'Get current chat',
    route: '/api/mobile/chats',
    name: 'Chats',
    method: 'GET',
  },
  {
    _id: '643bdfca6e2f031ae50db337',
    description: 'Create or update current chat',
    route: '/api/mobile/chats',
    name: 'Chats',
    method: 'POST',
  },
]

export { roles, users, profile, permissions, clientPermissions }
