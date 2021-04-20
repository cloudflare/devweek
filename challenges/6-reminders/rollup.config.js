import typescript from '@rollup/plugin-typescript';

export default {
	input: 'src/index.ts',
	output: {
		format: 'esm',
		file: 'build/index.js',
		sourcemap: false,
	},
	plugins: [
		typescript()
	]
}
