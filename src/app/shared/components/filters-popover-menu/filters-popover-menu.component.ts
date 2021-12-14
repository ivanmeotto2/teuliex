import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FiltersInterface } from '../../interfaces/filters';
import { LocationService } from '../../services/location.service';
import { getItemLocalStorage } from 'src/app/shared/utils/utils';
import { User } from 'src/app/shared/interfaces/user';
import { BehaviorsService } from '../../services/filters.service';

@Component({
  selector: 'app-filters-popover-menu',
  templateUrl: './filters-popover-menu.component.html',
  styleUrls: ['./filters-popover-menu.component.scss'],
})
export class FiltersPopoverMenuComponent {
  @Input() filters: FiltersInterface;
  geolocalization: boolean;
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  autocomplete: { input: string };
  autocompleteItems: any[];
  addressSelected: boolean = false;

  constructor(
    private readonly modalController: ModalController,
    private locationService: LocationService,
    private BehaviorsService: BehaviorsService
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.filters = {
      surname: '',
      job: '',
      address: '',
      toFilter: false,
      aroundMe: false,
      searchRadius: 0,
    };
    const user = JSON.parse(getItemLocalStorage('user')) as User;
    this.geolocalization = user.abilitaGeolocalizzazione;
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
    if (!this.filters.address && !this.filters.job && !this.filters.surname && (!this.filters.aroundMe || this.filters.searchRadius === 0)) {
      return true;
    }
    return false;
  }

  async closePopover(value: boolean) {
    this.filters.toFilter = value;
    this.BehaviorsService.filters.next(this.filters);
    await this.modalController.dismiss();
  }

  setSearchRange(event: any) {
    this.filters.searchRadius = event.detail.value;
  }
}
