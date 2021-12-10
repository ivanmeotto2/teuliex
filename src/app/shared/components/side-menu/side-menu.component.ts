import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { MENU_OPTIONS } from '../../constants/consts';
import { removeItemLocalStorage } from '../../utils/utils';
import { User } from 'src/app/shared/interfaces/user';
import pkg from '../../../../../package.json';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  readonly version = pkg.version;
  @Input() user?: User = new User();
  @Output() emitTabName: EventEmitter<string> = new EventEmitter<string>();
  menuOptions: any[] = [];

  constructor(private readonly alertController: AlertController, private router: Router, private menuController: MenuController) {}

  ngOnInit() {
    Object.assign(this.menuOptions, MENU_OPTIONS);
  }

  async handleNavigation(route: string[], tabValue?: string) {
    if (route[0] === 'auth' && this.user) {
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

  async alert(option: any) {
    let alert: any;
    if (!this.user && option.needsLogin) {
      alert = await this.alertController.create({
        header: 'Attenzione',
        message: 'Per accedere a questa pagina è necessario il login. Clicca qui per andare alla schermata di accesso',
        buttons: [
          {
            text: 'Vai al login',
            handler: () => {
              this.handleNavigation(['auth', 'login'], 'login');
            },
          },
          {
            text: 'Annulla',
            role: 'cancel',
            handler: () => {
              this.menuController.close();
            },
          },
        ],
      });
    } else {
      alert = await this.alertController.create({
        header: 'Attenzione',
        message: 'Per accedere a questa pagina è necessario essere in regola con i pagamenti delle quote',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            handler: () => {
              this.menuController.close();
            },
          },
        ],
      });
    }
    await alert.present();
  }
}
