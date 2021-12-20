import { Component, OnInit } from '@angular/core';
import { NgxQrcodeElementTypes } from '@techiediaries/ngx-qrcode';
import { User } from 'src/app/shared/interfaces/user';
import { getItemLocalStorage } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage {
  user: User = new User();
  qrValue: string = ``;
  elementType?: NgxQrcodeElementTypes = NgxQrcodeElementTypes.URL;

  constructor() {
    this.user = JSON.parse(getItemLocalStorage('user'));
  }

  ionViewWillEnter() {
    this.qrValue = `https://teuliex-81e31.web.app/private/profile?id=${this.user.id}`;
  }
}
