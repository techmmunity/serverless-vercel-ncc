import { beforeDeploy } from "hooks/before-deploy";
import Serverless, { Options } from "serverless";

class ServerlessVercelNcc {
	public hooks: Record<string, any>;

	public constructor(
		public readonly serverless: Serverless,
		public readonly options: Options,
	) {
		this.hooks = {
			"before:deploy:deploy": beforeDeploy,
		};
	}
}

export = ServerlessVercelNcc;
