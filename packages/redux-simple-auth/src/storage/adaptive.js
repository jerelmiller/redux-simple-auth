import createCookieStore from './cookie'
import createLocalStorageStore from './localStorage'
import { isLocalStorageAvailable } from '../utils/localStorage'

export default (
  {
    localStorageKey: key,
    cookieName: name,
    cookieDomain: domain,
    cookieExpires: expires,
    cookieSecure: secure
  } = {}
) =>
  isLocalStorageAvailable()
    ? createLocalStorageStore({ key })
    : createCookieStore({ name, domain, expires, secure })
