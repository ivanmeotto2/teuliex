import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewsDetailsPageRoutingModule } from './news-details-routing.module';
import { NewsDetailsPage } from './news-details.page';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsDetailsPageRoutingModule
  ],
  providers: [PhotoViewer],
  declarations: [NewsDetailsPage]
})
export class NewsDetailsPageModule {}
