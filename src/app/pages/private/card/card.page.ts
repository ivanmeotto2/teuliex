import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { getItemLocalStorage } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  user: User = new User();

  constructor() {
    this.user = JSON.parse(getItemLocalStorage('user'));
  }

  ngOnInit() {}
}
