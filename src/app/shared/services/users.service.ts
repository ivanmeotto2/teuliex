import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { AlertController } from '@ionic/angular';
import { UsersApiService } from 'src/app/api/users-api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users: User[] = [];

  constructor(
    private readonly alertCtrl: AlertController,
    private readonly usersApiService: UsersApiService
  ) {
    this.retrieveAll();
  }

  async retrieveAll() {
    const retrievedUsers = await this.usersApiService.getAllUsers();
    Object.assign(this.users, retrievedUsers);
  }

  async createUser(user: User) {
    if (this.findOne(user.email)) {
      const alert = await this.alertCtrl.create({
        header: 'Errore',
        message: 'Esiste già un utente con questa mail',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
          },
        ],
      });
      await alert.present();
      return false;
    } else {
      await this.usersApiService.createUser(user);
      this.retrieveAll();
      this.users.push(user);
      return true;
    }
  }

  findOne(userToFindEmail: string) {
    for (const user of this.users) {
      if (user.email === userToFindEmail) return true;
    }
    return false;
  }

  findAll() {
    return this.users;
  }
}
