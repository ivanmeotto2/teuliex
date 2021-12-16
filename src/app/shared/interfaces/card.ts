export interface CardInterface {
	number: string;
	expMonth: string;
	expYear: string;
	cvc: string;
}

export class Card implements CardInterface {
	number: string = '';
	expMonth: string = '';
	expYear: string = '';
	cvc: string = '';
}
