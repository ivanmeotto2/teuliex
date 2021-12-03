import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { User } from 'src/app/shared/interfaces/user';
import { getItemLocalStorage } from 'src/app/shared/utils/utils';
import { TabNamePipe } from '../../shared/pipes/tab-name.pipe';

@Component({
  selector: 'app-private',
  templateUrl: './private.page.html',
  styleUrls: ['./private.page.scss'],
})
export class PrivatePage {
  location: Location = window.location;
  selectedTab: string;

  constructor(private menuController: MenuController) {}
  user: User = new User();

  ionViewWillEnter() {
    this.user = JSON.parse(getItemLocalStorage('user'));
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
    this.menuController
      .enable(true, 'main-menu')
      .then(() => this.menuController.open('main-menu'));
  }
}
