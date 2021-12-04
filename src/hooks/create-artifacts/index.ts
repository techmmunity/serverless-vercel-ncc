/* eslint-disable no-await-in-loop */

import { chunk, getRootPath } from "@techmmunity/utils";
import { Context } from "types/context";
import { getAllNodeFunctions } from "./helpers/get-all-node-functions";
import { createServerlessFolder } from "./helpers/create-serverless-folder";
import { compileAndZip } from "./helpers/compile-and-zip";

const CONCURRENCY = 3;

export const createArtifacts = async (context: Context) => {
	const functions = getAllNodeFunctions(context);

	const serverlessFolderPath = getRootPath(".serverless");

	createServerlessFolder(serverlessFolderPath);

	const concurrency = context.opt?.concurrency || CONCURRENCY;

	const chunks = chunk(functions, concurrency);

	const results: Array<PromiseSettledResult<any>> = [];

	for (const c of chunks) {
		const result = await Promise.allSettled(
			c.map(funcName =>
				compileAndZip({
					context,
					funcName,
					serverlessFolderPath,
				}),
			),
		);

		results.push(...result);
	}

	/**
	 * Log all errors
	 */
	results
		.filter(({ status }) => status !== "fulfilled")
		.forEach((err: any) => {
			context.serverless.cli.log("Fail to compile a file", undefined, {
				color: "red",
			});
			console.error(err);
		});
};
