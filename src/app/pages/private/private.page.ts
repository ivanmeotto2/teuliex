import { Component } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { User } from 'src/app/shared/interfaces/user';
import { UsersService } from 'src/app/shared/services/users.service';
import { getItemLocalStorage, removeItemLocalStorage, setItemLocalStorage } from 'src/app/shared/utils/utils';
import { TabNamePipe } from '../../shared/pipes/tab-name.pipe';
import { Router } from '@angular/router';
import { FiltersInterface } from '../../shared/interfaces/filters';
import { BehaviorsService } from 'src/app/shared/services/filters.service';
import { FiltersPopoverMenuComponent } from 'src/app/shared/components/filters-popover-menu/filters-popover-menu.component';
import { QuotesService } from '../../shared/services/quotes.service';

@Component({
	selector: 'app-private',
	templateUrl: './private.page.html',
	styleUrls: ['./private.page.scss'],
})
export class PrivatePage {
	location: Location = window.location;
	selectedTab: string;
	filters: FiltersInterface = {
		surname: '',
		job: '',
		address: '',
		toFilter: false,
		aroundMe: false,
		searchRadius: 0,
	};
	user: User = new User();

	constructor(
		private menuController: MenuController,
		private router: Router,
		private usersService: UsersService,
		private behaviorsService: BehaviorsService,
		private modalController: ModalController,
		private quotesService: QuotesService
	) {
		behaviorsService.filters.subscribe((filtersValue) => {
			this.filters = filtersValue;
		});
		behaviorsService.user.subscribe(async (userValue) => {
			this.user = userValue;
			if (this.user.id) await this.usersService.updateUser(this.user);
		});
	}

	async ionViewWillEnter() {
		const user = JSON.parse(getItemLocalStorage('user'));
		if (user) {
			const id = user.id;
			this.user = await this.usersService.retrieveOne(id);
			const inRegola = await this.quotesService.getQuotesById(id);
			if (inRegola.find((quota) => quota.stato === false)) {
				this.user.quoteInRegola = false;
			} else this.user.quoteInRegola = true;
			removeItemLocalStorage('user');
			setItemLocalStorage('user', JSON.stringify(this.user));
			this.behaviorsService.user.next(this.user);
		} else {
			this.user = new User();
		}
		if (!this.user.id) {
			this.router.navigate(['/private/home']);
		}
		this.getActualTabOnInit();
	}

	getActualTabOnInit() {
		const tabNamePipe = new TabNamePipe();
		const path = window.location.pathname.split('/');
		this.setSelectedTab(tabNamePipe.transform(path[path.length - 1]));
	}

	setSelectedTab(value: string) {
		this.selectedTab = value;
	}

	async openSideMenu() {
		this.menuController.enable(true, 'main-menu').then(() => this.menuController.open('main-menu'));
	}

	async openFilters() {
		this.filters = {
			surname: '',
			job: '',
			address: '',
			toFilter: false,
			aroundMe: false,
			searchRadius: 50,
		};
		const modal = await this.modalController.create({
			component: FiltersPopoverMenuComponent,
			cssClass: 'filter-popover',
			componentProps: {
				filters: this.filters,
			},
		});
		await modal.present();
		await modal.onDidDismiss();
	}
}
