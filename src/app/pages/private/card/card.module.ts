import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CardPageRoutingModule } from './card-routing.module';
import { CardPage } from './card.page';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CardPageRoutingModule, NgxQRCodeModule],
  declarations: [CardPage],
})
export class CardPageModule {}
