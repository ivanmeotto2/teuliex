import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { UsersService } from '../../../shared/services/users.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LocationService } from '../../../shared/services/location.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  user: User = new User();
  confirmPassword: string;
  defaultImg: string;
  autocompleteLocation: { input: string };
  autocompleteCalendar: { input: string };
  autocompleteItems: any[] = [];
  locationSelected: boolean = false;
  addressSelected: boolean = false;
  isLocationSelected: boolean = false;

  constructor(
    private usersService: UsersService,
    private readonly toastController: ToastController,
    private readonly router: Router,
    private readonly loadingController: LoadingController,
    private locationService: LocationService
  ) {
    this.autocompleteLocation = { input: '' };
    this.autocompleteCalendar = { input: '' };
    this.locationSelected = false;
    this.addressSelected = false;
    this.autocompleteItems = [];
  }

  ngOnInit() {
    this.defaultImg = this.user.imgUrl;
  }

  async registerUser() {
    if (this.user.password !== this.confirmPassword) {
      const toast = await this.toastController.create({
        message: 'Attenzione: Le password non coincidono',
        duration: 4000,
        buttons: [
          {
            icon: 'close',
            role: 'cancel',
          },
        ],
      });
      await toast.present();
    } else {
      const loading = await this.loadingController.create({
        message: 'Please wait...',
      });
      await loading.present();
      const userCreated = await this.usersService.createUser(this.user);
      await loading.dismiss();
      if (userCreated) {
        const toast = await this.toastController.create({
          message:
            'Hai creato il tuo profilo con successo! Ora puoi registrarti',
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
        this.router.navigate(['/auth/login']);
      }
    }
  }

  setIsLocationSelected(value: boolean) {
    this.isLocationSelected = value;
  }

  checkDisabled() {
    if (
      !this.user.nome ||
      !this.user.cognome ||
      !this.user.email ||
      !this.user.password ||
      !this.confirmPassword ||
      !this.user.dataNascita ||
      !this.user.localita ||
      !this.user.indirizzoSpedizione
    )
      return true;
    else return false;
  }

  changeImage(event: any) {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      let input = document.getElementById('profileImage');
      input.title = file.name;
      reader.onload = (event) => {
        if (event.target.result) {
          this.user.imgUrl = event.target.result.toString();
        }
      };
      reader.readAsDataURL(file);
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
      this.user.localita = item.description;
      this.autocompleteLocation.input = item.description;
      this.locationSelected = true;
    } else {
      this.user.indirizzoSpedizione = item.description;
      this.autocompleteCalendar.input = item.description;
      this.addressSelected = true;
    }
    this.autocompleteItems = [];
  }
}
