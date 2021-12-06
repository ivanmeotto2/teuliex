import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { UsersService } from 'src/app/shared/services/users.service';
import {
  getItemLocalStorage,
  removeItemLocalStorage,
  setItemLocalStorage,
} from '../../../shared/utils/utils';
import { AlertController, ToastController } from '@ionic/angular';
import { jsonEval } from '@firebase/util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User = new User();
  currentTab: string = 'details';
  tempUser: User = new User();

  constructor(
    private usersService: UsersService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = JSON.parse(getItemLocalStorage('user'));
    this.tempUser = JSON.parse(getItemLocalStorage('user'));
    console.log(
      JSON.stringify(this.user) == JSON.stringify(this.tempUser),
      this.user,
      this.tempUser
    );
  }

  setCurrentTab(value: any) {
    this.currentTab = value;
  }

  changeImage(event: any) {
    this.usersService.changeImage(event, this.tempUser);
  }

  async updateProfile() {
    const alert = await this.alertCtrl.create({
      header: 'Attenzione',
      message: 'Vuoi davvero modificare i dati del tuo profilo?',
      buttons: [
        {
          text: 'Modifica',
          handler: () => {
            this.updateData();
          },
        },
        {
          text: 'Annulla',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }

  async updateData() {
    try {
      await this.usersService.updateUser(this.tempUser);
      removeItemLocalStorage('user');
      setItemLocalStorage('user', JSON.stringify(this.tempUser));
      this.user = this.tempUser;
      const toast = await this.toastCtrl.create({
        message:
          'Modifiche avvenute con successo (alcune modifiche non verranno visualizzate fino al prossimo refresh della pagina)',
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
      this.router.navigate(['/private/home']);
    } catch (error) {
      console.log(error);
    }
  }
}
