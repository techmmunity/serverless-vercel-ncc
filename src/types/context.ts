import Serverless from "serverless";

interface Options {
	concurrency?: number;
	excludeDependencies?: boolean;
	minify?: boolean;
	sourceMap?: boolean;
	sourceMapRegister?: boolean;
}

export interface Context {
	serverless: Serverless;
	opt?: Options;
}
