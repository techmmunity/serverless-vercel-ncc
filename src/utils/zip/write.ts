import fs from "fs";
import JSZip from "jszip";

interface WriteParams {
	fileName: string;
	content: string;
	outputPath: string;
}

export const writeZip = ({ fileName, content, outputPath }: WriteParams) =>
	new Promise((resolve, reject) => {
		const zip = new JSZip();

		zip.file(`${fileName}.ts`, content);

		zip
			.generateNodeStream({ type: "nodebuffer", streamFiles: true })
			.pipe(fs.createWriteStream(`${outputPath}/${fileName}.zip`))
			.on("finish", () => resolve(undefined))
			.on("error", reject);
	});
