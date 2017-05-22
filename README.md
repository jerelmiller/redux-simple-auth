[![Build Status](https://travis-ci.org/jerelmiller/redux-simple-auth.svg?branch=master)](https://travis-ci.org/jerelmiller/redux-simple-auth)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm version](https://img.shields.io/npm/v/redux-simple-auth.svg?style=flat-square)](https://www.npmjs.com/package/redux-simple-auth)

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

## How does it work?

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

## Configuration

To configure the middleware, simply pass the `createAuthMiddleware` function the
configuration needed for your application. You may find more documentation on
each of these options below.

```javascript
const authMiddleware = createAuthMiddleware({
  authenticator: credentialsAuthenticator,
  // or
  authenticators: [facebookAuthenticator, githubAuthenticator],
  authorize: jwtAuthorizer,
  storage: localStorageStore
})
```

**Options:**

* `authenticator` (_object_): An authenticator used to authenticate the session.
  This option is typically used if you only need a single method of
  authentication. This should not be used in conjunction with `authenticators`.

* `authenticators` (_array_): An array of authenticators. If your application
  offers more than one method of authentication (Facebook Login, Github login,
  etc), you will pass the array of authenticators here. This option will be
  ignored if you use the `authenticator` option.

* `storage` (_object_): The storage mechanism used to persist the session.

* `authorize` (_function_): An authorization function used to attach header
  information to outgoing network requests.

## Authenticators

Authenticators implement the business logic responsible for authenticating the
session. An application may have one or many authenticators such as
authenticating credentials with one's own server, Facebook login, Github login,
etc. The authentication strategy chosen is dependent on the action dispatched
with the authentication payload.

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
  }
})
```

**Options:**

* `name` (_string_): The name of the authenticator. This is used by the
  middleware to identify the authenticator used during the lifecycle of the
  session.

* `authenticate(data)` (_function_): A function responsible for implementing the
  logic responsible for authentication. This function will be invoked when the
  [`authenticate`](#authenticateauthenticator-payload) action is dispatched. It
  accepts a single argument of data given to the `authenticate` action and must
  return a promise. A resolved promise will indicate that the session is
  successfully authenticated. Any data resolved with the promise will be stored
  and accessible via the `session` state. A rejected promise will indicate
  authentication failed and will result in an unauthenticated session. Note that
  a default implementation of this function is defined if none is given and
  always returns a rejected promise resulting in an unauthenticated session. It
  is important that this function is defined when creating your authenticator.

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

## Session Storage

Session storage is responsible for persisting the session state so that it may
survive a page refresh. Only one session store can be defined per application.
Redux Simple Auth makes it easy to swap the session storage to meet your needs.

```javascript
import { createAuthMiddleware } from 'redux-simple-auth'
import { createLocalStorageStore } from 'redux-simple-auth/storage'

const localStorageStore = createLocalStorageStore()

const authMiddleware = createAuthMiddleware({
  storage: localStorageStore
})
```

### Built-in session stores

Redux Simple Auth ships with 3 session stores.

**`localStorage` Store**

The local storage store stores its data in the browser's `localStorage`.

**Cookie Store**

The cookie store stores its data in a cookie.

**Adaptive Store**

If `localStorage` is available the adaptive store will use the local storage
store. If not, it will fallback to using the cookie store. This is the default
store.

### Customizing a built-in store

It is easy to customize a store. To do so, just import its respective `create*`
function to define it.

**`localStorage` store**

```javascript
import { createAuthMiddleware } from 'redux-simple-auth'
import { createLocalStorageStore } from 'redux-simple-auth/storage'

const localStorageStore = createLocalStorageStore({
  key: 'my-custom-app-key'
})

const authMiddleware = createAuthMiddleware({
  storage: localStorageStore
})
```

**Options:**

* `key` (_string_): The `localStorage` key used to persist the session.
  * _Default_: `'redux-simple-auth-session'`

**Cookie store**

```javascript
import { createAuthMiddleware } from 'redux-simple-auth'
import { createCookieStore } from 'redux-simple-auth/storage'

const cookieStore = createCookieStore({
  name: 'my-custom-app-cookie',
  path: '/',
  domain: 'example.com',
  secure: true,
  expires: 120
})

const authMiddleware = createAuthMiddleware({
  storage: cookieStore
})
```

**Options:**

* `name` (_string_): The name of the cookie used to persist the session
  * _Default_: `'redux-simple-auth-session'`

* `path` (_string_): A custom path used for the cookie (e.g. `'/something'`)
  * _Default_: `'/'`

* `domain` (_string_): The domain to use for the cookie (e.g. `'example.com'`,
  `.example.com` to include all subdomains, or `'subdomain.example.com'`). If
  not explicitly set, the cookie domain will default to the domain the session
  was authenticated on.
  * _Default_: `null`

* `secure` (_boolean_): Determines how the cookie should set the secure flag.
  * _Default_: `false`

* `expires` (_number_): The expiration time for the cookie in seconds. A value
  of `null` will make the cookie expire and get deleted when the browser is
  closed.
  * _Default_: `null`

**Adaptive Store**

```javascript
import { createAuthMiddleware } from 'redux-simple-auth'
import { createAdaptiveStore } from 'redux-simple-auth/storage'

const adaptiveStore = createAdaptiveStore({
  localStorageKey: 'my-custom-app-key',
  cookieName: 'my-custom-app-name',
  cookiePath: '/',
  cookieDomain: 'example.com',
  cookieSecure: true,
  cookieExpires: 120
})

const authMiddleware = createAuthMiddleware({
  storage: adaptiveStore
})
```

**Options:**

See the options for each store to for usage and defaults. If local storage is
available, the local storage store will get created using the local storage
options. If not, the cookie options will be passed to the cookie store upon
creation.

### Implementing a custom session store

To implement your own session store, simply define an object that handles the
serialization and deserialization of data.

```javascript
const mySessionStorage = {
  persist(data) {
    saveMyData(JSON.stringify(data))
  },
  restore() {
    return JSON.parse(getMyDataBack()) || {}
  }
}

const authMiddleware = createAuthMiddleware({
  storage: mySessionStorage
})
```

**Options:**

* `persist` (_function_): A serialization function that persists the session
  data.

* `restore` (_function_): A deserialization function that restores session data.


## Authorizer

An authorizer is responsible for setting up any needed data for outgoing network
requests. This function is invoked by the middleware when a
[`fetch`](#fetchurl-options) action is dispatched.

### Built-in authorizers

Redux Simple Auth does not currently ship with any built-in authorizers. As this
library matures, there are plans to implement some built-in authorizers. Refer
to the [custom authorizers](#implementing-a-custom-authorizer) section to build
your own.

### Implementing a custom authorizer

To implement a custom authorizer, simply define a function that accepts two
arguments: the session data, and a callback function.

```javascript

const bearerAuthorizer = (data, block) => {
  if (data.token) {
    block('Authorization', `Bearer ${data.token}`)
  }
}

const authMiddleware = createAuthMiddleware({
  authorizer: bearerAuthorizer
})
```

**Arguments:**

* `data` (_object_): The session data

* `block` (_function_): A callback function responsible for defining any headers
  needed for authorization. It accepts a header name for its first argument and
  that header's value as its second argument.

## Actions

Redux Simple Auth ships with several actions to aide in authentication for your
app. Simply import them and dispatch them as necessary.

### `authenticate(authenticator, payload)`

To authenticate the session, use the authenticate action. The middleware will
look up the corresponding authenticator and invoke its `authenticate` function.

```javascript
import { authenticate } from 'redux-simple-auth'

store.dispatch(
  authenticate('credentials', {
    email: 'user@example.com',
    password: 'password'
  })
)
```

**Arguments:**

* `authenticator` (_string_): The name of the authenticator used for
  authentication. The middleware will invoke this authenticator's `authenticate`
  function.

* `payload` (_any_): The payload given to the authenticator when authenticating.
  The middleware will pass this payload as an argument directly to the
  `authenticate` function.

### `fetch(url, [options])`

Fetch an endpoint that requires authentication. If an authorizer is configured
with the the middleware, the middleware will invoke the authorizer to attach any
headers needed for authentication.

It is important that you use this action and forego using `window.fetch` when
interacting with a server that requires authentication using data defined in the
session. This will invoke `window.fetch` under the hood after attaching any
authorization specific information from the authorizer. The API is the same API
used for `window.fetch` so you may use it interchangeably.

```javascript
import { fetch } from 'redux-simple-auth'

store.dispatch(
  fetch('https://www.example.com/me', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: 'Bob' })
  })
).then(res => res.json())
// etc
```

### `invalidateSession()`

Invalidate the session. This will clear the authenticated session data and
result in an unauthenticated session.

```javascript
import { invalidateSession } from 'redux-simple-auth'

store.dispatch(invalidateSession())
```


## License

MIT
