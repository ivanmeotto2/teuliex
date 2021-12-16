import { Component } from '@angular/core';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { Quotes } from 'src/app/shared/interfaces/quotes';
import { User } from 'src/app/shared/interfaces/user';
import { BehaviorsService } from 'src/app/shared/services/filters.service';
import { QuotesService } from '../../../shared/services/quotes.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { Stripe } from '@awesome-cordova-plugins/stripe/ngx';
import { Card } from 'src/app/shared/interfaces/card';
import { STRIPE_KEY } from 'src/app/shared/constants/consts';
import { CardModalComponent } from '../../../shared/components/card-modal/card-modal.component';
import { ERRORS } from 'src/app/shared/constants/errors';
import { getItemLocalStorage } from 'src/app/shared/utils/utils';

@Component({
	selector: 'app-stato-quote',
	templateUrl: './stato-quote.page.html',
	styleUrls: ['./stato-quote.page.scss'],
})
export class StatoQuotePage {
	user: User = new User();
	quote: Quotes[] = [];
	card: Card = new Card();

	constructor(
		private behaviorsService: BehaviorsService,
		private quotesService: QuotesService,
		private loadingController: LoadingController,
		private alertController: AlertController,
		private modalController: ModalController
	) {}

	async ionViewWillEnter() {
		const loading = await this.loadingController.create({
			message: "Checking quotes' status. Please wait...",
		});
		this.user = JSON.parse(getItemLocalStorage('user'));
		await loading.present();
		await this.getQuotes();
		await loading.dismiss();
	}

	async getQuotes() {
		if (this.user.id) {
			this.quote = await this.quotesService.getQuotesById(this.user.id);
			this.user.quoteInRegola = this.checkQuotesStatus();
			this.behaviorsService.user.next(this.user);
		}
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
					handler: async () => {
						const modal = await this.modalController.create({
							component: CardModalComponent,
							componentProps: {
								card: this.card,
								importo: quota.importo,
							},
							cssClass: 'half-modal',
						});
						await modal.present();
						await modal.onDidDismiss();
						console.log(this.card);
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
