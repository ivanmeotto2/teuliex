import { Component, ViewChild } from '@angular/core';
import { AnimationController, IonIcon, ToastController } from '@ionic/angular';
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
  @ViewChild(IonIcon) chevron: IonIcon;
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

  constructor(private usersService: UsersService, private toastController: ToastController, private animationController: AnimationController) {}

  ionViewWillEnter() {
    Object.assign(this.user, JSON.parse(getItemLocalStorage('user')));
    this.oldSettings = {
      notifichePush: this.user.notifichePush.valueOf(),
      mostraEmail: this.user.mostraEmail.valueOf(),
      mostraNumTel: this.user.mostraNumTel.valueOf(),
      fattiTrovare: this.user.fattiTrovare.valueOf(),
    };
    Object.assign(this.settings, SETTINGS);
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
}
