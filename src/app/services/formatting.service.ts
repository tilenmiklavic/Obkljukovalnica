import { Injectable } from '@angular/core';
import { Settings } from '../classes/settings';
import { AlertService } from './alert.service';
import { MappingService } from './mapping.service';

@Injectable({
  providedIn: 'root'
})
export class FormattingService {

  constructor(
    private alertService: AlertService,
  ) { }


  public arrayToObject(data) {
    console.log(data)

    let foo = {"Id": null, "Ime": null, "stopnja": null}
    let result = []
    let header = data.values[0]

    for (let i = 1; i < data.values.length; i++) {
      let temp = {}

      for (let j = 0; j < header.length; j++) {
        foo[header[j]] = data.values[i][j]
      }

      temp["id"] = foo.Id
      temp["ime"] = foo.Ime
      temp["stopnja"] = foo.stopnja

      delete foo.Id
      delete foo.Ime
      delete foo.stopnja

      let seznam = []
      let index = 0

      for (const [key, value] of Object.entries(foo)) {
        seznam.push({"idNaloge": index, "imeNaloge": key, "opravil": value})
        index++
      }

      temp["naloge"] = seznam

      result.push(temp)
    }

    return result
  }


  public jeDatum(datum: string): Boolean {
    var re = new RegExp("([0-9][0-9]?.[0-9][0-9]?.*)")
    if (re.test(datum)) {
      return true
    }
    return false
  }


  public prisotniNaDan(datum: string, data): number {
    let prisotni = 0

    data.forEach(element => {
      if(element[datum] == 'x') {
        prisotni ++
      }
    });
    return prisotni;
  }

  public pregledPrisotnih(data, header): Array<Number> {
    let prisotni = new Array(header.length).fill(0)

    header.forEach((datum, index) => {
      data.forEach(element => {
        if (element[datum] == 'x') {
          prisotni[index]++
        }
      });
    });
    return prisotni
  }

  public prisotnostPoLjudeh(data, header): Array<Number> {
    let osebe = new Array(data.length).fill(0)

    data.forEach((element, index) => {

      header.forEach(datum => {
        if (element[datum] == 'x') {
          osebe[index]++
        }
      });
    });

    return osebe
  }

  public steviloIzvedenihSrecanj(data, header): number {

    let steviloSrecanj = 0
    let trenutnoStevilo = 0
    let znaki = ["x", "/", "o"]

    data.forEach(element => {
      header.forEach(naslov => {
        if (znaki.includes(element[naslov])) {
          trenutnoStevilo++
        }
      })

      steviloSrecanj = Math.max(steviloSrecanj, trenutnoStevilo)
      trenutnoStevilo = 0
    })

    return steviloSrecanj
  }


  public prisotnostPoVodih(data, header) {
    return null
  }

  public vrniDatume(header) {
    return null
  }


  public changeDate(future: boolean, header, pending_date, datum, today): any {

    let current_index = 0
    console.log(pending_date)

    header.forEach((element, index) => {
      if (element == datum) {
        current_index = index
      }
    })

    let new_index = current_index

    if (future) new_index++
    else new_index--

    if (this.jeDatum(header[new_index])) {
      if (!today) {

        return {today: true, pendingDate: datum, datum: header[new_index]}
      } else if (header[new_index] == pending_date) {
        return {today: false, pendingDate: pending_date, datum: header[new_index]}
      }

      return {today: today, pendingDate: pending_date, datum: header[new_index]}
    } else {

      if (future) {
        this.alertService.openSnackBar("Ne morem it bolj v prihodnost.")
      } else {
        this.alertService.openSnackBar("Ne morem it bolj v preteklost.")
      }
      return null
    }
  }



  // ---------- NEW CODE ---------- //

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
}
