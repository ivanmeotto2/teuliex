import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FiltersInterface } from '../../interfaces/filters';
import { LocationService } from '../../services/location.service';

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

  constructor(private readonly modalController: ModalController, private locationService: LocationService) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.filters = {
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
        this.locationService.findLocation(this.autocomplete, this.autocompleteItems);
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
    if (!this.filters.address && !this.filters.job && !this.filters.surname) {
      return true;
    }
    return false;
  }

  async closePopover(value: boolean) {
    this.filters.toFilter = value;
    await this.modalController.dismiss();
  }
}
