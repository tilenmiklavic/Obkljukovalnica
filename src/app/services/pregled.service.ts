import { Injectable } from '@angular/core';
import { FormattingService } from './formatting.service';
import { RepositoryService } from './repository.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PregledService {

  constructor(
    private repositoryService: RepositoryService,
    private formattingService: FormattingService
  ) { }

  public getUdelezenci(skupina) {
    return this.repositoryService.getData(skupina)
  }

  public vrniVode() {
    return this.repositoryService.getVodi()
  }

  public prisotnostPoLjudeh(skupina): any {
    return new Promise((resolve, reject) => {
      this.repositoryService.getData(skupina)
        .then(data => {
          let osebe = new Array(data.length).fill(0)
          let datumi = this.vrniDatume()
          data.forEach((element, index) => {
            datumi.forEach(datum => {
              if (element.prisotnost[datum] == 'x') {
                osebe[index]++
              }
            });
          });
          resolve(osebe)
        })
    })
  }

  public pregledPrisotnih(skupina, header): Promise<Number[]> {
    return new Promise(resolve => {
      let prisotni = new Array(header.length).fill(0)

      this.repositoryService.getData(skupina)
        .then(data => {
          header.forEach((termin, index) => {
            data.forEach(oseba => {
              oseba.udelezbe.forEach(udelezba => {
                if (udelezba.datum.isSame(moment(termin, "D. M. YYYY")) && udelezba.prisotnost == 'x') {
                  prisotni[index]++
                }
              })
            });
          });
          resolve(prisotni)
        })
    })
  }

  public vrniDatume() {
    let header = this.repositoryService.getHeader()
    let datumi = []

    header.forEach(element => {
      if (this.formattingService.jeDatum(element)) {
        datumi.push(element)
      }
    });

    return datumi
  }

  public vrniKratkeDatume() {
    let header = this.repositoryService.getHeader()
    let datumi = []

    header.forEach(element => {
      if (this.formattingService.jeDatum(element)) {
        datumi.push(moment(element, "D. M. YYYY").format("D. M."))
      }
    });

    return datumi
  }

  public steviloIzvedenihSrecanj(skupina): Promise<number> {
    let srecanja = 0

    return new Promise((resolve, reject) => {
      this.repositoryService.getData(skupina)
        .then(data => {
          let datumi = this.vrniDatume()
          datumi.forEach(datum => {
            data.some(element => {
              if (element.prisotnost[datum] && element.prisotnost[datum].length > 0) {
                srecanja++
              }
              return (element.prisotnost[datum] && element.prisotnost[datum].length > 0)
            })
          })
          resolve(srecanja)
        })
    })
  }
}
