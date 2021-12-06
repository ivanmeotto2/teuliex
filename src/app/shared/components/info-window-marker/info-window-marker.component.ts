import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-info-window-marker',
  templateUrl: './info-window-marker.component.html',
  styleUrls: ['./info-window-marker.component.scss'],
})
export class InfoWindowMarkerComponent implements OnInit {
  @Input() userInfo: User = new User();

  constructor() {}

  ngOnInit() {}
}
