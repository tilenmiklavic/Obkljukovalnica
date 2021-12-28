import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { SheetsService } from './sheets.service';

@Injectable({
  providedIn: 'root'
})
export class FormattingService {

  constructor(
    private alertService: AlertService,
    private sheetService: SheetsService
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


  public vrniDatume(header): Array<String> {

    let result = []

    header.forEach(element => {
      if (this.jeDatum(element)) {
        result.push(element)
      }
    });
    return result
  }


  public jeDatum(datum: string): Boolean {
    var re = new RegExp("([0-9][0-9]?.[0-9][0-9]?.*)")
    if (re.test(datum)) {
      return true
    }

    return false
  }


  public vrniImena(data): Array<String> {
    let imena = []

    data.forEach(element => {
      imena.push(element["Ime"])
    });

    return imena
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


  public nastaviPrisotnost(id: Number, present: Number, data: Array<any>, header): Promise<boolean> {

    if (!localStorage.getItem('access_token') || localStorage.getItem('access_token') == 'undefined') {
      this.alertService.openSnackBar("Najprej se moraš prijaviti!")
      return null
    }

    let updated_data = []

    data.forEach(element => {
      let foo = []
      header.forEach(naslov => {
        foo.push(element[naslov])
      })

      updated_data.push(foo)
    })

    updated_data.unshift(header)

    return this.sheetService.updateData(updated_data)
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

        console.log("1")
        return {today: true, pendingDate: datum, datum: header[new_index]}
        // this.today = true
        // this.pending_date = this.datum
      } else if (header[new_index] == pending_date) {
        console.log("2")
        return {today: false, pendingDate: pending_date, datum: header[new_index]}
        // this.today = false
      }

      return {today: today, pendingDate: pending_date, datum: header[new_index]}
    } else {
      console.log("4")
      if (future) {
        this.alertService.openSnackBar("Ne morem it bolj v prihodnost.")
      } else {
        this.alertService.openSnackBar("Ne morem it bolj v preteklost.")
      }
      return null
    }
  }
}
