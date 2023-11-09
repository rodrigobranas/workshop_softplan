import Purchase from "./Purchase";

export default class Statement {
	purchases: Purchase[];

	constructor (readonly cardNumber: string, readonly month: number, readonly year: number) {
		this.purchases = [];
	}

	addPurchase (descriptor: string, amount: number, date: Date, currency: string) {
		this.purchases.push(new Purchase(descriptor, amount, date, currency));
	}

	getTotal (currency: number) {
		let total = 0;
		for (const purchase of this.purchases) {
			if (purchase.currency === "USD") {
				total += purchase.amount * currency;
			} else {
				total += purchase.amount;
			}
		}
		return total;
	}
}