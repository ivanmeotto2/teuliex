export interface UserInterface {
  email: string;
  nome: string;
  cognome: string;
  cellulare: string;
  dataNascita: Date;
  localita: string;
  lavoro: string;
  imgUrl: string;
  quoteInRegola: boolean;
  notifichePush: boolean;
  indirizzoSpedizione: string;
  fattiTrovare: boolean;
  password: string;
  role: string;
}

export class User implements UserInterface {
  email: string = '';
  nome: string = '';
  cognome: string = '';
  cellulare: string = '';
  dataNascita: Date = new Date();
  localita: string = '';
  lavoro: string = '';
  imgUrl: string = './../../assets/images/avatar.jpeg';
  quoteInRegola: boolean = false;
  notifichePush: boolean = false;
  indirizzoSpedizione: string = '';
  fattiTrovare: boolean = false;
  password: string = '';
  role: string = '';

  constructor(res?: User) {
    Object.assign(this, res);
  }
}
