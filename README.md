[![Build Status](https://travis-ci.org/jerelmiller/redux-simple-auth.svg?branch=master)](https://travis-ci.org/jerelmiller/redux-simple-auth)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Redux Simple Auth

Redux Simple Auth is a library for implementing authentication and authorization
within redux applications. Inspired by the wonderful [Ember Simple
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

### Setup

This library ships with middleware and a reducer. You will need to do the
following:

##### Apply the middleware

```javascript
import { createStore, applyMiddleware } from 'redux'
import { createAuthMiddleware } from 'redux-simple-auth'
import rootReducer from './reducers'

// Authenticators and configuration options are discussed below
const authMiddleware = createAuthMiddleware({ authenticator: myAuthenticator })

const store = createStore(
  rootReducer,
  /* initialState, */
  applyMiddleware(authMiddleware)
)
```

##### Add the reducer

You will need to apply the reducer as `session`. Redux Simple Auth does not
support custom names for the reducer key.

```javascript
import { combineReducers } from 'redux'
import { reducer as session } from 'redux-simple-auth'

export default combineReducers({
  // ...reducers
  session
})
```

## Configuring the middleware

Redux Simple Auth aims to make authentication and authorization within your
application as flexible as possible. To get familiar with how to build
authentication into your application, you will need to get familiar with a few
terms.

**Authenticator**

An authenticator defines how your application authenticates a user and creates a
session. An application may have one or many authenticators. The data returned
from an authenticator will be saved using the specified session storage
mechanism.

**Session Storage**

The session store persists the session state so that it may survive a page
reload.

**Authorizer**

Authorizers are responsible for using the data stored in a session to generate
authorization data that can be injected into outgoing requests.

---

To configure the middleware, simply pass the `createAuthMiddleware` function the
configuration needed for your application. You may find more documentation on
each of these options below.

```javascript
const authMiddleware = createAuthMiddleware({
  authenticator: credentialsAuthenticator,
  authorize: jwtAuthorizer,
  storage: localStorageStore
})
```

## Authenticators

Authenticators implement the business logic responsible for authenticating the
session. An application may have one or many authenticators such as
authenticating credentials with one's own backend server, Facebook login, Github
login, etc. The authentication strategy chosen is dependent on the action
dispatched with the authentication payload.

```javascript
store.dispatch(authenticate('credentials', { email, password }))
```

### Built-in authenticators

Redux Simple Auth does not currently ship with any built-in authenticators.
There are plans to implement authenticators as this library matures. For now,
refer to the [custom authenticators](#implementing-a-custom-authenticator)
documentation to build your own.

### Implementing a custom authenticator

To implement your own custom authenticator, you will need to import the
`createAuthenticator` function from Redux Simple Auth. To create the
authenticator, simply call the function with a configuration object.

```javascript
import { createAuthenticator } from 'redux-simple-auth'

const credentialsAuthenticator = createAuthenticator({
  name: 'credentials',
  authenticate(data) {
    // ...
  },
  restore(data) {
    // ...
  },
  invalidate(data) {
    // ...
  }
})
```

**Options:**

* `name` (_string_): The name of the authenticator. This is used by the
  middleware to identify the authenticator used during the lifecycle of the
  session.

* `authenticate(data)` (_function_): A function responsible for implementing the
  logic responsible for authentication. This function will be invoked when the
  `authenticate` action is dispatched. It accepts a single argument of data
  given to the `authenticate` action and must return a promise. A resolved
  promise will indicate that the session is successfully authenticated. Any data
  resolved with the promise will be stored and accessible via the `session`
  state. A rejected promise will indicate authentication failed and will result
  in an unauthenticated session. Note that a default implementation of this
  function is defined if none is given and always returns a rejected promise
  resulting in an unauthenticated session. It is important that this function is
  defined when creating your authenticator.

* `restore(data)` (_function_): A function used to restore the session,
  typically after a page refresh. This function will be invoked when the
  middleware is first created. It accepts an argument with the data persisted to
  the session and must return a promise. A resolved promise indicates the
  session restore was successful and will result in the session successfully
  authenticated. A rejected promise indicates the session restore was
  unsuccessful and will result in an unauthenticated session. Note that a
  default implementation of this function is defined if none is given and always
  returns a rejected promise resulting in an unauthenticated session. It is
  important that you define this function when creating your authenticator.

* `invalidate(data)` (_function_): A function used to implement any cleanup
  logic when the session is invalidated. While the middleware and reducer will
  be responsible for clearing out the session data, you may need to perform some
  additional tasks such as invalidating an access token with your server. This
  function accepts an argument of the session data and must return a promise. A
  resolved promise indicates success and will result in a session becoming
  unauthenticated. A rejected promise will indicate failure and will result in a
  session remaining authenticated. Note that a default implementation of this
  function is defined if none is given which always returns a resolved promise.

**Example:**

Let's create a basic credentials authenticator that accepts an email and
password. The authenticator will use the credentials, authenticate with the
server, and return a token given by the server upon successful authentication.

`configureStore.js`

```javascript
import { createAuthMiddleware, createAuthenticator } from 'redux-simple-auth'
import { createStore, applyMiddleware } from 'redux'

const credentialsAuthenticator = createAuthenticator({
  name: 'credentials',
  authenticate(credentials) {
    return fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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
  authenticator: credentialsAuthenticator
})

// if combined with other authenticators
const authMiddleware = createAuthMiddleware({
  authenticators: [...authenticators, credentialsAuthenticator]
})
```

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
