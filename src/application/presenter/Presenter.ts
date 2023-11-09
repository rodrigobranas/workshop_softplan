import { Output } from "../usecase/CalculateStatement";

export default interface Presenter {
	present (data: Output): any;
}
