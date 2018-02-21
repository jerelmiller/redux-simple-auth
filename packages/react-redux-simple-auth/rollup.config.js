export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs'
  },
  external: ['react', 'redux-simple-auth', 'react-redux']
}
