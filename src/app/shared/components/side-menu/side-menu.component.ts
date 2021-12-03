import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { MENU_OPTIONS } from '../../constants/consts';
import { removeItemLocalStorage } from '../../utils/utils';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  @Input() user?: User = new User();
  @Output() emitTabName: EventEmitter<string> = new EventEmitter<string>();
  menuOptions: any[] = [];

  constructor(
    private readonly alertController: AlertController,
    private router: Router,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    Object.assign(this.menuOptions, MENU_OPTIONS);
  }

  async handleNavigation(route: string[], tabValue?: string) {
    if (route[0] === 'auth') {
      const alert = await this.alertController.create({
        header: 'Attenzione',
        message: 'Vuoi veramente uscire?',
        buttons: [
          {
            text: 'Esci',
            handler: async () => {
              await this.navigate(['/private/home'], 'news');
              removeItemLocalStorage('user');
              window.location.reload();
            },
          },
          {
            text: 'Annulla',
            role: 'cancel',
          },
        ],
      });
      await alert.present();
    } else {
      this.navigate(route, tabValue);
    }
  }

  async navigate(route: string[], tabValue: string) {
    this.emitTabName.emit(tabValue);
    await this.router.navigate(route);
    await this.menuController.close('main-menu');
  }
}
