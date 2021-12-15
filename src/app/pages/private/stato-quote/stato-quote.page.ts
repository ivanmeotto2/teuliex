import { Component } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Quotes } from 'src/app/shared/interfaces/quotes';
import { User } from 'src/app/shared/interfaces/user';
import { BehaviorsService } from 'src/app/shared/services/filters.service';
import { QuotesService } from '../../../shared/services/quotes.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-stato-quote',
  templateUrl: './stato-quote.page.html',
  styleUrls: ['./stato-quote.page.scss'],
})
export class StatoQuotePage {
  user: User = new User();
  quote: Quotes[] = [];

  constructor(
    private behaviorsService: BehaviorsService,
    private quotesService: QuotesService,
    private loadingController: LoadingController,
    private usersService: UsersService,
    private alertController: AlertController
  ) {
    behaviorsService.user.subscribe((userValue) => {
      this.user = userValue;
    });
  }

  async ionViewWillEnter() {
    const loading = await this.loadingController.create({
      message: "Checking quotes' status. Please wait...",
    });
    await loading.present();
    await this.getQuotes();
    await loading.dismiss();
  }

  async getQuotes() {
    this.quote = await this.quotesService.getQuotesById(this.user.id);
    this.user.quoteInRegola = this.checkQuotesStatus();
    this.usersService.updateUser(this.user);
    this.behaviorsService.user.next(this.user);
  }

  checkQuotesStatus() {
    let isInregola = true;
    this.quote.forEach((quota) => {
      if (!quota.stato) isInregola = false;
    });
    return isInregola;
  }

  async openQuotePayment(quota: Quotes) {
    const alert = await this.alertController.create({
      header: 'Attenzione',
      message: `Sei sicuro di voler pagare ora la quota di <b>€ ${quota.importo}</b>?`,
      buttons: [
        {
          text: 'Sì',
          handler: () => {
            console.log('Stai per pagare la quota');
          },
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }
}
