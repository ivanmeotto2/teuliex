import { Component, NgZone } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-filters-popover-menu',
  templateUrl: './filters-popover-menu.component.html',
  styleUrls: ['./filters-popover-menu.component.scss'],
})
export class FiltersPopoverMenuComponent {
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  autocomplete: { input: string };
  autocompleteItems: any[];
  addressSelected: boolean = false;
  filters: {
    name?: string;
    address?: any;
    job?: string;
  };

  constructor(
    private readonly popoverController: PopoverController,
    private locationService: LocationService
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.filters = {
      name: '',
      job: '',
    };
  }

  async ionViewWillEnter() {}

  autocompleteAddress() {
    this.autocompleteItems = [];
    if (this.autocomplete.input === '') {
      return;
    } else {
      if (!this.addressSelected) {
        this.locationService.findLocation(
          this.autocomplete,
          this.autocompleteItems
        );
      } else {
        this.addressSelected = false;
      }
    }
  }

  selectedPlace(item: any) {
    this.filters.address = item.description;
    this.autocomplete.input = item.description;
    this.addressSelected = true;
    this.autocompleteItems = [];
  }

  async closePopover() {
    await this.popoverController.dismiss();
  }
}
