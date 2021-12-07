import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { UsersService } from 'src/app/shared/services/users.service';
import { getItemLocalStorage, removeItemLocalStorage, setItemLocalStorage } from '../../../shared/utils/utils';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  user: User = new User();
  oldSettings = {
    notifichePush: false,
    mostraEmail: false,
    mostraNumTel: false,
  };

  constructor(private usersService: UsersService, private toastController: ToastController) {}

  ionViewWillEnter() {
    console.log(this.oldSettings);
    Object.assign(this.user, JSON.parse(getItemLocalStorage('user')));
    this.oldSettings = {
      notifichePush: this.user.notifichePush.valueOf(),
      mostraEmail: this.user.mostraEmail.valueOf(),
      mostraNumTel: this.user.mostraNumTel.valueOf(),
    };
    console.log(this.user.notifichePush, this.user.mostraEmail, this.user.mostraNumTel);
  }

  checkDisabled() {
    if (
      this.user.notifichePush !== this.oldSettings.notifichePush ||
      this.user.mostraEmail !== this.oldSettings.mostraEmail ||
      this.user.mostraNumTel !== this.oldSettings.mostraNumTel
    )
      return false;
    else return true;
  }

  async changeSettings() {
    try {
      await this.usersService.updateUser(this.user);
      const toast = await this.toastController.create({
        message: 'Modifiche avvenute con successo',
        duration: 4000,
        buttons: [
          {
            side: 'end',
            icon: 'close',
            role: 'cancel',
          },
        ],
      });
      await toast.present();
      this.setNewDefaults();
    } catch (error) {
      console.log(error);
    }
  }

  setNewDefaults() {
    this.oldSettings = {
      notifichePush: this.user.notifichePush.valueOf(),
      mostraEmail: this.user.mostraEmail.valueOf(),
      mostraNumTel: this.user.mostraNumTel.valueOf(),
    };
    removeItemLocalStorage('user');
    setItemLocalStorage('user', JSON.stringify(this.user));
  }
}
