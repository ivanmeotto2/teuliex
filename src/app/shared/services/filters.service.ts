import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FiltersInterface } from '../interfaces/filters';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  filters = new BehaviorSubject<FiltersInterface>({
    surname: '',
    job: '',
    address: '',
    toFilter: false,
    aroundMe: false,
    searchRadius: 0,
  });

  constructor() {}
}
