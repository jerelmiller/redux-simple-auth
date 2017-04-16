const createAuthMiddleware = () => store => next => action => next(action)

export default createAuthMiddleware
