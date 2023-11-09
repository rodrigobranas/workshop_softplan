import CalculateStatement from "../../application/usecase/CalculateStatement";
import HttpServer from "../http/HttpServer";
import PresenterFactory from "../presenter/PresenterFactory";

export default class MainController {

	constructor (readonly httpServer: HttpServer, readonly calculateStatement: CalculateStatement) {
		httpServer.on("get", "/cards/:cardNumber/statements", async function (params: any, body: any, headers: any) {
			const output = await calculateStatement.execute(params.cardNumber);
			return PresenterFactory.create(headers.accept).present(output);
		});
	}
}