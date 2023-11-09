import Statement from "../../domain/Statement";

export default interface StatementRepository {
	getStatement (cardNumber: string, month: number, year: number): Promise<Statement>;
}
