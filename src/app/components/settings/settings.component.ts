import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { SheetsService } from 'src/app/services/sheets.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from 'src/app/services/alert.service';
import { Strings } from 'src/app/classes/strings';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit, AfterViewInit {

  constructor(
    private ngZone: NgZone,
    private sheetsService: SheetsService,
    private alertService: AlertService,
    private _snackBar: MatSnackBar,
  ) {
    window['onSignIn'] = (user) => ngZone.run(() => this.onSignIn(user));
  }

  public profile = null
  public tabela: string = environment.url
  public ime_preglednice: string = ""
  public shranjene_preglednice: Array<any> = JSON.parse(localStorage.getItem('shranjene_preglednice')) || []
  public povezava: string = localStorage.getItem('povezava')
  public sekcija: string = ''
  public skupine = []
  public izbrana_skupina: string = localStorage.getItem('skupina')
  public izbran_stolpec: string = localStorage.getItem('stolpecImena')
  public prisoten_symbol = localStorage.getItem('prisoten_symbol') || 'x'
  public odsoten_symbol = localStorage.getItem('odsoten_symbol') || '/'
  public upraviceno_odsoten_symbol = localStorage.getItem('upraviceno_odsoten_symbol') || 'o'
  public minimal_presence = localStorage.getItem('minimal_presence') || '50'
  public low_presence = localStorage.getItem('low_presence') || '70'
  public setup_progress = 0
  public versionNumber = 'v0.3.2'

  onSignIn(googleUser) {
    //now it gets called

    this.profile = googleUser.getBasicProfile()
    let access_token = googleUser.getAuthResponse().access_token

    localStorage.setItem('profile', this.profile)
    localStorage.setItem('access_token', access_token)

    this.posodobiSetupProgress()
  }

  public onSuccess(googleUser) {
    let profile = googleUser.getBasicProfile()
    let access_token = googleUser.getAuthResponse().access_token

    localStorage.setItem('profile', profile)
    localStorage.setItem('access_token', access_token)

    this.posodobiSetupProgress();
  }

  public onFailure() {
    console.log("Sign in unsuccesful")
  }

  public save() {

    console.log("Skupina", this.izbrana_skupina)

    if (!this.prisoten_symbol || !this.odsoten_symbol || !this.upraviceno_odsoten_symbol) {
      this.alertService.openSnackBar(Strings.markingSymbolEmptyErrorNotification)
      return
    }
    if (parseInt(this.minimal_presence) >= parseInt(this.low_presence)) {
      this.alertService.openSnackBar(Strings.minimalPresenceLowestErrorNotification)
      return
    }
    let nova_preglednica = true
    this.shranjene_preglednice.forEach(preglednica => {
      if (preglednica.ime == this.ime_preglednice || preglednica.pobezava == this.povezava) nova_preglednica = false
    })
    if (nova_preglednica) {
      this.shranjene_preglednice.push({"ime": this.ime_preglednice, "povezava": this.povezava})
    }

    try {
      localStorage.setItem('preglednica', this.tabela)
      localStorage.setItem('shranjene_preglednice', JSON.stringify(this.shranjene_preglednice))
      localStorage.setItem('skupina', this.izbrana_skupina)
      localStorage.setItem('stolpecImena', this.izbran_stolpec)
      localStorage.setItem('povezava', this.povezava)
      localStorage.setItem('prisoten_symbol', this.prisoten_symbol)
      localStorage.setItem('odsoten_symbol', this.odsoten_symbol)
      localStorage.setItem('upraviceno_odsoten_symbol', this.upraviceno_odsoten_symbol)
      localStorage.setItem('minimal_presence', this.minimal_presence)
      localStorage.setItem('low_presence', this.low_presence)

      this.alertService.openSnackBar("Nastavitve shranjene!")

    } catch (error) {
      console.log("Napaka pri shranjevanju nastavitev")
      this.alertService.openSnackBar(Strings.saveChangesErrorNotification)
    } finally {
      this.posodobiSetupProgress()
    }

  }

  public getSkupine() {
    let idTabele = this.povezava.split('/')[5]
    localStorage.setItem('idTabele', idTabele)

    this.sheetsService.getSkupine()
    .then(odgovor => {
      this.ime_preglednice = odgovor.properties.title
      odgovor.sheets.forEach(element => {
        let foo = {"id": element.properties.title, "ime": element.properties.title}
        this.skupine.push(foo)
      })
      this.alertService.openSnackBar(Strings.getTableSuccessNotification)
      this.save()
    })
    .catch(napaka => {
      console.log("Napaka pri pridobivanju skupin")
      console.error(napaka)
    })
    .finally(() => {
      this.posodobiSetupProgress()
    })
  }


  public posodobiSetupProgress() {
    console.log(localStorage.getItem('access_token'))
    console.log(this.povezava)
    console.log(this.izbrana_skupina)
    console.log(this.izbrana_skupina == 'undefined')
    this.setup_progress = ((localStorage.getItem('access_token') != null) ? 50 : 0) + ((this.povezava) ? 25 : 0) + ((this.izbrana_skupina != undefined) && (this.izbrana_skupina != null) && (this.izbrana_skupina != 'undefined') ? 25 : 0)
  }


  ngOnInit(): void {
    this.sheetsService.getSkupine()
      .then(odgovor => {
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

    if (localStorage.getItem('access_token')) this.profile = true
    this.posodobiSetupProgress()
  }
}
