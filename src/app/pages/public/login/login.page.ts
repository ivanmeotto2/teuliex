import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular';
import {
  setItemLocalStorage
} from 'src/app/shared/utils/utils';
import { UsersService } from '../../../shared/services/users.service';
import { BehaviorsService } from 'src/app/shared/services/filters.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string;
  password: string;
  userExists: boolean = false;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private usersService: UsersService,
    private behaviorsService: BehaviorsService
  ) {}

  async login() {
    if (!this.email || !this.password) {
      const alert = await this.alertController.create({
        header: 'Attenzione',
        message: 'Inserisci i campi mancanti',
        buttons: [
          {
            text: 'ok',
            role: 'cancel',
          },
        ],
      });
      await alert.present();
    } else {
      const loading = await this.loadingController.create({
        message: 'Logging in...',
      })
      await loading.present()
      const users = await this.usersService.findAll('');
      users.forEach(async (user) => {
        if (user.email === this.email) {
          this.userExists = true;
          await loading.dismiss();
          this.behaviorsService.user.next(user)
          setItemLocalStorage('user', JSON.stringify(user));
          this.router.navigate(['private', 'home']);
        }
      });
      if (!this.userExists) {
        const toast = await this.toastController.create({
          message: 'Nessun utente trovato con questa email',
          duration: 4000,
          buttons: [
            {
              icon: 'close',
              role: 'cancel',
              side: 'end',
            },
          ],
        });
        await toast.present();
      }
    }
  }
}
