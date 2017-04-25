[![Build Status](https://travis-ci.org/jerelmiller/redux-simple-auth.svg?branch=master)](https://travis-ci.org/jerelmiller/redux-simple-auth)

# Redux Simple Auth

Redux middleware inspired by the wonderful [Ember Simple
Auth](http://ember-simple-auth.com/) library

### DISCLAIMER: This package is still in active development

Documentation is still very spotty and the API is very likely to change between
now and completion. I plan to fully document usage as the API is more
solidified.

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
import {
  createAuthMiddleware,
  createLocalStorageStore
} from 'redux-simple-auth'

const localStorageStore = createLocalStorageStore()

const authMiddleware = createAuthMiddleware({
  storage: localStorageStore
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

## License

MIT
