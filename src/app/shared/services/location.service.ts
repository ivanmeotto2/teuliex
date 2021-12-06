import { Injectable, NgZone } from '@angular/core';
import { User } from '../interfaces/user';
import { Marker } from '../interfaces/marker';

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

	getAllLocations(users: User[], markers: Marker[]) {
		users.forEach((user) => {
			const content = `<ion-content>
      <ion-row class="ion-justify-content-center">
        <ion-title>{${user.nome + ' ' + user.cognome}}</ion-title>
      </ion-row>
      <ion-row>
        <ion-text>{${user.dataNascita.toString()}}</ion-text>
      </ion-row>
    </ion-content>`;
			this.Geocoder.geocode({ address: user.localita }, function (res, status) {
				if (status === 'OK') {
					const marker = new Marker({
						position: {
							lat: res[0].geometry.location.lat(),
							lng: res[0].geometry.location.lng(),
						},
					});
					marker.user = user;
					const infoWindow = new google.maps.InfoWindow({
						content: content,
					});
					google.maps.event.addListener(marker, 'click', () => {
						infoWindow.open({
							anchor: marker,
							shouldFocus: true,
						});
					});
					markers.push(marker);
				} else {
					console.log(
						'Geocoder was not successful for the following reason: ' + status
					);
				}
			});
		});
		console.log(markers);
	}
}
