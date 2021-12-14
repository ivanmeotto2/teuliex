import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FiltersInterface } from '../interfaces/filters';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class BehaviorsService {
  filters = new BehaviorSubject<FiltersInterface>({
    surname: '',
    job: '',
    address: '',
    toFilter: false,
    aroundMe: false,
    searchRadius: 0,
  });
  user = new BehaviorSubject<User>({
    id: '',
    email: '',
    nome: '',
    cognome: '',
    cellulare: '',
    dataNascita: new Date(),
    localita: '',
    professione: '',
    corso: '',
    imgUrl: './../../assets/images/avatar.jpeg',
    quoteInRegola: false,
    notifichePush: false,
    mostraEmail: false,
    mostraNumTel: false,
    abilitaGeolocalizzazione: false,
    indirizzoSpedizione: '',
    fattiTrovare: false,
    password: '',
    role: '',
  });

  constructor() {}
}
