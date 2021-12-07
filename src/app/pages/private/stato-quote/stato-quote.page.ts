import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { getItemLocalStorage } from '../../../shared/utils/utils';

@Component({
  selector: 'app-stato-quote',
  templateUrl: './stato-quote.page.html',
  styleUrls: ['./stato-quote.page.scss'],
})
export class StatoQuotePage {
  user: User = new User();

  constructor() {}

  ionViewWillEnter() {
    Object.assign(this.user, JSON.parse(getItemLocalStorage('user')));
  }
}
