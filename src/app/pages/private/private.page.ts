import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { User } from 'src/app/shared/interfaces/user';
import { UsersService } from 'src/app/shared/services/users.service';
import { getItemLocalStorage, removeItemLocalStorage, setItemLocalStorage } from 'src/app/shared/utils/utils';
import { TabNamePipe } from '../../shared/pipes/tab-name.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-private',
  templateUrl: './private.page.html',
  styleUrls: ['./private.page.scss'],
})
export class PrivatePage {
  location: Location = window.location;
  selectedTab: string;

  constructor(private menuController: MenuController, private router: Router, private usersService: UsersService) {}
  user: User = new User();

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
}
