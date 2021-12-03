import { Component, OnInit } from '@angular/core';
import { LoadingController, PopoverController } from '@ionic/angular';
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
    const popover = await this.popoverController.create({
      component: FiltersPopoverMenuComponent,
      cssClass: 'filter-popover',
    });
    await popover.present();
  }
}
