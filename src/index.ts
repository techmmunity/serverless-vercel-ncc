import { createArtifacts } from "hooks/create-artifacts";
import Serverless, { Options } from "serverless";
import { Context } from "types/context";

class ServerlessVercelNcc {
	public opt: Context["opt"];

	public hooks: Record<string, any>;

	public constructor(
		public readonly serverless: Serverless,
		public readonly options: Options,
	) {
		this.opt = serverless.service.custom?.ncc;

		this.hooks = {
			"before:package:createDeploymentArtifacts": () => createArtifacts(this),
			"before:deploy:function:packageFunction": () => createArtifacts(this),
		};
	}
}

export = ServerlessVercelNcc;
