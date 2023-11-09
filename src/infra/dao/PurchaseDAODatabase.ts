import PurchaseDAO from "../../application/dao/PurchaseDAO";
import Connection from "../database/Connection";

export default class PurchaseDAODatabase implements PurchaseDAO {

	constructor (readonly connection: Connection) {
	}

	async getPurchases (cardNumber: string, month: number, year: number) {
		const purchasesData = await this.connection.query("select * from branas.purchase where card_number = $1 and extract(month from date)::integer = $2 and extract(year from date)::integer = $3", [cardNumber, month - 1, year]);
		return purchasesData;
	}
}
