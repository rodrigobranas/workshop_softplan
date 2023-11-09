export default interface PurchaseDAO {
	getPurchases (cardNumber: string, month: number, year: number): Promise<any>;
}
