import CalculateStatement from "./application/usecase/CalculateStatement";
import PurchaseDAODatabase from "./infra/dao/PurchaseDAODatabase";
import CurrencyGatewayHttp from "./infra/gateway/CurrencyGatewayHttp";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import AxiosAdapter from "./infra/http/AxiosAdapter";
import MainController from "./infra/controller/MainController";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import StatementRepositoryDatabase from "./infra/repository/StatementRepositoryDatabase";

const connection = new PgPromiseAdapter();
const httpClient = new AxiosAdapter();
const httpServer = new ExpressAdapter();
const purchaseDAO = new PurchaseDAODatabase(connection);
const currencyGateway = new CurrencyGatewayHttp(httpClient);
const statementRepository = new StatementRepositoryDatabase(connection);
const calculateStatement = new CalculateStatement(statementRepository, currencyGateway);
new MainController(httpServer, calculateStatement);
httpServer.listen(3001);