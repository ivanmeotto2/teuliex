import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { NewsService } from 'src/app/shared/services/news.service';
import { EventRegistrationModalComponent } from 'src/app/shared/components/event-registration-modal/event-registration-modal.component';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
	declarations: [HomePage, EventRegistrationModalComponent],
	providers: [NewsService, EmailComposer],
})
export class HomePageModule {}
