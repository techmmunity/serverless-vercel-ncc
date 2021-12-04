import { createWriteStream } from "fs";
import * as JSZip from "jszip";

interface WriteParams {
	zipName: string;
	filePath: string;
	content: string;
	outputPath: string;
}

export const writeZip = ({
	filePath,
	zipName,
	content,
	outputPath,
}: WriteParams) =>
	new Promise((resolve, reject) => {
		const zip = new JSZip();

		zip.file(`${filePath}.js`, content);

		zip
			.generateNodeStream({ type: "nodebuffer", streamFiles: true })
			.pipe(createWriteStream(`${outputPath}/${zipName}.zip`))
			.on("finish", () => resolve(undefined))
			.on("error", reject);
	});
