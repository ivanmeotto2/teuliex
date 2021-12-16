import { Component, Input } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { Card } from '../../interfaces/card';
import { Stripe, StripeCardTokenParams } from '@awesome-cordova-plugins/stripe/ngx';
import { STRIPE_KEY } from '../../constants/consts';
import { ERRORS } from 'src/app/shared/constants/errors';
import { NumberSymbol } from '@angular/common';

@Component({
	selector: 'app-card-modal',
	templateUrl: './card-modal.component.html',
	styleUrls: ['./card-modal.component.scss'],
})
export class CardModalComponent {
	@Input() card: StripeCardTokenParams;
	@Input() importo: number;
	year: number;
	stripePayment: any;

	constructor(
		private modalController: ModalController,
		private stripe: Stripe,
		private alertController: AlertController,
		private loadingController: LoadingController
	) {}

	ionViewWillEnter() {
		this.year = new Date().getFullYear();
		this.stripe.setPublishableKey(STRIPE_KEY).catch(async (err) => {
			this.errorAlert(err);
			await this.modalController.dismiss();
		});
		// this.stripePayment = require('stripe')('')
	}

	async closeModal() {
		await this.modalController.dismiss();
	}

	async validateCard() {
		await this.stripe
			.validateCardNumber(this.card.number)
			.then(
				async () =>
					await this.stripe
						.validateExpiryDate(this.card.expMonth.toString(), this.card.expYear.toString())
						.then(
							async () =>
								await this.stripe
									.validateCVC(this.card.cvc)
									.then(async () => {
										const loading = await this.loadingController.create({
											message: 'Validating the card...',
										});
										await loading.present();
										await this.stripe.createCardToken(this.card).then(async (res) => {
											await loading.dismiss();
											alert(`${res.id} <br /> ${JSON.stringify(res.card)} <br /> ${res.created} <br /> ${res.type}`);
										});
									})
									.catch(async (err) => this.errorAlert(err))
						)
						.catch(async (err) => this.errorAlert(err))
			)
			.catch(async (err) => this.errorAlert(err));
	}

	formatElement(date: string, position: NumberSymbol) {
		if (date.split('-')[position])
			if (position === 0) this.card.expYear = Number(date.split('-')[position]);
			else this.card.expMonth = Number(date.split('-')[position]);
	}

	async errorAlert(err: any) {
		const alert = await this.alertController.create({
			header: 'Errore',
			message: err in ERRORS ? ERRORS[err] : err,
			buttons: [
				{
					text: 'Ok',
					role: 'cancel',
				},
			],
		});
		await alert.present();
	}
}
