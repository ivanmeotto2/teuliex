import { Component, Input } from '@angular/core';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { ModalController } from '@ionic/angular';
import { News } from 'src/app/shared/interfaces/news';

@Component({
	selector: 'app-event-registration-modal',
	templateUrl: './event-registration-modal.component.html',
	styleUrls: ['./event-registration-modal.component.scss'],
})
export class EventRegistrationModalComponent {
	@Input() event: News = new News();
	data: {
		nome: string;
		cognome: string;
		email: string;
		telefono: string;
	} = {
		nome: '',
		cognome: '',
		email: '',
		telefono: '',
	};

	constructor(private modalController: ModalController, private emailComposer: EmailComposer) {}

	async closeModal() {
		await this.modalController.dismiss();
	}

	async sendEmail() {
		console.log('Email inviata');
		await this.closeModal();
	}

	checkDisabled() {
		if (!this.data.nome || !this.data.cognome || !this.data.email || !this.data.telefono) return true;
		else return false;
	}
}
