[![Build Status](https://travis-ci.org/jerelmiller/redux-simple-auth.svg?branch=master)](https://travis-ci.org/jerelmiller/redux-simple-auth)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm version](https://img.shields.io/npm/v/redux-simple-auth.svg?style=flat-square)](https://www.npmjs.com/package/redux-simple-auth)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

# Redux Simple Auth

Redux Simple Auth is a library for implementing authentication and authorization
within redux applications. Inspired by the wonderful [Ember Simple
Auth](http://ember-simple-auth.com/) library, its aim is to make authentication
/ authorization simple and flexible for any application.

## Table of Contents

* [Installation](#installation)
* [Development](#development)
* [Usage](#usage)
  * [Setup](#setup)
    * [Middleware](#apply-the-middleware)
    * [Reducer](#add-the-reducer)
    * [Store enhancer](#optionally-add-the-store-enhancer)
* [How does it work?](#how-does-it-work)
* [Configuration](#configuration)
* [Authenticators](#authenticators)
  * [Built-in Authenticators](#built-in-authenticators)
  * [Custom Authenticators](#implementing-a-custom-authenticator)
* [Session Storage](#session-storage)
  * [Built-in Session Stores](#built-in-session-stores)
  * [Customize a Store](#customizing-a-built-in-store)
  * [Custom Stores](#implementing-a-custom-session-store)
* [Authorizer](#authorizer)
  * [Built-in Authorizers](#built-in-authorizers)
  * [Custom Authorizers](#implementing-a-custom-authorizer)
  * [Store enhancer](#store-enhancer)
* [Refreshing the session](#refreshing-the-session)
* [Actions](#actions)
* [Selectors](#selectors)
* [Action Types](#action-types)
* [TODO](#todo)
* [License](#license)

## Installation

npm:
```
npm install --save redux-simple-auth
```

yarn:
```
yarn add redux-simple-auth
```

## Development

If you're trying to develop with this package check out the [development](./DEVELOPMENT.md)
docs for environment setup information.

## Usage

### Setup

This library ships with middleware, a reducer, and an optional store enhancer.
You will need to do the following:

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

##### Optionally add the store enhancer

In order to use the enhancer, you will need to provide it with the storage used.
If you do not need a custom storage adapter, you may import the default storage.

```javascript
// ...
import {
  createAuthMiddleware,
  getInitialAuthState,
  storage // or custom storage creator
} from 'redux-simple-auth'
import { createStore, compose, applyMiddleware } from 'redux'

const authMiddleware = createAuthMiddleware(/*...*/)

const store = createStore(
  rootReducer,
  /* initialState, */
  compose(
    applyMiddleware(authMiddleware),
    getInitialAuthState({ storage })
  )
)
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
  storage: localStorageStore,
  refresh: refresher
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

* `refresh` (_function_): A function used to refresh the session data after each
  request.

* `syncTabs` (_boolean_): Determines whether session state should be synced
  across tabs or not.
  * _Default_: `false`

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

Redux Simple Auth ships with 2 authenticators. If you would like to build your
own, refer to the [custom authenticators](#implementing-a-custom-authenticator)
documentation.

**Credentials**

An authenticator aimed to abstract away many of the common authentication
scenarios used when authenticating via credentials. You may find more
documentation on the options available below.

```javascript
import { createCredentialsAuthenticator } from 'redux-simple-auth'

const credentialsAuthenticator = createCredentialsAuthenticator({
  endpoint: '/api/authenticate'
})
```

When authenticating via the `authenticate` action, simply give the credentials
payload as the second argument.

```javascript
const credentials = { email: 'test@example.com', password: 'F@keP@ssword!' }

store.dispatch(authenticate('credentials', credentials))
```

**Options**

* `endpoint` (_string_): The endpoint that will be called with the credentials
  during authentication.

* `contentType` (_string_): Specifies the `Content-Type` header for the request.
  * _Default_: `application/json`

* `headers` (_object_): Allows you to define any additional headers for the
  request
  * _Default_: `{}`

* `method` (_string_): Allows you to define the HTTP method used for the
  request.
  * _Default_: `POST`

* `transformRequest`: (_function_): A function that accepts the credentials data
  and transforms it for the request body. This is useful if you need to encode
  the request body in a different way, such as an
  `application/x-www-form-urlencoded` request.
  * _Default_: `JSON.stringify`

```javascript
const credentialsAuthenticator = createCredentialsAuthenticator({
  endpoint: '/api/authenticate',
  contentType: 'application/x-www-form-urlencoded',
  transformRequest(credentials) {
    return Object.keys(credentials)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(credentials[key])}`)
      .join('&')
  }
})
```

* `transformResponse`: (_function_): A function that allows you to transform the
  payload returned from the server that will be saved in the `session` state.
  * _Default_: `(payload) => payload`

```javascript
const credentialsAuthenticator = createCredentialsAuthenticator({
  endpoint: '/api/authenticate',
  transformResponse: data => ({
    token: data.response.token
  })
})
```

* `restore`: (_function_): A restore function for the authenticator. The default
  implementation will resolve if the data is non-empty. If you would like more
  custom behavior, see the section on [custom
  authenticators](#implementing-a-custom-authenticator) for usage information.

* `invalidate`: (_function_): An invalidation function for the authenticator.
  The default implementation will always resolve. If you would like more custom
  behavior, see the section on [custom
  authenticators](#implementing-a-custom-authenticator) for usage information.

**OAuth2 Implicit Grant (alpha)**

An authenticator to handle OAuth2 implicit grant flow. This validates that the
data passed to `authenticate` has an `access_token` parameter.

**NOTE:** This authenticator is currently in alpha. If you need
more robust authentication/restore behavior, consider building your own [custom
authenticator](#implementing-a-custom-authenticator).

```javascript
import { createOauth2ImplicitGrantAuthenticator } from 'redux-simple-auth'

const oauth2ImplicitGrantAuthenticator = createOauth2ImplicitGrantAuthenticator()
```

**Options**

There are currently no options for this authenticator. As OAuth2 support is
built out, options will be added to better support extensibility.

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
  invalidate(data) {
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

* `invalidate(data)` (_function_): A function responsible for doing any
  additional cleanup of the authenticated data. This function will be invoked
  when the [`invalidateSession`](#invalidatesession) action is dispatched. It
  accepts a single argument with the data persisted to the session and must
  return a promise. A resolved promise will clear the authenticated session data
  and result in an unauthenticated session. A rejected promise will leave the
  session authenticated. Note that a default implementation of this
  function is defined if none is given and always returns a resolved promise.

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
  },
  invalidate(data) {
    return fetch('/api/invalidate', { method: 'DELETE' })
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
import {
  createAuthMiddleware,
  createLocalStorageStore
} from 'redux-simple-auth'

const localStorageStore = createLocalStorageStore()

const authMiddleware = createAuthMiddleware({
  storage: localStorageStore
})
```

### Built-in session stores

Redux Simple Auth ships with 4 session stores.

**`localStorage` Store**

The local storage store stores its data in the browser's `localStorage`.

**`sessionStorage` Store**

The session storage store stores its data in the browser's `sessionStorage`.

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
import {
  createAuthMiddleware,
  createLocalStorageStore
} from 'redux-simple-auth'

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

**`sessionStorage` store**

```javascript
import {
  createAuthMiddleware,
  createSessionStorageStore
} from 'redux-simple-auth'

const sessionStorageStore = createSessionStorageStore({
  key: 'my-custom-app-key'
})

const authMiddleware = createAuthMiddleware({
  storage: sessionStorageStore
})
```

**Options:**

* `key` (_string_): The `sessionStorage` key used to persist the session.
  * _Default_: `'redux-simple-auth-session'`

**Cookie store**

```javascript
import {
  createAuthMiddleware,
  createCookieStore
} from 'redux-simple-auth'

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
import {
  createAuthMiddleware,
  createAdaptiveStore
} from 'redux-simple-auth'

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

Redux Simple Auth currently ships with 1 authorizer. As this
library matures, there are plans to implement more built-in authorizers. Refer
to the [custom authorizers](#implementing-a-custom-authorizer) section to build
your own.

**OAuth2 Bearer**

This authorizer is responsible for setting the `Authorization` header using the
`Bearer` scheme.

```javascript
import { createAuthMiddleware, oauth2BearerAuthorizer } from 'redux-simple-auth'

const authMiddleware = createAuthMiddleware({
  authorize: oauth2BearerAuthorizer
})
```

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
  authorize: bearerAuthorizer
})
```

**Arguments:**

* `data` (_object_): The session data

* `block` (_function_): A callback function responsible for defining any headers
  needed for authorization. It accepts a header name for its first argument and
  that header's value as its second argument.

### Store Enhancer

There may be cases where you may want the redux store initialized with the
sesion data from the storage device. The store enhancer does just that. On store
initialization, it will ask the storage device for the session data.

```javascript
const enhancer = getInitialAuthState({ storage })
```

**Options:**

* `storage` (_object_): The storage mechanism used to store the session. **This
  must** be the same storage device configured with the middleware.

## Refreshing the session

There may be cases where you need to refresh the session data after each
request. For example, you may implement sliding sessions where requests to your
backend give you an updated session token.

To use this feature, simply define a `refresh` function that accepts the raw
response as an argument. Note, this will only get called for requests made
through the dispatched [`fetch`](#fetchurl-options) action.

```javascript
const refresh = response => ({
  token: response.headers.get('x-access-token')
})

const authMiddleware = createAuthMiddleware({
  refresh
})
```

There may be cases where you want to conditionally update the session. To skip
the session update, simply return `null` from your `refresh` function.

```javascript
const refresh = response => {
  const contentType = response.headers.get('content-type')

  if (contentType === 'text/html') {
    return null
  }

  return { token: response.headers.get('x-access-token') }
}
```

**Arguments:**

* `response`
  ([_Response_](https://developer.mozilla.org/en-US/docs/Web/API/Response)): The
  raw response returned from `fetch`

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

### `clearError()`

Clears the last error and resets failed auth state. Useful if a user has failed
authentication but has navigated away from the form.

```javascript
import { clearError } from 'redux-simple-auth'

store.dispatch(clearError())
```

### `invalidateSession()`

Invalidate the session. This will clear the authenticated session data and
result in an unauthenticated session.

```javascript
import { invalidateSession } from 'redux-simple-auth'

store.dispatch(invalidateSession())
```

### `updateSession()`

Update the session with new data. If you are using the `refresh` option for the
middleware, this will automatically be dispatched for you. Use this only if you
need to manually update the session data outside of the request lifecycle.

```javascript
import { updateSession } from 'redux-simple-auth'

store.dispatch(updateSession({ token: 'a-new-token' }))
```

## Selectors

To aid in selecting specific session state, redux simple auth ships with a few
selectors for your convenience. All selectors take the store `state` as an
argument. Note this is the entire store state, not just the session state.

### `getSessionData(state)`

(_object_) Returns the session data set when user was authenticated. If not yet
authenticated, this returns an empty object.

```javascript
import { getSessionData } from 'redux-simple-auth'

const mapStateToProps = state => ({
  session: getSessionData(state)
})
```

### `getIsAuthenticated(state)`

(_boolean_) Returns whether the user is authenticated.

```javascript
import { getIsAuthenticated } from 'redux-simple-auth'

const mapStateToProps = state => ({
  isAuthenticated: getIsAuthenticated(state)
})
```

### `getAuthenticator(state)`

(_string_) Returns the `authenticator` used when authenticating. If not yet
authenticated, this is set to `null`.

```javascript
import { getAuthenticator } from 'redux-simple-auth'

const mapStateToProps = state => ({
  authenticator: getAuthenticator(state)
})
```

### `getIsRestored(state)`

(_boolean_) Returns whether the session state has been restored. Useful if you
need to block rendering until the session state has been fully initialized.

```javascript
import { getIsRestored } from 'redux-simple-auth'

const mapStateToProps = state => ({
  isRestored: getIsRestored(state)
})
```

### `getLastError(state)`

(_any_) Returns the last authentication error received if authentication has
failed. This value is the same value passed to the rejected promise in the
authenticator's `authenticate` function.

```javascript
import { getLastError } from 'redux-simple-auth'

const mapStateToProps = state => ({
  lastError: getLastError(state)
})
```

### `getHasFailedAuth(state)`

(_boolean_) Returns whether the user has at least one failed authentication
attempt. Will reset back to `false` once authentication has succeeded.

```javascript
import { getHasFailedAuth } from 'redux-simple-auth'

const mapStateToProps = state => ({
  hasFailedAuth: getHasFailedAuth(state)
})
```

## Action Types

If you just plain need to hook into actions dispatched from `redux-simple-auth`,
you may import the action types themselves for use within your own reducers.

```javascript
import { actionTypes } from 'redux-simple-auth'

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.AUTHENTICATE_FAILED:
      // do something
  }
}
```

The following actions are available action types

* `AUTHENTICATE`
* `AUTHENTICATE_FAILED`
* `AUTHENTICATE_SUCCEEDED`
* `CLEAR_ERROR`
* `FETCH`
* `INVALIDATE_SESSION`
* `INVALIDATE_SESSION_FAILED`
* `RESTORE`
* `RESTORE_FAILED`
* `UPDATE_SESSION`

## TODO

- [ ] Built-in authenticators for common scenarios
  - [x] Credentials
  - [ ] Devise
  - [ ] OAuth
  - [ ] Facebook Login
  - [ ] Github Login
  - [ ] Google login
- [ ] Built-in authorizers
  - [ ] Devise
  - [x] OAuth2 Bearer
- [ ] Integration with React Router v3
- [ ] Integration with React Router v4
- [ ] Typescript/Flow support
- [ ] Create example applications
- [ ] Solutions for server-side rendering
- [ ] Sync state across tabs

## License

MIT
