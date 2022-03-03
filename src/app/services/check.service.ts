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
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    return new Promise((resolve, reject) => {
      this.repositoryService.getData(settings.skupina, false)
        .then(data => {

          let header = this.repositoryService.getHeader()
          let uporabnik = data.find(x => x.id == id)
          let udelezba = uporabnik.udelezbe.find(x => x.datum == datum)
          let uporabnikForIndex = (element) => element.id == id
          let datumForIndex = (element) => element == datum
          let uporabnikIndex = data.findIndex(uporabnikForIndex);
          let datumIndex = header.findIndex(datumForIndex);
          let simbol = this.formattingService.vrniSimbol(present, settings)
          udelezba.prisotnost = simbol

          if (
            !googleProfile.access_token ||
            googleProfile.access_token == 'undefined'
          ) {
            this.alertService.openSnackBar('Najprej se moraš prijaviti!');
            return null;
          }

          let updated_data = [];
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
          this.repositoryService.updateSingleCell(`${alphabet[datumIndex]}${uporabnikIndex+2}`, simbol)
            .then((odgovor) => {
              resolve(this.repositoryService.dataToObject(updated_data))
            })
            .catch((napaka) => {
              reject(napaka)
            })
        })
    })
  }


  public pobrisiPrisotnosti(datum): any {
    let settings = this.formattingService.getSettings()
    let googleProfile = this.formattingService.getProfile()
    //let datum = this.formattingService.getDate()

    return new Promise((resolve, reject) => {
      this.repositoryService.getData(settings.skupina, false)
        .then(data => {

          data.forEach(uporabnik => {
            let udelezba = uporabnik.udelezbe.find(x => x.datum == datum)
            udelezba.prisotnost = ""
          })

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
