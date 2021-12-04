import { createArtifacts } from "hooks/create-artifacts";
import Serverless, { Options } from "serverless";

class ServerlessVercelNcc {
	public hooks: Record<string, any>;

	public constructor(
		public readonly serverless: Serverless,
		public readonly options: Options,
	) {
		this.hooks = {
			"before:package:createDeploymentArtifacts": () => createArtifacts(this),
			"before:deploy:function:packageFunction": () => createArtifacts(this),
		};
	}
}

export = ServerlessVercelNcc;
