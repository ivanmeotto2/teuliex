import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { UsersService } from '../../../shared/services/users.service';
import {
  setItemLocalStorage,
  getItemLocalStorage,
} from 'src/app/shared/utils/utils';

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
    private usersService: UsersService
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
      const users = this.usersService.findAll();
      users.forEach((user) => {
        if (user.email === this.email) {
          this.userExists = true;
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
