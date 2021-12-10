export interface UserInterface {
  id?: string;
  email: string;
  nome: string;
  cognome: string;
  cellulare: string;
  dataNascita: Date;
  localita: string;
  professione: string;
  imgUrl: string;
  quoteInRegola: boolean;
  notifichePush: boolean;
  mostraEmail: boolean;
  mostraNumTel: boolean;
  indirizzoSpedizione: string;
  fattiTrovare: boolean;
  password: string;
  role: string;
}

export class User implements UserInterface {
  id?: string = '';
  email: string = '';
  nome: string = '';
  cognome: string = '';
  cellulare: string = '';
  dataNascita: Date = new Date();
  localita: string = '';
  professione: string = '';
  imgUrl: string = './../../assets/images/avatar.jpeg';
  quoteInRegola: boolean = false;
  notifichePush: boolean = false;
  mostraEmail: boolean = false;
  mostraNumTel: boolean = false;
  indirizzoSpedizione: string = '';
  fattiTrovare: boolean = false;
  password: string = '';
  role: string = '';

  constructor(res?: any) {
    Object.assign(this, res);
  }
}
