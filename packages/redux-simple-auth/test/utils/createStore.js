import { applyMiddleware, createStore } from 'redux'
import reducer from '../../src/reducer'

export default ({ middleware, initialState = {} }) =>
  createStore(reducer, initialState, applyMiddleware(middleware))
