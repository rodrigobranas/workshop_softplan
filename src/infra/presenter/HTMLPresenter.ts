import Presenter from "../../application/presenter/Presenter";
import { Output } from "../../application/usecase/CalculateStatement";
import moment from "moment";

export default class HTMLPresenter implements Presenter {

	present(data: Output) {
		let purchases = [];
		for (const purchaseData of data.purchases) {
			purchases.push(`<tr><td>${purchaseData.descriptor}</td><td>${purchaseData.amount}</td><td>${ moment(purchaseData.date).format("DD/MM/YYYY") }>/td></tr>`);
		}
		return `<body><div><h4>${data.month}/${data.year}</h4><h3>R$${data.total}</h3></div><table>${purchases}</table></body>`;
	}

}
