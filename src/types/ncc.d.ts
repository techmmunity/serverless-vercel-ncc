declare module "@vercel/ncc" {
	interface Options {
		externals: Array<string>;
		minify?: boolean;
		sourceMap?: boolean;
		sourceMapRegister?: boolean;
		quiet?: boolean;
	}

	interface Output {
		code: string;
	}

	const compiler: (path: string, options: Options) => Promise<Output>;

	// eslint-disable-next-line import/no-default-export
	export default compiler;
}
