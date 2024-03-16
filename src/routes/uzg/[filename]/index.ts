import { FTP } from "ftp-ts";

import { pipeline } from "node:stream";
import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async (requestEvent) => {
	if (!requestEvent.params.filename) {
		return;
	}
	const connection = await FTP.connect({
		host: "dinxperfm.freeddns.org",
		user: "UZG",
		password: "4862KpZ2",
	});
	let fileinfo;
	try {
		fileinfo = await connection.fileInfo(requestEvent.params.filename);
	} catch (error) {
		//
	}

	requestEvent.status(fileinfo ? 200 : 404);
	if (!fileinfo) {
		return;
	}
	const stream = await connection.get(requestEvent.params.filename);
	stream.addListener("close", () => {
		connection.end();
	});

	requestEvent.headers.set("Content-Type", "audio/mpeg");
	requestEvent.headers.set("Content-Length", `${fileinfo.size}`);

	const destination = requestEvent.getWritableStream();
	pipeline(stream, destination as any, () => {
		connection.end();
	});
};
