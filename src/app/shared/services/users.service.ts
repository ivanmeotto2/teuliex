import { Injectable } from '@angular/core';
import { User } from '../../shared/interfaces/user';
import { AlertController } from '@ionic/angular';
import { UsersApiService } from '../../api/users-api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users: User[] = [];

  constructor(private readonly alertCtrl: AlertController, private readonly usersApiService: UsersApiService) {
    this.retrieveAll('');
  }

  async retrieveAll(filterString: string) {
    const retrievedUsers = await this.usersApiService.getAllUsers(filterString);
    Object.assign(this.users, retrievedUsers);
  }

  async retrieveOne(id: string) {
    return (await this.usersApiService.getOneUser(id)) as User;
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
      this.retrieveAll('');
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

  async findAll(filterString: string) {
    this.users = [];
    await this.retrieveAll(filterString);
    return this.users;
  }

  changeImage(event: any, user: User) {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      let input = document.getElementById('profileImage');
      input.title = file.name;
      reader.onload = (event) => {
        if (event.target.result) {
          user.imgUrl = event.target.result.toString();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async updateUser(body: any) {
    const userUpdated = await this.usersApiService.updateUser(body);
    return userUpdated;
  }
}
