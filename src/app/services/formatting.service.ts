import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormattingService {

  constructor() { }

  public vrniDatume(header): Array<String> {

    let result = []
    var re = new RegExp("([0-9][0-9]?.[0-9][0-9]?)")

    header.forEach(element => {
      if (re.test(element)) {
        result.push(element)
      }
    });
    return result
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

    console.log(prisotni)

    header.forEach((datum, index) => {
      data.forEach(element => {
        if (element[datum] == 'x') {
          prisotni[index]++
        }
      });
    });
    return prisotni
  }
}
