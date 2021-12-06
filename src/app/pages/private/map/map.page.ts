import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, PopoverController } from '@ionic/angular';
import { User } from 'src/app/shared/interfaces/user';
import { FiltersPopoverMenuComponent } from '../../../shared/components/filters-popover-menu/filters-popover-menu.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  center: google.maps.LatLng = new google.maps.LatLng(0, 0);
  mapOptions: google.maps.MapOptions = {
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
  };
  filters: any = {
    name: '',
    job: '',
    address: '',
    toFilter: false,
  };
  filteredUsers: User[] = [];

  constructor(
    private readonly loadingCtrl: LoadingController,
    private readonly popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.getLocation();
  }

  async getLocation() {
    const loading = await this.loadingCtrl.create({
      message: 'Retrieving user position...',
    });
    await loading.present();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.center = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        await loading.dismiss();
      });
    }
  }

  async openFilters() {
    this.filters = {
      name: '',
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
    if (
      (this.filters.job || this.filters.name || this.filters.address) &&
      this.filters.toFilter
    ) {
      this.filterMap();
    }
  }

  filterMap() {
    console.log('Has to be filtered');
    const filterString = this.composeFilterString();
    console.log(filterString);
  }

  composeFilterString() {
    let filterString = '';
    if (this.filters.name || this.filters.job || this.filters.address)
      filterString += '?';
    if (this.filters.name) filterString += `nome=${this.filters.name}`;
    if (this.filters.address) {
      if (filterString === '?')
        filterString += `localita=${this.filters.address}`;
      else filterString += `&localita=${this.filters.address}`;
    }
    if (this.filters.job) {
      if (filterString === '?') filterString += `lavoro=${this.filters.job}`;
      else filterString += `&lavoro=${this.filters.job}`;
    }
    return filterString;
  }
}
