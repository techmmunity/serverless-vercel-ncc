import { createArtifacts } from "hooks/create-artifacts";
import Serverless, { Options } from "serverless";

class ServerlessVercelNcc {
	public hooks: Record<string, any>;

	public constructor(
		public readonly serverless: Serverless,
		public readonly options: Options,
	) {
		console.log("~~~~~Plugin loaded~~~");

		this.hooks = {
			"before:deploy:deploy": createArtifacts,
			"before:package:package": createArtifacts,
		};
	}
}

export = ServerlessVercelNcc;
