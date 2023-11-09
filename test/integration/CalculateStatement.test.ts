import axios from "axios";
import sinon from "sinon";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";
import CurrencyGatewayHttp from "../../src/infra/gateway/CurrencyGatewayHttp";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import PurchaseDAODatabase from "../../src/infra/dao/PurchaseDAODatabase";
import PurchaseDAO from "../../src/application/dao/PurchaseDAO";
import CurrencyGateway from "../../src/application/gateway/CurrencyGateway";
import CalculateStatement from "../../src/application/usecase/CalculateStatement";
import StatementRepositoryDatabase from "../../src/infra/repository/StatementRepositoryDatabase";
import HTMLPresenter from "../../src/infra/presenter/HTMLPresenter";
import JSONPresenter from "../../src/infra/presenter/JSONPresenter";

test("Deve testar o cálculo do Statement no formato HTML", async function () {
	const cardNumber = "1234123412341234";
	const format = "text/html";
	// Fake
	const purchaseDAO: PurchaseDAO = {
		async getPurchases (cardNumber: string, month: number, year: number): Promise<any> {
			return [
				{ descriptor: "A", amount: 100, date: new Date(), currency: "USD" }
			]
		}
	}
	const currencyGateway: CurrencyGateway = {
		async getCurrency(): Promise<any> {
			return {
				amount: 3
			}
		}
	}
	const connection = new PgPromiseAdapter();
	const statementRepository = new StatementRepositoryDatabase(connection);
	const calculateStatement = new CalculateStatement(statementRepository, currencyGateway);
	const output = await calculateStatement.execute(cardNumber);
	const presenter = new HTMLPresenter();
	const statement = presenter.present(output);
	expect(statement).toBe("<body><div><h4>11/2023</h4><h3>R$690</h3></div><table><tr><td>Amazon</td><td>100</td><td>10/10/2023>/td></tr>,<tr><td>Netflix</td><td>30</td><td>09/10/2023>/td></tr>,<tr><td>MELI</td><td>300</td><td>02/10/2023>/td></tr>,<tr><td>Google Ads</td><td>200</td><td>20/10/2023>/td></tr></table></body>");
	await connection.close();
});

test("Deve testar o cálculo do Statement no formato JSON", async function () {
	// Stub
	sinon.stub(PurchaseDAODatabase.prototype, "getPurchases").resolves([
		{ descriptor: "A", amount: 100, date: new Date(), currency: "USD" }
	]);
	sinon.stub(CurrencyGatewayHttp.prototype, "getCurrency").resolves({ amount: 3 });
	const cardNumber = "1234123412341234";
	const format = "application/json";
	const connection = new PgPromiseAdapter();
	const purchaseDAO = new PurchaseDAODatabase(connection);
	const httpClient = new AxiosAdapter();
	const currencyGateway = new CurrencyGatewayHttp(httpClient);
	const statementRepository = new StatementRepositoryDatabase(connection);
	const calculateStatement = new CalculateStatement(statementRepository, currencyGateway);
	const output = await calculateStatement.execute(cardNumber);
	const presenter = new JSONPresenter();
	const statement = presenter.present(output);
	expect(statement.total).toBe(690);
	expect(statement.month).toBe(11);
	expect(statement.year).toBe(2023);
	expect(statement.purchases).toHaveLength(4);
	await connection.close();
});
