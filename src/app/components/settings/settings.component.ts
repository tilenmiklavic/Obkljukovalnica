import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(ngZone: NgZone) {
    window['onSignIn'] = (user) => ngZone.run(() => this.onSignIn(user));
  }

  onSignIn(googleUser) {
    //now it gets called
    console.log(googleUser)
  }

  ngOnInit(): void {
  }

}
