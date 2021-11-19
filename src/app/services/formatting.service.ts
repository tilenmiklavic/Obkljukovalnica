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

  public vrniDatume(header): Array<String> {

    let result = []
    var re = new RegExp("([0-9][0-9]?.[0-9][0-9]?.*)")

    header.forEach(element => {
      if (re.test(element)) {
        result.push(element)
      }
    });
    return result
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
}
