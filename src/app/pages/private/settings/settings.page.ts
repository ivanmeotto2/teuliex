import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/shared/interfaces/user';
import { UsersService } from 'src/app/shared/services/users.service';
import { getItemLocalStorage, removeItemLocalStorage, setItemLocalStorage } from '../../../shared/utils/utils';
import { SETTINGS } from 'src/app/shared/constants/consts';

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
    fattiTrovare: false,
  };
  settings: any[] = [];
  visibleOptions = {
    notifichePush: false,
    mostraEmail: false,
    mostraNumTel: false,
    fattiTrovare: false,
  };

  constructor(private usersService: UsersService, private toastController: ToastController) {}

  ionViewWillEnter() {
    Object.assign(this.user, JSON.parse(getItemLocalStorage('user')));
    this.oldSettings = {
      notifichePush: this.user.notifichePush.valueOf(),
      mostraEmail: this.user.mostraEmail.valueOf(),
      mostraNumTel: this.user.mostraNumTel.valueOf(),
      fattiTrovare: this.user.fattiTrovare.valueOf(),
    };
    Object.assign(this.settings, SETTINGS);
    console.log(this.settings);
  }

  checkDisabled() {
    if (
      this.user.notifichePush !== this.oldSettings.notifichePush ||
      this.user.mostraEmail !== this.oldSettings.mostraEmail ||
      this.user.mostraNumTel !== this.oldSettings.mostraNumTel ||
      this.user.fattiTrovare !== this.oldSettings.fattiTrovare
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
      fattiTrovare: this.user.fattiTrovare.valueOf(),
    };
    removeItemLocalStorage('user');
    setItemLocalStorage('user', JSON.stringify(this.user));
  }

  toggleInfo(value: boolean) {
    console.log(value);
    if (value === true) value = false;
    else value = true;
    console.log(value);
  }
}
