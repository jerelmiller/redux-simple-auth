import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs'
  },
  plugins: [resolve()],
  external: ['react', 'redux-simple-auth', 'react-redux']
}
