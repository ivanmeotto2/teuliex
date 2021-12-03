import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { getItemLocalStorage } from '../../../shared/utils/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User = new User();
  currentTab: string = 'details';

  constructor() {}

  ngOnInit() {
    this.user = JSON.parse(getItemLocalStorage('user'));
  }

  setCurrentTab(value: any) {
    this.currentTab = value;
  }
}
