import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PrivatePageRoutingModule } from './private-routing.module';
import { PrivatePage } from './private.page';
import { UserPopoverMenuComponent } from 'src/app/shared/components/user-popover-menu/user-popover-menu.component';
import { FiltersPopoverMenuComponent } from 'src/app/shared/components/filters-popover-menu/filters-popover-menu.component';
import { SideMenuComponent } from 'src/app/shared/components/side-menu/side-menu.component';
import { TabNamePipe } from '../../shared/pipes/tab-name.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PrivatePageRoutingModule],

  declarations: [
    PrivatePage,
    UserPopoverMenuComponent,
    FiltersPopoverMenuComponent,
    SideMenuComponent,
    TabNamePipe,
  ],
})
export class PrivatePageModule {}
