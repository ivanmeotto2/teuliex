import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatoQuotePageRoutingModule } from './stato-quote-routing.module';

import { StatoQuotePage } from './stato-quote.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatoQuotePageRoutingModule
  ],
  declarations: [StatoQuotePage]
})
export class StatoQuotePageModule {}
