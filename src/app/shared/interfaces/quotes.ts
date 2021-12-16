export interface QuotesInterface {
	id: string;
	userID: string;
	nome: string;
	data: Date;
	importo: number;
	stato: boolean;
}

export class Quotes implements QuotesInterface {
	id: string = '';
	userID: string = '';
	nome: string = '';
	data: Date = new Date();
	importo: number = 0;
	stato: boolean = false;

	constructor(res?: any) {
		Object.assign(this, res);
	}
}
