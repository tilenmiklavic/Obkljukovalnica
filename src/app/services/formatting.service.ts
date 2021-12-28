import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class FormattingService {

  constructor(
    private alertService: AlertService,
  ) { }

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
}
