import HTMLPresenter from "./HTMLPresenter";
import JSONPresenter from "./JSONPresenter";

export default class PresenterFactory {
	static create (format: string) {
		if (format === "text/html") return new HTMLPresenter();
		if (format === "application/json") return new JSONPresenter();
		throw new Error();
	}
	
}