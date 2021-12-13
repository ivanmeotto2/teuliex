import { Component, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { LatLng } from 'ngx-google-places-autocomplete/objects/latLng';
import { Marker } from 'src/app/shared/interfaces/marker';
import { User } from 'src/app/shared/interfaces/user';
import { UsersService } from 'src/app/shared/services/users.service';
import { getItemLocalStorage } from 'src/app/shared/utils/utils';
import { FiltersPopoverMenuComponent } from '../../../shared/components/filters-popover-menu/filters-popover-menu.component';
import { FiltersInterface } from '../../../shared/interfaces/filters';
import { LocationService } from '../../../shared/services/location.service';
import { ProfilePage } from '../profile/profile.page';
import { FiltersService } from 'src/app/shared/services/filters.service';

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
    aroundMe: false,
    searchRadius: 0,
  };
  filteredUsers: User[] = [];
  points: Marker[] = [];
  currentTab: 'map' | 'list' = 'map';
  trueCenter: google.maps.LatLng;

  constructor(
    private readonly loadingCtrl: LoadingController,
    private readonly modalController: ModalController,
    private usersService: UsersService,
    private locationService: LocationService,
    private toastController: ToastController,
    private filtersService: FiltersService
  ) {
    this.filtersService.filters.subscribe(async (value) => {
      this.filters = value;
      const modal = await this.modalController.getTop();
      if (modal) await modal.onDidDismiss();
      if ((this.filters.job || this.filters.surname || this.filters.address || this.filters.aroundMe) && this.filters.toFilter) {
        this.filterMap();
      }
    });
  }

  async ionViewWillEnter() {
    this.filters = {
      surname: '',
      job: '',
      address: '',
      toFilter: false,
      aroundMe: false,
      searchRadius: 0,
    };
    this.filteredUsers = [];
    await this.getLocation(false, false);
    await this.filterMap();
    this.currentUser = JSON.parse(getItemLocalStorage('user'));
  }

  async getLocation(toLoad: boolean, setCenter: boolean) {
    let loading: HTMLIonLoadingElement;
    if (toLoad) {
      loading = await this.loadingCtrl.create({
        message: 'Retrieving user position...',
      });
      await loading.present();
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        if (toLoad) await loading.dismiss();
        if (setCenter) this.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.trueCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      });
    }
  }

  async openFilters() {
    this.filters = {
      surname: '',
      job: '',
      address: '',
      toFilter: false,
      aroundMe: false,
      searchRadius: 0,
    };
    const modal = await this.modalController.create({
      component: FiltersPopoverMenuComponent,
      cssClass: 'filter-popover',
      componentProps: {
        filters: this.filters,
      },
    });
    await modal.present();
    await modal.onDidDismiss();
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
      let distance: number;
      if (user.fattiTrovare) {
        const geocoderResponse = await this.locationService.createMarker(user);
        if (geocoderResponse) {
          let userPosition: LatLng;
          userPosition = new google.maps.LatLng(
            geocoderResponse.results[0].geometry.location.lat(),
            geocoderResponse.results[0].geometry.location.lng()
          );
          if (this.filters.aroundMe) distance = google.maps.geometry.spherical.computeDistanceBetween(this.trueCenter, userPosition);
          if (!this.filters.aroundMe || (this.filters.aroundMe && distance <= this.filters.searchRadius * 1000)) {
            const marker = new Marker({
              position: userPosition,
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
      // await this.getLocation();
    } else {
      this.center = this.bounds.getCenter();
      if (this.filteredUsers.length > 1) this.map.fitBounds(this.bounds);
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
