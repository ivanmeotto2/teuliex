import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { UsersService } from 'src/app/shared/services/users.service';
import {
  getItemLocalStorage,
  removeItemLocalStorage,
  setItemLocalStorage,
} from '../../../shared/utils/utils';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LocationService } from '../../../shared/services/location.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User = new User();
  currentTab: string = 'details';
  tempUser: User = new User();
  autocompleteLocation: { input: string };
  autocompleteCalendar: { input: string };
  autocompleteItems: any[] = [];
  locationSelected: boolean = false;
  addressSelected: boolean = false;
  isLocationSelected: boolean = false;

  constructor(
    private usersService: UsersService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    private locationService: LocationService
  ) {
    this.autocompleteLocation = { input: this.user.localita };
    this.autocompleteCalendar = { input: this.user.indirizzoSpedizione };
    this.locationSelected = false;
    this.addressSelected = false;
    this.autocompleteItems = [];
  }

  ngOnInit() {
    this.user = JSON.parse(getItemLocalStorage('user'));
    this.tempUser = JSON.parse(getItemLocalStorage('user'));
    this.autocompleteLocation = { input: this.user.localita };
    this.autocompleteCalendar = { input: this.user.indirizzoSpedizione };
  }

  setCurrentTab(value: any) {
    this.currentTab = value;
  }

  setIsLocationSelected(value: boolean) {
    this.isLocationSelected = value;
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

  searchForAddress() {
    this.autocompleteItems = [];
    if (this.isLocationSelected) {
      if (this.autocompleteLocation.input === '') {
        return;
      } else {
        if (!this.locationSelected) {
          this.locationService.findLocation(
            this.autocompleteLocation,
            this.autocompleteItems
          );
        } else {
          this.locationSelected = false;
        }
      }
    } else {
      if (this.autocompleteCalendar.input === '') {
        return;
      } else {
        if (!this.addressSelected) {
          this.locationService.findLocation(
            this.autocompleteCalendar,
            this.autocompleteItems
          );
        } else {
          this.addressSelected = false;
        }
      }
    }
  }

  selectedPlace(item: any) {
    if (this.isLocationSelected) {
      this.tempUser.localita = item.description;
      this.autocompleteLocation.input = item.description;
      this.locationSelected = true;
    } else {
      this.tempUser.indirizzoSpedizione = item.description;
      this.autocompleteCalendar.input = item.description;
      this.addressSelected = true;
    }
    this.autocompleteItems = [];
  }
}
