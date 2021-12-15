export interface QuotesInterface {
  id: string;
  userID: string;
  nome: string;
  data: Date;
  importo: number;
  stato: string;
}

export class Quotes implements QuotesInterface {
  id: string = '';
  userID: string = '';
  nome: string = '';
  data: Date = new Date();
  importo: number = 0;
  stato: string = '';

  constructor(res?: any) {
    Object.assign(this, res)
  }
}