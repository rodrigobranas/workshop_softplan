import CurrencyGateway from "../gateway/CurrencyGateway";
import StatementRepository from "../repository/StatementRepository";
import Purchase from "../../domain/Purchase";

export default class CalculateStatement {

	constructor (readonly statementRepository: StatementRepository, readonly currencyGateway: CurrencyGateway) {
	}

	async execute (cardNumber: string): Promise<Output> {
		const date = new Date();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		const currency = await this.currencyGateway.getCurrency();
		const statement = await this.statementRepository.getStatement(cardNumber, month, year);
		const total = statement.getTotal(currency.amount);
		return {
			cardNumber: statement.cardNumber,
			month: statement.month,
			year: statement.year,
			total,
			purchases: statement.purchases.map((purchase: Purchase) => ({
				descriptor: purchase.descriptor,
				amount: purchase.amount,
				date: purchase.date,
				currency: purchase.currency
			}))
		};
	}
}

export type Output = {
	cardNumber: string,
	month: number,
	year: number,
	total: number,
	purchases: { descriptor: string, amount: number, date: Date, currency: string }[]
}