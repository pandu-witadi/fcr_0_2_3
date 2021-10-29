export default {
  items: [
    //----------------------------------------------------
    // Seimic Dashboard
    //----------------------------------------------------
    {
      title: true,
      name: 'Project',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    // {
    //   name: 'Well',
    //   url: '/well',
    //   router: 'well',
    //   icon: 'fa fa-fire '
    // },
    {
      name: 'Area',
      url: '/admin-area-list',
      router: 'admin-area-list',
      icon: 'fa fa-cube'
    },
    {
      name: 'SEGY',
      url: '/admin-segy-list',
      router: 'admin-segy-list',
      icon: 'fa fa-hdd-o'
    },
    {
      name: 'Geobody',
      url: '/admin-geobody-list',
      router: 'admin-geobody-list',
      icon: 'fa fa-cubes'
    },
    {
      name: 'Model',
      url: '/admin-mlmodel-list',
      router: 'admin-mlmodel-list',
      icon: 'fa fa-cube'
    },
    {
      name: 'Well',
      url: '/admin-well-list',
      router: 'admin-well-list',
      icon: 'fa fa-hashtag'
    },

    {
      title: true,
      name: 'User Settings',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    {
      name: 'Users',
      url: '/dashboard-user-list',
      router: 'user-profile',
      icon: 'fa fa-user '
    },
    {
      name: 'Authentication',
      url: '/dashboard-user-authentication',
      router: 'logout',
      icon: 'fa fa-lock'
    },
  ]
}
