import { Component } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { User } from 'src/app/shared/interfaces/user';
import { UsersService } from 'src/app/shared/services/users.service';
import { getItemLocalStorage, removeItemLocalStorage, setItemLocalStorage } from 'src/app/shared/utils/utils';
import { TabNamePipe } from '../../shared/pipes/tab-name.pipe';
import { Router } from '@angular/router';
import { FiltersInterface } from '../../shared/interfaces/filters';
import { FiltersService } from 'src/app/shared/services/filters.service';
import { FiltersPopoverMenuComponent } from 'src/app/shared/components/filters-popover-menu/filters-popover-menu.component';

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
    private filtersService: FiltersService,
    private modalController: ModalController
  ) {
    filtersService.filters.subscribe((filtersValue) => {
      this.filters = filtersValue;
    });
  }

  async ionViewWillEnter() {
    const id = JSON.parse(getItemLocalStorage('user')).id;
    this.user = await this.usersService.retrieveOne(id);
    removeItemLocalStorage('user');
    setItemLocalStorage('user', JSON.stringify(this.user));
    if (!this.user) {
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
      searchRadius: 0,
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
    // if ((this.filters.job || this.filters.surname || this.filters.address || this.filters.aroundMe) && this.filters.toFilter) {
    //   this.filterMap();
    // }
  }
}
