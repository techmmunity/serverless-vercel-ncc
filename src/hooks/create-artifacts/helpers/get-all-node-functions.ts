import { FunctionDefinitionImage } from "serverless";
import { Context } from "types/context";

const isNodeRuntime = (runtime: string) => runtime.match(/node/);

export const getAllNodeFunctions = (context: Context) => {
	const functions = context.serverless.service.getAllFunctions();

	return functions.filter(funcName => {
		const func = context.serverless.service.getFunction(funcName);

		const funcAsImage = func as FunctionDefinitionImage;

		/*
		 * If `uri` is provided or simple remote image path, it means the
		 * image isn't built by Serverless so we shouldn't take care of it
		 */
		if (typeof funcAsImage.image === "string") {
			return false;
		}

		return isNodeRuntime(
			func.runtime || context.serverless.service.provider.runtime || "nodejs",
		);
	});
};
