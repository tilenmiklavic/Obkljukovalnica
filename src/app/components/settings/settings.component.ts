import { Component, OnInit, NgZone, AfterViewInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/services/alert.service';
import { Strings } from 'src/app/classes/strings';
import {ThemePalette} from '@angular/material/core';
import { OsebnoNapredovanjeService } from 'src/app/services/osebno-napredovanje.service';
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
    private osebnoNapredovanjeService: OsebnoNapredovanjeService,
    private settingsService: SettingsService,
    private formattingService: FormattingService
  ) { }

  public profile = null
  public tabela: string = environment.url
  public ime_preglednice: string = ""
  public settings: Settings = JSON.parse(localStorage.getItem('settings')) || this.formattingService.newSettings()
  public sekcija: string = ''
  public skupine = []
  public setup_progress = 0
  public panelOpenState = false
  public versionNumber = 'v0.4.4'

  // *********** OSEBNO NAPREDOVANJE ***********
  public ONPreglednicaUrl: string = localStorage.getItem('ONPreglednicaUrl')
  public ONShranjenePreglednice: Array<any> = JSON.parse(localStorage.getItem('ONShranjenePreglednice')) || []
  public osebnoNapredovanjeToggle = JSON.parse(localStorage.getItem('osebnoNapredovanjeEnabled'))|| false;
  color: ThemePalette = 'accent';
  disabled = false;
  // *********** *********** *********** *******


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
    let nova_preglednica = true
    this.settings.shranjene_preglednice.forEach(preglednica => {
      if (preglednica.ime == this.ime_preglednice || preglednica.povezava == this.settings.povezava) nova_preglednica = false
    })
    if (nova_preglednica) {
      this.settings.shranjene_preglednice.push({"ime": this.ime_preglednice, "povezava": this.settings.povezava})
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

    this.settingsService.getSkupine()
    .then(odgovor => {
      console.log(odgovor)
      this.ime_preglednice = odgovor.properties.title
      odgovor.sheets.forEach(element => {
        let foo = {"id": element.properties.index, "ime": element.properties.title}
        this.skupine.push(foo)
      })
      this.alertService.openSnackBar(Strings.getTableSuccessNotification)
      this.shraniNastavitve()
    })
    .catch(napaka => {
      console.log("Napaka pri pridobivanju skupin")
      console.error(napaka)
    })
  }

  public getTabelaON() {
    localStorage.setItem('ONPreglednicaUrl', this.ONPreglednicaUrl)

    this.osebnoNapredovanjeService.getMetadata()
    .then(odgovor => {
      let skupina = odgovor.sheets[0].properties.title
      let title = odgovor.properties.title

      let nova_preglednica = true
      this.ONShranjenePreglednice.forEach(preglednica => {
        if (preglednica.ime == title || preglednica.povezava == this.settings.povezava) nova_preglednica = false
      })
      if (nova_preglednica) {
        this.ONShranjenePreglednice.push({"ime": title, "povezava": this.ONPreglednicaUrl, "skupina": skupina})
      }

      this.alertService.openSnackBar(Strings.getTableSuccessNotification)

      localStorage.setItem('ONShranjenePreglednice', JSON.stringify(this.ONShranjenePreglednice))
    })
    .catch(napaka => {
      console.log("Napaka pri pridobivanju skupin")
      console.error(napaka)
    })
  }

  public profileCheck() {
    if (this.formattingService.getProfile().access_token) {
      this.profile = true
    }
  }

  ngOnInit(): void {
    this.settingsService.getSkupine()
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
