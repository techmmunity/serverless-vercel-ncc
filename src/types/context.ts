import Serverless from "serverless";

interface Options {
	concurrency?: number;
	excludeDependencies?: boolean;
}

export interface Context {
	serverless: Serverless;
	opt?: Options;
}
