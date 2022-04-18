import { Component, OnInit, NgZone, AfterViewInit, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { Strings } from 'src/app/classes/strings';
import { SettingsService } from 'src/app/services/settings.service';
import { Settings } from 'src/app/classes/settings';
import { FormattingService } from 'src/app/services/formatting.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit, AfterViewInit {

  constructor(
    private alertService: AlertService,
    private settingsService: SettingsService,
    private formattingService: FormattingService
  ) { }

  public profile = null
  public ime_preglednice: string = ""
  public settings: Settings = JSON.parse(localStorage.getItem('settings')) || this.formattingService.newSettings()
  public versionNumber = 'v0.6.0'

  public onSuccess(googleUser) {

    let googleProfile = {
      profile: googleUser.getBasicProfile(),
      access_token: googleUser.getAuthResponse().access_token
    }

    localStorage.setItem('googleProfile', JSON.stringify(googleProfile))
  }

  public onFailure() {
    console.log("Sign in unsuccesful")
  }

  public shraniNastavitve() {
    if (!this.settings.simboli.prisoten_symbol || !this.settings.simboli.odsoten_symbol || !this.settings.simboli.upraviceno_odsoten_symbol) {
      this.alertService.openSnackBar(Strings.markingSymbolEmptyErrorNotification)
      return
    }
    if (parseInt(this.settings.minimal_presence) >= parseInt(this.settings.low_presence)) {
      this.alertService.openSnackBar(Strings.minimalPresenceLowestErrorNotification)
      return
    }

    let settings = {
      shranjene_preglednice: this.settings.shranjene_preglednice,
      skupina: this.settings.skupina,
      povezava: this.settings.povezava,
      id_preglednice: this.settings.id_preglednice,
      simboli: {
        prisoten_symbol: this.settings.simboli.prisoten_symbol || 'x',
        odsoten_symbol: this.settings.simboli.odsoten_symbol || '/',
        upraviceno_odsoten_symbol: this.settings.simboli.upraviceno_odsoten_symbol || 'o'
      },
      minimal_presence: this.settings.minimal_presence,
      low_presence: this.settings.low_presence
    }

    console.log(settings)

    try {
      localStorage.setItem('settings', JSON.stringify(settings))
      this.alertService.openSnackBar("Nastavitve shranjene!")

    } catch (error) {
      this.alertService.openSnackBar(Strings.saveChangesErrorNotification)
    }
  }

  public pridobiPreglednico() {
    let idTabele = this.settings.povezava.split('/')[5]
    this.settings.id_preglednice = idTabele

    let shranjenaPreglednica = this.settings.shranjene_preglednice.filter(element => element.id == idTabele)

    if (!shranjenaPreglednica.length) {
      this.settingsService.getSheetInfo(idTabele)
      .then(odgovor => {
        let preglednica = {
          title: odgovor.properties.title,
          id: odgovor.spreadsheetId,
          skupina: odgovor.sheets[0].properties.title,
          povezava: odgovor.spreadsheetUrl
        }
        this.settings.povezava = odgovor.spreadsheetUrl
        this.settings.skupina = odgovor.sheets[0].properties.title
        this.settings.shranjene_preglednice.push(preglednica)

        this.shraniNastavitve()
        this.alertService.openSnackBar(Strings.getTableSuccessNotification)
      })
      .catch(napaka => {
        console.log("Napaka pri pridobivanju skupin")
        console.error(napaka)
      })
    } else {
      this.settings.povezava = shranjenaPreglednica[0].povezava
      this.settings.skupina = shranjenaPreglednica[0].skupina
      this.shraniNastavitve()
    }
  }

  public profileCheck() {
    if (this.formattingService.getProfile().access_token) {
      this.profile = true
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    // var gapi: any

    gapi.signin2.render('my-signin2', {
      'scope': 'profile email https://www.googleapis.com/auth/spreadsheets',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'outline',
      'onsuccess': this.onSuccess,
      'onfailure': this.onFailure
    })

    this.profileCheck()
  }
}
