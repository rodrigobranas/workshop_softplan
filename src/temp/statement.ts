import axios from "axios";
import express from "express";
import pgp from "pg-promise";
import moment from "moment";
const app = express();

app.get("/cards/:cardNumber/statements", async function (req, res) {
	// define a competência atual, hoje seria month = 11 e year = 2023
	const date = new Date();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	const connection = pgp()("postgres://postgres:123546@localhost:5432/app");
	// obtem as compras do mês passado
	const purchasesData = await connection.query("select * from branas.purchase where card_number = $1 and extract(month from date)::integer = $2 and extract(year from date)::integer = $3", [req.params.cardNumber, month - 1, year]);
	// obtem a cotação de moedas estrangeiras
	const response = await axios.get("http://localhost:3000/currencies");
	const currency = response.data;
	// calcula o total da fatura e monta a lista de compras
	let total = 0;
	let purchases = [];
	for (const purchaseData of purchasesData) {
		if (purchaseData.currency === "USD") {
			total += parseFloat(purchaseData.amount) * currency.amount;
		} else {
			total += parseFloat(purchaseData.amount);
		}
		// se for html
		if (req.headers.accept === "text/html") {
			purchases.push(`<tr><td>${purchaseData.descriptor}</td><td>${purchaseData.amount}</td><td>${ moment(purchaseData.date).format("DD/MM/YYYY") }>/td></tr>`);
		}
		// se for json
		if (req.headers.accept === "application/json") {
			purchases.push({ descriptor: purchaseData.descriptor, amount: purchaseData.amount, date: purchaseData.date });
		}
	}
	// retorna a fatura do cartão
	if (req.headers.accept === "text/html") {
		res.send(`<body><div><h4>${month}/${year}</h4><h3>R$${total}</h3></div><table>${purchases}</table></body>`);
	}
	if (req.headers.accept === "application/json") {
		res.json({
			month,
			year,
			total,
			purchases
		});
	}
});

app.listen(3001);
