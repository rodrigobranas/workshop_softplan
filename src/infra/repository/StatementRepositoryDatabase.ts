import Connection from "../database/Connection";
import StatementRepository from "../../application/repository/StatementRepository";
import Purchase from "../../domain/Purchase";
import Statement from "../../domain/Statement";

export default class StatementRepositoryDatabase implements StatementRepository {

	constructor (readonly connection: Connection) {
	}

	async getStatement(cardNumber: string, month: number, year: number): Promise<Statement> {
		const purchasesData = await this.connection.query("select * from branas.purchase where card_number = $1 and extract(month from date)::integer = $2 and extract(year from date)::integer = $3", [cardNumber, month - 1, year]);
		const statement = new Statement(cardNumber, month, year);
		for (const purchaseData of purchasesData) {
			statement.purchases.push(new Purchase(purchaseData.descriptor, parseFloat(purchaseData.amount), purchaseData.date, purchaseData.currency));
		}
		return statement;
	}

}