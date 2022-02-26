import { Injectable } from '@angular/core';
import { Udelezenec } from '../classes/udelezenec';
import { AlertService } from './alert.service';
import { FormattingService } from './formatting.service';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class CheckService {

  constructor(
    private repositoryService: RepositoryService,
    private formattingService: FormattingService,
    private alertService: AlertService
  ) { }

  // gets data from repository service
  public getUdelezenci(skupina: String): Promise<Udelezenec[]> {

    return this.repositoryService.getData(skupina)

  }


  // changes current data coresponding to input
  // converts objects to raw data
  // updates data via repository service
  public nastaviPrisotnost(id: Number, present: number): any {

    let settings = this.formattingService.getSettings()
    let googleProfile = this.formattingService.getProfile()
    let datum = this.formattingService.getDate()

    return new Promise((resolve, reject) => {
      this.repositoryService.getData(settings.skupina, false)
        .then(data => {

          let uporabnik = data.find(x => x.id == id)
          let udelezba = uporabnik.udelezbe.find(x => x.datum == datum)

          switch(present) {
            case 0:
              udelezba.prisotnost = settings.simboli.prisoten_symbol
              break;
            case 1:
              udelezba.prisotnost = settings.simboli.upraviceno_odsoten_symbol
              break;
            case 2:
              udelezba.prisotnost = settings.simboli.odsoten_symbol
              break;
          }

          if (
            !googleProfile.access_token ||
            googleProfile.access_token == 'undefined'
          ) {
            this.alertService.openSnackBar('Najprej se moraš prijaviti!');
            return null;
          }

          let updated_data = [];
          let header = this.repositoryService.getHeader()

          data.forEach((element) => {
            let foo = [];
            header.forEach((naslov) => {
              if (element[naslov] != undefined) {                     // updejt informativnega polja
                foo.push(element[naslov])
              } else {
                element.udelezbe.some(udelezba => {
                  if (udelezba.datum == naslov) {
                    foo.push(udelezba.prisotnost)
                  }
                  return udelezba.datum == naslov
                })
              }
            });
            updated_data.push(foo);
          });


          updated_data.unshift(header);
          this.repositoryService.updateData(updated_data)
            .then((odgovor) => {
              resolve(this.repositoryService.dataToObject(updated_data))
            })
            .catch((napaka) => {
              reject(napaka)
            })
        })
    })
  }
}
