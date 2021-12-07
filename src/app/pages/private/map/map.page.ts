import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingController, PopoverController, ToastController } from '@ionic/angular';
import { User } from 'src/app/shared/interfaces/user';
import { FiltersPopoverMenuComponent } from '../../../shared/components/filters-popover-menu/filters-popover-menu.component';
import { FiltersInterface } from '../../../shared/interfaces/filters';
import { UsersService } from 'src/app/shared/services/users.service';
import { LocationService } from '../../../shared/services/location.service';
import { Marker } from 'src/app/shared/interfaces/marker';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
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
  currentTab: 'map' | 'list' = 'list';

  constructor(
    private readonly loadingCtrl: LoadingController,
    private readonly popoverController: PopoverController,
    private usersService: UsersService,
    private locationService: LocationService,
    private toastController: ToastController
  ) {}

  ionViewWillEnter() {
    this.getLocation();
  }

  async getLocation() {
    this.points = [];
    const loading = await this.loadingCtrl.create({
      message: 'Retrieving user position...',
    });
    await loading.present();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        await loading.dismiss();
      });
      const marker = new Marker({
        position: this.center,
      });
      this.points.push(marker);
    }
  }

  async openFilters() {
    this.filters = {
      surname: '',
      job: '',
      address: '',
      toFilter: false,
    };
    const popover = await this.popoverController.create({
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
    const loading = await this.loadingCtrl.create({
      message: 'Filtrando la ricerca. Attendere prego...',
    });
    await loading.present();
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
          marker.addListener('click', () => {
            console.log('prova');
          });
          marker.user = user;
          if (marker) {
            this.points.push(marker);
            this.filteredUsers.push(user);
          }
        }
      }
    }
    await loading.dismiss();
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
      if (filterString === '?') filterString += `lavoro=${this.filters.job}`;
      else filterString += `&lavoro=${this.filters.job}`;
    }
    return filterString;
  }

  prova(point: any) {
    console.log(point.user);
  }

  toggleView() {
    if (this.currentTab === 'map') this.currentTab = 'list';
    else this.currentTab = 'map';
  }
}
