import HttpServer from "./HttpServer";
import express from "express";

export default class ExpressAdapter implements HttpServer {
	app: any;

	constructor () {
		this.app = express();
	}

	on(method: string, url: string, callback: Function): void {
		this.app[method](url, async function (req: any, res: any) {
			const output = await callback(req.params, req.body, req.headers);
			if (req.headers.accept === "text/html") {
				res.send(output);
			}
			if (req.headers.accept === "application/json") {
				res.json(output);
			}
		});
	}

	listen(port: number): void {
		return this.app.listen(port);
	}

}