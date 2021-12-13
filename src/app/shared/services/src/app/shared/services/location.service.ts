import { Injectable, NgZone } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  Geocoder: google.maps.Geocoder;

  constructor(private zone: NgZone) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.Geocoder = new google.maps.Geocoder();
  }

  findLocation(autocomplete: { input: string }, autocompleteItems: any[]) {
    this.GoogleAutocomplete.getPlacePredictions({ input: autocomplete.input }, (predictions) => {
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          autocompleteItems.push(prediction);
        });
      });
    });
  }

  async createMarker(user: User) {
    return await this.Geocoder.geocode({ address: user.localita });
  }
}
