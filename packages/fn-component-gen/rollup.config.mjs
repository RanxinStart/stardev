import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: './index.ts',
    output: {
      file: './dist/index.js',
      format: 'esm',
      sourcemap: true
    },
    external: ['vue'],
    plugins: [
      esbuild({
        minify: true,
        target: 'esnext',
        platform: 'browser'
      })
    ]
  },
  {
    input: './index.ts',
    output: {
      file: './dist/index.d.ts',
      format: 'esm'
    },
    plugins: [dts()]
  }
]
