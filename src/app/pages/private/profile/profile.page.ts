import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { UsersService } from 'src/app/shared/services/users.service';
import { getItemLocalStorage, removeItemLocalStorage, setItemLocalStorage } from '../../../shared/utils/utils';
import { AlertController, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../../../shared/services/location.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  user: User = new User();
  tempUser: User = new User();
  autocompleteLocation: { input: string };
  autocompleteCalendar: { input: string };
  autocompleteItems: any[] = [];
  locationSelected: boolean = false;
  addressSelected: boolean = false;
  isLocationSelected: boolean = false;
  @Input() id: string = '';
  enteredProfile: boolean = true;

  constructor(
    private usersService: UsersService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    private router: Router,
    private locationService: LocationService
  ) {
    this.autocompleteLocation = { input: this.user.localita };
    this.autocompleteCalendar = { input: this.user.indirizzoSpedizione };
    this.locationSelected = false;
    this.addressSelected = false;
    this.autocompleteItems = [];
  }

  async ionViewWillEnter() {
    this.autocompleteItems = [];
    const loading = await this.loadingCtrl.create({
      message: 'Retrieving user info',
    });
    await loading.present();
    if (this.id) {
      this.user = await this.usersService.retrieveOne(this.id);
      this.tempUser = await this.usersService.retrieveOne(this.id);
    } else {
      this.user = JSON.parse(getItemLocalStorage('user'));
      this.tempUser = JSON.parse(getItemLocalStorage('user'));
      this.id = '';
    }
    await loading.dismiss();
    this.autocompleteLocation = { input: this.user.localita };
    this.autocompleteCalendar = { input: this.user.indirizzoSpedizione };
    if (this.autocompleteCalendar) this.addressSelected = true;
    if (this.autocompleteLocation) this.locationSelected = true;
  }

  setIsLocationSelected(value: boolean) {
    this.isLocationSelected = value;
  }

  changeImage(event: any) {
    this.usersService.changeImage(event, this.tempUser);
  }

  checkDisabled() {
    if (this.id) return true;
    else return false;
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
        message: 'Modifiche avvenute con successo (alcune modifiche non verranno visualizzate fino al prossimo refresh della pagina)',
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
    if (!this.enteredProfile) {
      this.autocompleteItems = [];
      if (this.isLocationSelected) {
        if (this.autocompleteLocation.input === '') {
          return;
        } else {
          if (!this.locationSelected) {
            this.locationService.findLocation(this.autocompleteLocation, this.autocompleteItems);
          } else {
            this.locationSelected = false;
          }
        }
      } else {
        if (this.autocompleteCalendar.input === '') {
          return;
        } else {
          if (!this.addressSelected) {
            this.locationService.findLocation(this.autocompleteCalendar, this.autocompleteItems);
          } else {
            this.addressSelected = false;
          }
        }
      }
    } else {
      this.enteredProfile = false;
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

  async closeProfileModal() {
    await this.modalController.dismiss();
  }
}
