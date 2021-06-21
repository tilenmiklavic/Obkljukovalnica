import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { SheetsService } from 'src/app/services/sheets.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit, AfterViewInit {

  constructor(
    private ngZone: NgZone,
    private sheetsService: SheetsService
  ) {
    window['onSignIn'] = (user) => ngZone.run(() => this.onSignIn(user));
  }

  public tabela: string = ''
  public sekcija: string = ''
  public skupine = []
  public izbrana_skupina: string = ''

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

  public save() {
    localStorage.setItem('preglednica', this.tabela)
    localStorage.setItem('skupina', this.izbrana_skupina)
  }

  ngOnInit(): void {
    this.sheetsService.getSkupine()
      .then(odgovor => {
        console.log(odgovor)
        odgovor.sheets.forEach(element => {
          let foo = {"id": element.properties.sheetId, "ime": element.properties.title}
          this.skupine.push(foo)
        })

      })
      .catch(napaka => {
        console.error(napaka)
      })
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
