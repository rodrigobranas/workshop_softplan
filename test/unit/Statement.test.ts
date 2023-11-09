import Statement from "../../src/domain/Statement"

test("Deve calcular a fatura", function () {
	const statement = new Statement("1234", 10, 2023);
	statement.addPurchase("A", 100, new Date(), "USD");
	statement.addPurchase("B", 200, new Date(), "BRL");
	statement.addPurchase("C", 500, new Date(), "BRL");
	const total = statement.getTotal(3);
	expect(total).toBe(1000);
});
