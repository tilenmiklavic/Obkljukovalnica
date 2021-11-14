import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { SheetsService } from 'src/app/services/sheets.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit, AfterViewInit {

  constructor(
    private ngZone: NgZone,
    private sheetsService: SheetsService,
    private _snackBar: MatSnackBar,
  ) {
    window['onSignIn'] = (user) => ngZone.run(() => this.onSignIn(user));

  }

  public tabela: string = environment.url
  public povezava: string = localStorage.getItem('povezava')
  public sekcija: string = ''
  public skupine = []
  public izbrana_skupina: string = localStorage.getItem('skupina')
  public izbran_stolpec: string = localStorage.getItem('stolpecImena')
  public prisoten_symbol = localStorage.getItem('prisoten_symbol')
  public odsoten_symbol = localStorage.getItem('odsoten_symbol')
  public upraviceno_odsoten_symbol = localStorage.getItem('upraviceno_odsoten_symbol')

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

    if (!this.prisoten_symbol || !this.odsoten_symbol || !this.upraviceno_odsoten_symbol) {
      this._snackBar.open("Simbol za označevanje mora biti izpolnjen.", "Close")
      return
    }

    try {
      localStorage.setItem('preglednica', this.tabela)
      localStorage.setItem('skupina', this.izbrana_skupina)
      localStorage.setItem('stolpecImena', this.izbran_stolpec)
      localStorage.setItem('povezava', this.povezava)
      localStorage.setItem('prisoten_symbol', this.prisoten_symbol)
      localStorage.setItem('odsoten_symbol', this.odsoten_symbol)
      localStorage.setItem('upraviceno_odsoten_symbol', this.upraviceno_odsoten_symbol)

      let idTabele = this.povezava.split('/')[5]
      localStorage.setItem('idTabele', idTabele)


      this._snackBar.open("Nastavitve shranjene!", "Close")
    } catch (error) {

      console.log("Napaka pri shranjevanju nastavitev")
      this._snackBar.open("Ne morem shraniti nastavitev.", "Close")
    }

  }

  public getSkupine() {
    this.sheetsService.getSkupine()
    .then(odgovor => {
      console.log("Settings", odgovor)
      odgovor.sheets.forEach(element => {
        let foo = {"id": element.properties.sheetId, "ime": element.properties.title}
        this.skupine.push(foo)
      })
    })
    .catch(napaka => {
      console.log("Napaka pri pridobivanju skupin")
      console.error(napaka)
    })
  }

  ngOnInit(): void {
    this.sheetsService.getSkupine()
      .then(odgovor => {
        console.log("Settings", odgovor)
        odgovor.sheets.forEach(element => {
          let foo = {"id": element.properties.sheetId, "ime": element.properties.title}
          this.skupine.push(foo)
        })
      })
      .catch(napaka => {
        console.log("Napaka pri pridobivanju skupin")
        console.error(napaka)
      })
  }

  ngAfterViewInit(): void {
    // var gapi: any

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
