import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit, AfterViewInit {

  constructor(private ngZone: NgZone) {
    window['onSignIn'] = (user) => ngZone.run(() => this.onSignIn(user));
  }

  public tabela: String = ''
  public sekcija = ''

  onSignIn(googleUser) {
    //now it gets called

    let profile = googleUser.getBasicProfile()
    let access_token = googleUser.getAuthResponse().access_token

    console.log(googleUser)
    console.log(profile)

    localStorage.setItem('profile', profile)
    localStorage.setItem('access_token', access_token)
  }

  public onSuccess(googleUser) {

    let profile = googleUser.getBasicProfile()
    let access_token = googleUser.getAuthResponse().access_token

    console.log(googleUser)
    console.log(profile)

    localStorage.setItem('profile', profile)
    localStorage.setItem('access_token', access_token)

  }

  public onFailure() {
    console.log("Sign in unsuccesful")
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.ngZone.run(() => {
      // example to render login button
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email https://www.googleapis.com/auth/spreadsheets',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': this.onSuccess,
        'onfailure': this.onFailure
      })
    });
  }
}
