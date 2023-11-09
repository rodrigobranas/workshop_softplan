import Presenter from "../../application/presenter/Presenter";
import { Output } from "../../application/usecase/CalculateStatement";

export default class JSONPresenter implements Presenter {
	
	present(data: Output) {
		return data;
	}

}