[![Build Status](https://travis-ci.org/jerelmiller/redux-simple-auth.svg?branch=master)](https://travis-ci.org/jerelmiller/redux-simple-auth)

# Redux Simple Auth

Redux middleware inspired by the wonderful [Ember Simple
Auth](http://ember-simple-auth.com/) library

### DISCLAIMER: This package is still in active development

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

## License

MIT
