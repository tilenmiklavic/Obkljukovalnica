import { Injectable } from '@angular/core';
import { Settings } from '../classes/settings';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class FormattingService {

  constructor(
    private alertService: AlertService,
  ) { }


  public jeDatum(datum: string): Boolean {
    var re = new RegExp("([0-9][0-9]?.[0-9][0-9]?.*)")
    if (re.test(datum)) {
      return true
    }
    return false
  }

  public vrniDatume(header) {
    let datumi = []

    header.forEach(element => {
      if (this.jeDatum(element)) {
        datumi.push(element)
      }
    })
    return datumi
  }

  public getSettings() {
    let settings = JSON.parse(localStorage.getItem('settings'))

    if (settings == null) { throw "Settings not yet saved" }

    return settings
  }


  public getProfile() {
    let googleProfile = JSON.parse(localStorage.getItem('googleProfile'))

    if (googleProfile == null) { throw 'User not signed in' }

    return googleProfile
  }


  // gets today's date as a string
  public getDate() {
    let date = new Date()
    let month = date.getMonth() + 1

    return `${date.getDate()}.${month}.`
  }


  // generates new basic settings class
  public newSettings() {
    let newSettings: Settings = {
      shranjene_preglednice: [],
      skupina: null,
      povezava: null,
      id_preglednice: null,
      simboli: {
        prisoten_symbol: 'x',
        odsoten_symbol: '/',
        upraviceno_odsoten_symbol: 'o'
      },
      minimal_presence: '50',
      low_presence: '70'
    }

    return newSettings
  }


  public vrniSimbol(index: number, settings: Settings) {

    switch(index) {
      case 0:
        return settings.simboli.prisoten_symbol
      case 1:
        return settings.simboli.upraviceno_odsoten_symbol
      case 2:
        return settings.simboli.odsoten_symbol
    }

    return null;
  }
}
