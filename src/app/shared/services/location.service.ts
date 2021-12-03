import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  GoogleAutocomplete: google.maps.places.AutocompleteService;

  constructor(private zone: NgZone) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
  }

  findLocation(autocomplete: { input: string }, autocompleteItems: any[]) {
    this.GoogleAutocomplete.getPlacePredictions(
      { input: autocomplete.input },
      (predictions) => {
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            autocompleteItems.push(prediction);
          });
        });
      }
    );
  }
}
