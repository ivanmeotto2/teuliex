import { Component, NgZone, Output, EventEmitter, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LocationService } from '../../services/location.service';
import { FiltersInterface } from '../../interfaces/filters';

@Component({
  selector: 'app-filters-popover-menu',
  templateUrl: './filters-popover-menu.component.html',
  styleUrls: ['./filters-popover-menu.component.scss'],
})
export class FiltersPopoverMenuComponent {
  @Input() filters: FiltersInterface;
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  autocomplete: { input: string };
  autocompleteItems: any[];
  addressSelected: boolean = false;

  constructor(
    private readonly popoverController: PopoverController,
    private locationService: LocationService
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.filters = {
      name: '',
      surname: '',
      job: '',
      address: '',
      toFilter: false,
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

  checkDisabled() {
    if (
      !this.filters.address &&
      !this.filters.job &&
      !this.filters.name &&
      !this.filters.surname
    ) {
      return true;
    }
    return false;
  }

  async closePopover(value: boolean) {
    this.filters.toFilter = value;
    await this.popoverController.dismiss();
  }
}
