let warnings = []

const warning = (condition, message) => {
  if (!condition) {
    warnings.push(message)
  }
}

warning.getWarnings = () => warnings
warning.reset = () => (warnings = [])

export default warning
