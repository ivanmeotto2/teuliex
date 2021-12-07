import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}

  async ionViewWillEnter() {
    await SplashScreen.hide();
    await SplashScreen.show({
      autoHide: true,
      showDuration: 4000,
    });
  }
}
