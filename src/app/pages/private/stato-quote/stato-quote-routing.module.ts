import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatoQuotePage } from './stato-quote.page';

const routes: Routes = [
  {
    path: '',
    component: StatoQuotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatoQuotePageRoutingModule {}
