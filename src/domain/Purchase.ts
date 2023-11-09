export default class Purchase {

	constructor (readonly descriptor: string, readonly amount: number, readonly date: Date, readonly currency: string) {

	}
}