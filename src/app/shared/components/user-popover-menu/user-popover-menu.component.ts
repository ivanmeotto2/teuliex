import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { User } from '../../interfaces/user';
import { removeItemLocalStorage } from '../../utils/utils';

@Component({
  selector: 'app-user-popover-menu',
  templateUrl: './user-popover-menu.component.html',
  styleUrls: ['./user-popover-menu.component.scss'],
})
export class UserPopoverMenuComponent implements OnInit {
  @Input() user?: User;

  constructor(
    private router: Router,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  async handleNavigation(route: string[]) {
    if (route[0] === 'auth') {
      const alert = await this.alertCtrl.create({
        header: 'Attenzione',
        message: 'Vuoi veramente uscire?',
        buttons: [
          {
            text: 'Esci',
            handler: () => {
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
      this.navigate(route);
    }
  }

  async navigate(route: string[]) {
    await this.router.navigate(route);
    await this.popoverCtrl.dismiss();
  }
}
