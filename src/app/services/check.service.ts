import { Injectable } from '@angular/core';
import { Udelezenec } from '../classes/udelezenec';
import { AlertService } from './alert.service';
import { FormattingService } from './formatting.service';
import { RepositoryService } from './repository.service';
import * as moment from 'moment';

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
  public getUdelezenci(skupina: String, force: boolean = false): Promise<Udelezenec[]> {
    return this.repositoryService.getData(skupina, force)
  }


  // changes current data coresponding to input
  // converts objects to raw data
  // updates data via repository service
  public nastaviPrisotnost(id: Number, present: number, datum: moment.Moment): any {

    let settings = this.formattingService.getSettings()
    let googleProfile = this.formattingService.getProfile()

    return new Promise((resolve, reject) => {
      this.repositoryService.getData(settings.skupina, false)
        .then(data => {

          let header = this.repositoryService.getHeader()
          let uporabnik = data.find(x => x.id == id)
          let udelezba = uporabnik.udelezbe.find(x => x.datum.isSame(datum, 'day'))
          let uporabnikForIndex = (element) => element.id == id
          let datumForIndex = (element) => element == datum.format("D. M. YYYY")
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
                  if (udelezba.datum.isSame(moment(naslov, 'D. M. YYYY'), 'day')) {
                    foo.push(udelezba.prisotnost)
                  }
                  return udelezba.datum == naslov
                })
              }
            });
            updated_data.push(foo);
          });

          console.log(data)

          updated_data.unshift(header);

          this.repositoryService.updateSingleCell(`${this.formattingService.indexToColumn(datumIndex)}${uporabnikIndex+2}`, simbol)
            .then((odgovor) => {
              resolve(this.repositoryService.dataToObject(updated_data))
            })
            .catch((napaka) => {
              reject('Repository error')
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


  public dodajStolpec(): any {
    let datum = moment()
    let header = this.repositoryService.getHeader()
    header.push(datum)

    return new Promise((resolve, reject) => {
      this.repositoryService.getData()
        .then(data => {

          data.forEach(uporabnik => {
            uporabnik.prisotnost[datum.format("DD.MM.YYYY").toString()] = ""
            uporabnik.udelezbe.push( {datum: datum, prisotnost: ""} )
          })

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


          this.repositoryService.updateData(updated_data)
            .then(() => {
              resolve(this.repositoryService.dataToObject(updated_data))
            })
            .catch(napaka => {
              reject(napaka)
            })
        })
    })
  }
}
