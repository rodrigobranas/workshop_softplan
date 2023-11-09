import axios from "axios";
import sinon from "sinon";
import PurchaseDAODatabase from "../../src/infra/dao/PurchaseDAODatabase";

test("Deve testar a API de Statement no formato HTML", async function () {
	const response = await axios.get("http://localhost:3001/cards/1234123412341234/statements", { headers: { "Accept": "text/html" } });
	const statement = response.data;
	expect(statement).toBe("<body><div><h4>11/2023</h4><h3>R$690</h3></div><table><tr><td>Amazon</td><td>100</td><td>10/10/2023>/td></tr>,<tr><td>Netflix</td><td>30</td><td>09/10/2023>/td></tr>,<tr><td>MELI</td><td>300</td><td>02/10/2023>/td></tr>,<tr><td>Google Ads</td><td>200</td><td>20/10/2023>/td></tr></table></body>");
});

test("Deve testar a API de Statement no formato JSON", async function () {
	// sinon.stub(PurchaseDAODatabase.prototype, "getPurchases").resolves([]);
	const response = await axios.get("http://localhost:3001/cards/1234123412341234/statements", { headers: { "Accept": "application/json" } });
	const statement = response.data;
	expect(statement.total).toBe(690);
	expect(statement.month).toBe(11);
	expect(statement.year).toBe(2023);
	expect(statement.purchases).toHaveLength(4);
});
