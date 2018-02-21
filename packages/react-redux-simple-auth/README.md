[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# React Redux Simple Auth

React bindings for Redux Simple Auth

## Installation

npm:
```
npm install --save react-redux-simple-auth redux-simple-auth
```

yarn:
```
yarn add react-redux-simple-auth redux-simple-auth
```

## Usage

```javascript
import {
  LogoutRoute,
  ProtectedRoute,
  RouteUnlessAuthenticated,
  Session,
  WhenRestored
} from 'react-redux-simple-auth'

const App = () => (
  <WhenRestored>
    <Session
      render={({ isAuthenticated }) => (
        isAuthenticated ? (
          <Link to='/logout'>Logout</Link>
        ) : (
          <Link to='/login'>Login</Link>
        )
      )}
    />
    <Switch>
      <LogoutRoute path="/logout" redirect="/">
      <ProtectedRoute path="/dashboard" component={Dashboard}>
      <RouteUnlessAuthenticated path="/login" component={Login}>
    </Switch>
  </WhenRestored>
)
```
