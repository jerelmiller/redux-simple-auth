import React from 'react'
import Session from './Session'

const WhenRestored = ({ children }) => (
  <Session render={({ isRestored }) => (isRestored ? children : null)} />
)

export default WhenRestored
