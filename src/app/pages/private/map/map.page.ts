import { Component, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { Router } from '@angular/router';
import { LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { Marker } from 'src/app/shared/interfaces/marker';
import { User } from 'src/app/shared/interfaces/user';
import { UsersService } from 'src/app/shared/services/users.service';
import { FiltersPopoverMenuComponent } from '../../../shared/components/filters-popover-menu/filters-popover-menu.component';
import { FiltersInterface } from '../../../shared/interfaces/filters';
import { LocationService } from '../../../shared/services/location.service';
import { ProfilePage } from '../profile/profile.page';
import { getItemLocalStorage } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  currentUser: User = new User();
  bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds();
  center: google.maps.LatLng = new google.maps.LatLng(0, 0);
  mapOptions: google.maps.MapOptions = {
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
  };
  filters: FiltersInterface = {
    surname: '',
    job: '',
    address: '',
    toFilter: false,
  };
  filteredUsers: User[] = [];
  points: Marker[] = [];
  currentTab: 'map' | 'list' = 'map';

  constructor(
    private readonly loadingCtrl: LoadingController,
    private readonly modalController: ModalController,
    private usersService: UsersService,
    private locationService: LocationService,
    private toastController: ToastController
  ) {}

  async ionViewWillEnter() {
    this.filteredUsers = [];
    await this.filterMap();
    this.currentUser = JSON.parse(getItemLocalStorage('user'));
  }

  async getLocation() {
    const loading = await this.loadingCtrl.create({
      message: 'Retrieving user position...',
    });
    await loading.present();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        await loading.dismiss();
      });
    }
  }

  async openFilters() {
    this.filters = {
      surname: '',
      job: '',
      address: '',
      toFilter: false,
    };
    const popover = await this.modalController.create({
      component: FiltersPopoverMenuComponent,
      cssClass: 'filter-popover',
      componentProps: {
        filters: this.filters,
      },
    });
    await popover.present();
    await popover.onDidDismiss();
    if ((this.filters.job || this.filters.surname || this.filters.address) && this.filters.toFilter) {
      this.filterMap();
    }
  }

  async filterMap() {
    this.filteredUsers = [];
    this.bounds = new google.maps.LatLngBounds();
    const loading = await this.loadingCtrl.create({
      message: 'Filtrando la ricerca. Attendere prego...',
    });
    if (this.filters) {
      await loading.present();
    }
    this.points = [];
    const filterString = this.composeFilterString();
    const users = await this.usersService.findAll(filterString);
    for (const user of users) {
      if (user.fattiTrovare) {
        const geocoderResponse = await this.locationService.createMarker(user);
        if (geocoderResponse) {
          const marker = new Marker({
            position: {
              lat: geocoderResponse.results[0].geometry.location.lat(),
              lng: geocoderResponse.results[0].geometry.location.lng(),
            },
          });
          const markerOptions: google.maps.MarkerOptions = {
            icon: {
              url: user.imgUrl,
              scaledSize: new google.maps.Size(50, 50, 'px', 'px'),
            },
          };
          marker.setOptions(markerOptions);
          marker.user = user;
          if (marker) {
            this.points.push(marker);
            this.filteredUsers.push(user);
            this.bounds.extend(marker.getPosition());
          }
        }
      }
    }
    if (this.filters) {
      await loading.dismiss();
    }
    if (this.points.length === 0) {
      const toast = await this.toastController.create({
        message: 'Nessun utente trovato',
        duration: 4000,
        color: 'dark',
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
    this.center = this.bounds.getCenter();
    if (this.filteredUsers.length > 1) this.map.fitBounds(this.bounds);
  }

  composeFilterString() {
    let filterString = '';
    if (this.filters.surname || this.filters.job || this.filters.address) filterString += '?';
    if (this.filters.surname) filterString += `cognome=${this.filters.surname}`;
    if (this.filters.address) {
      if (filterString === '?') filterString += `localita=${this.filters.address}`;
      else filterString += `&localita=${this.filters.address}`;
    }
    if (this.filters.job) {
      if (filterString === '?') filterString += `professione=${this.filters.job}`;
      else filterString += `&professione=${this.filters.job}`;
    }
    return filterString;
  }

  async openProfile(id: string) {
    const modal = await this.modalController.create({
      component: ProfilePage,
      componentProps: {
        id,
      },
    });
    await modal.present();
  }

  toggleView() {
    if (this.currentTab === 'map') this.currentTab = 'list';
    else this.currentTab = 'map';
  }
}
