/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

import Serverless, {
	FunctionDefinitionHandler,
	FunctionDefinitionImage,
} from "serverless";
import Ncc from "@vercel/ncc";
import { mkdirSync } from "fs";

import { chunk, getRootPath } from "@techmmunity/utils";
import { writeZip } from "utils/zip/write";

const isNodeRuntime = (runtime: string) => runtime.match(/node/);

const getAllNodeFunctions = (serverless: Serverless) => {
	const functions = serverless.service.getAllFunctions();

	return functions.filter(funcName => {
		const func = serverless.service.getFunction(funcName);

		const funcAsImage = func as FunctionDefinitionImage;

		/*
		 * If `uri` is provided or simple remote image path, it means the
		 * image isn't built by Serverless so we shouldn't take care of it
		 */
		if (typeof funcAsImage.image === "string") {
			return false;
		}

		return isNodeRuntime(
			func.runtime || serverless.service.provider.runtime || "nodejs",
		);
	});
};

const getHandlerFile = (handler: any) => {
	// Check if handler is a well-formed path based handler.
	const handlerEntries = /(.*)\..*?$/.exec(handler);
	// TODO Remove
	console.log("handlerEntries", handlerEntries);

	const [, handlerEntry] = handlerEntries!;

	return handlerEntry;
};

const CONCURRENCY = 3;

export const beforeDeploy = async (serverless: Serverless) => {
	const packageJson = require(getRootPath("package.json"));

	// TODO Remove
	console.log("packageJson", packageJson);

	const externals = [
		...Object.keys(packageJson.dependencies),
		...Object.keys(packageJson.devDependencies),
	];
	// TODO Remove
	console.log("externals", externals);

	const functions = getAllNodeFunctions(serverless);
	// TODO Remove
	console.log("functions", functions);

	const chunks = chunk(functions, CONCURRENCY);

	const results: Array<any> = [];

	const serverlessFolderPath = getRootPath(".serverless");
	// TODO Remove
	console.log("serverlessFolderPath", serverlessFolderPath);

	mkdirSync(serverlessFolderPath);

	for (const c of chunks) {
		const result = await Promise.allSettled(
			c.map(funcName => {
				const func = serverless.service.getFunction(
					funcName,
				) as FunctionDefinitionHandler;

				const handlerFile = getHandlerFile(func.handler);
				// TODO Remove
				console.log("handlerFile", handlerFile);

				const file = `./${handlerFile}.ts`;

				/**
				 * Promise chain is necessary
				 */
				return Ncc(file, {
					externals,
					quiet: true,
					minify: true,
				}).then(({ code }) => {
					const fileName = file.split("/").pop()!.split(".").shift()!;
					// TODO Remove
					console.log("fileName", fileName);

					return writeZip({
						fileName,
						content: code,
						outputPath: serverlessFolderPath,
					}).then(() => {
						// TODO Remove
						console.log("artifact", `${serverlessFolderPath}/${fileName}.zip`);
						// Only sets the artifact if successfully writes the zip file
						func.package = {
							artifact: `${serverlessFolderPath}/${fileName}.zip`,
						};
					});
				});
			}),
		);

		results.push(...result);
	}

	/**
	 * Log all errors
	 */
	results.filter(Boolean).forEach(() => {
		serverless.cli.log("Fail to compile a file", undefined, {
			color: "red",
		});
	});
};
