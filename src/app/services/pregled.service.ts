import { Injectable } from '@angular/core';
import { FormattingService } from './formatting.service';
import { RepositoryService } from './repository.service';

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

  public getVodi() {
    return this.repositoryService.getVodi()
  }

  public prisotnostPoLjudeh(skupina) {
    this.repositoryService.getData(skupina)
      .then(data => {
        let osebe = new Array(data.length).fill(0)
        let header = this.repositoryService.getHeader()

        data.forEach((element, index) => {

          header.forEach(datum => {
            if (element[datum] == 'x') {
              osebe[index]++
            }
          });
        });

        return osebe
      })

      return null
  }

  public pregledPrisotnih(skupina, header): Promise<Number[]> {
    return new Promise(resolve => {

      let prisotni = new Array(header.length).fill(0)

      this.repositoryService.getData(skupina)
        .then(data => {
          header.forEach((termin, index) => {
            data.forEach(oseba => {
              oseba.udelezbe.forEach(udelezba => {
                if (udelezba.datum == termin && udelezba.prisotnost == 'x') {
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

  public vrniImena(skupina) {
    let keyword

    this.repositoryService.getData(skupina)
      .then(data => {

        let header = this.repositoryService.getHeader()

        if (header.includes("Ime")) { keyword = "Ime" }
        else if (header.includes("ime")) { keyword = "ime" }
        else { return null }

        let imena = []

        data.forEach(element => {
          imena.push(element[`${keyword}`])
        });

        return imena
      })

      return null
  }

  public prisotnostPoVodih(skupina) {
    return null
  }
}
