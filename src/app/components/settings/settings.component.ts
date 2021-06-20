import { Component, OnInit, NgZone } from '@angular/core';
import { access } from 'fs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(ngZone: NgZone) {
    window['onSignIn'] = (user) => ngZone.run(() => this.onSignIn(user));
  }

  public tabela: String = ''
  public sekcija = ''

  onSignIn(googleUser) {
    //now it gets called

    let profile = googleUser.getBasicProfile()
    let access_token = googleUser.getAuthResponse().access_token

    localStorage.setItem('profile', profile)
    localStorage.setItem('access_token', access_token)
  }

  ngOnInit(): void {
  }

}
