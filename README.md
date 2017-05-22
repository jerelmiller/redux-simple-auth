[![Build Status](https://travis-ci.org/jerelmiller/redux-simple-auth.svg?branch=master)](https://travis-ci.org/jerelmiller/redux-simple-auth)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Redux Simple Auth

Redux Simple Auth is redux middleware for implementing authentication and
authorization within redux applications. Inspired by the wonderful [Ember Simple
Auth](http://ember-simple-auth.com/) library, its aim is to make authentication
/ authorization simple and flexible for any application.

## Installation

npm:
```
npm install --save redux-simple-auth
```

yarn:
```
yarn add redux-simple-auth
```

## Usage

**configureStore.js**
```javascript
import { createStore, applyMiddleware } from 'redux'
import { createAuthMiddleware } from 'redux-simple-auth'
import rootReducer from './reducers'

const authMiddleware = createAuthMiddleware()

const store = createStore(
  rootReducer,
  applyMiddleware(authMiddleware)
)
```

**reducers/index.js**
```javascript
import { combineReducers } from 'redux'
import { reducer as session } from 'redux-simple-auth'

export default combineReducers({
  session
})
```

### Configuring the middleware

**Changing the session storage**
```javascript
import { createAuthMiddleware } from 'redux-simple-auth'
import { createLocalStorageStore } from 'redux-simple-auth/storage'

const localStorageStore = createLocalStorageStore()

const authMiddleware = createAuthMiddleware({
  storage: localStorageStore
})
```

**Using a cookie store**
```javascript
import { createAuthMiddleware } from 'redux-simple-auth'
import { createCookieStore } from 'redux-simple-auth/storage'

const cookieStore = createCookieStore()

const authMiddleware = createAuthMiddleware({
  storage: cookieStore
})
```

**Defining authenticators**
```javascript
import { createAuthMiddleware, createAuthenticator } from 'redux-simple-auth'

const credentialsAuthenticator = createAuthenticator({
  name: 'credentials',
  authenticate(credentials) {
    return fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }).then(({ token }) => ({ token }))
  },
  restore(data) {
    if (data.token) {
      return Promise.resolve(data)
    }

    return Promise.reject()
  }
})

const authMiddleware = createAuthMiddleware({
  authenticators: [credentialsAuthenticator]
})
```

**Define an authorizer**
```javascript
const authMiddleware = createAuthMiddleware({
  authorize(data, block) {
    if (data.token) {
      block('Authorization', `Bearer ${token}`)
    }
  }
})
```

### Actions

Authenticate with a named authenticator:
```javascript
import { authenticate } from 'redux-simple-auth'

store.dispatch(
  authenticate('credentials', {
    email: 'user@example.com',
    password: 'password'
  })
)
```

Invalidate the session:
```javascript
import { invalidateSession } from 'redux-simple-auth'

store.dispatch(invalidateSession())
```

Fetch an endpoint that requires authentication. Uses authorize function passed
to middleware.
```javascript
import { fetch } from 'redux-simple-auth'

store.dispatch(
  fetch('https://www.example.com/me')
)
```

## License

MIT
