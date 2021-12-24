/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import { getRootPath } from "@techmmunity/utils";
import * as Ncc from "@vercel/ncc";
import { FunctionDefinitionHandler } from "serverless";
import { Context } from "types/context";

import { writeZip } from "utils/zip/write";

interface CompileAndZipParams {
	context: Context;
	funcName: string;
	serverlessFolderPath: string;
}

/**
 *
 *
 *
 */

const getExternalModules = (context: Context) => {
	const externals = context.opt?.dependenciesToExclude || [];

	if (context.opt?.excludeDependencies) {
		const packageJson = require(getRootPath("package.json"));

		return [
			...externals,
			...Object.keys(packageJson.dependencies),
			...Object.keys(packageJson.devDependencies),
		];
	}

	return externals;
};

/**
 *
 *
 *
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getHandlerPath = (handler: any) => {
	// Check if handler is a well-formed path based handler.
	const handlerEntries = /(.*)\..*?$/.exec(handler);

	// Get the file path
	const [, handlerEntry] = handlerEntries!;

	return {
		rootPath: getRootPath(`${handlerEntry}.ts`),
		path: handlerEntry,
	};
};

/**
 *
 *
 *
 */

export const compileAndZip = ({
	funcName,
	context,
	serverlessFolderPath,
}: CompileAndZipParams) => {
	const externals = getExternalModules(context);

	const func = context.serverless.service.functions[
		funcName
	] as FunctionDefinitionHandler;

	const { rootPath, path } = getHandlerPath(func.handler);

	return Ncc(rootPath, {
		externals,
		quiet: true,
		minify: context.opt?.minify,
		sourceMap: context.opt?.sourceMap,
		sourceMapRegister: context.opt?.sourceMapRegister,
	}).then(({ code }) =>
		writeZip({
			filePath: path,
			zipName: funcName,
			content: code,
			outputPath: serverlessFolderPath,
		}).then(() => {
			// Only sets the new values if successfully writes the zip file
			func.package = {
				artifact: `${serverlessFolderPath}/${funcName}.zip`,
			};
		}),
	);
};
