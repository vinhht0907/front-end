import {
  PERMISSION_VIEW,
  USER_VIEW,
  ROLE_VIEW,
  RESOURCE_VIEW,
  TOPIC_VIEW,
  KEYWORD_VIEW
} from '~/constants/permissions'

export default [
  {
    title: 'Home',
    icon: 'flaticon2-architecture-and-city',
    page: '/',
    bullet: 'dot'
  },
  {
    title: 'Resource Management',
    icon: 'flaticon-folder-1',
    page: '/resource',
    bullet: 'dot',
    permission: RESOURCE_VIEW
  },
  {
    title: 'Topic Management',
    icon: 'flaticon-signs-1',
    page: '/topic',
    bullet: 'dot',
    permission: TOPIC_VIEW
  },
  {
    title: 'Keyword Management',
    icon: 'flaticon2-edit',
    page: '/keyword',
    bullet: 'dot',
    permission: KEYWORD_VIEW
  },
  {
    title: 'menu.access_management',
    icon: 'flaticon-profile-1',
    bullet: 'dot',
    submenu: [
      {
        title: 'menu.user_management',
        permission: USER_VIEW,
        page: '/user'
      },
      {
        title: 'menu.role_management',
        permission: ROLE_VIEW,
        page: '/role'
      },
      {
        title: 'menu.permission_management',
        page: '/permission',
        permission: PERMISSION_VIEW
      }
    ]
  }
]
