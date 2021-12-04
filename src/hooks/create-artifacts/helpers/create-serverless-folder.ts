import { mkdirSync, existsSync, rmSync } from "fs";

export const createServerlessFolder = (path: string) => {
	if (existsSync(path)) {
		rmSync(path, {
			recursive: true,
			force: true,
		});
	}

	mkdirSync(path);
};
