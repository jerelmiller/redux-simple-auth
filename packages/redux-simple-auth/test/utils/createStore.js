import { applyMiddleware, combineReducers, createStore } from 'redux'
import reducer from '../../src/reducer'

export default ({ middleware, initialState = {} }) =>
  createStore(
    combineReducers({ session: reducer }),
    initialState,
    applyMiddleware(middleware)
  )
