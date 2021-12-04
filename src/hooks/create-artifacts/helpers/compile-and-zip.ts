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
	if (context.opt?.excludeDependencies) {
		const packageJson = require(getRootPath("package.json"));

		const externals = [
			...Object.keys(packageJson.dependencies),
			...Object.keys(packageJson.devDependencies),
		];

		return externals;
	}

	return [];
};

/**
 *
 *
 *
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getOriginalFilePath = (handler: any) => {
	// Check if handler is a well-formed path based handler.
	const handlerEntries = /(.*)\..*?$/.exec(handler);

	// Get the file path
	const [, handlerEntry] = handlerEntries!;

	return getRootPath(`${handlerEntry}.ts`);
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

	const originalFilePath = getOriginalFilePath(func.handler);

	return Ncc(originalFilePath, {
		externals,
		quiet: true,
		minify: true,
	}).then(({ code }) =>
		writeZip({
			fileName: funcName,
			content: code,
			outputPath: serverlessFolderPath,
		}).then(() => {
			// Only sets the new values if successfully writes the zip file
			func.handler = `${funcName}.js`;
			func.package = {
				artifact: `${serverlessFolderPath}/${funcName}.zip`,
			};
		}),
	);
};
