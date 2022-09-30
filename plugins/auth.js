import axios from 'axios'

export default function({ $auth, app, $axios }, inject) {
  axios.interceptors.request.use((request) => {
    const token = $auth.getToken('local')
    if (token) {
      request.headers.common.Authorization = `${token}`
    }

    const locale = app.i18n.locale
    if (locale) {
      request.headers.common['Accept-Language'] = locale
    }

    return request
  })

  inject('canPermission', (checkPerm) => {
    const permissions = $auth.user.role.permissions.map((e) => {
      return e.name
    })
    if (!checkPerm) {
      return true
    }
    if (Array.isArray(checkPerm)) {
      if (permissions) {
        return checkPerm.some((r) => permissions.includes(r))
      } else {
        return false
      }
    } else if (permissions) {
      return permissions.includes(checkPerm)
    } else {
      return false
    }
  })
}
