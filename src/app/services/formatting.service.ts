import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormattingService {

  constructor() { }

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
}
