import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { UsersService } from './shared/services/users.service';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/environments/environment';
import { InfoWindowMarkerComponent } from './shared/components/info-window-marker/info-window-marker.component';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';

@NgModule({
  declarations: [AppComponent, InfoWindowMarkerComponent],
  entryComponents: [],
  imports: [
  
  BrowserModule,
    IonicModule.forRoot({
      menuType: 'overlay',
    }),
    AppRoutingModule,
    HttpClientModule,
    GooglePlaceModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UsersService,
    CallNumber
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    initializeApp(firebaseConfig);
  }
}
