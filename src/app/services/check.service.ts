import { Injectable } from '@angular/core';
import { Udelezenec } from '../classes/udelezenec';
import { AlertService } from './alert.service';
import { FormattingService } from './formatting.service';
import { RepositoryService } from './repository.service';
import * as moment from 'moment';
import { Udelezba } from '../classes/udelezba';

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
          let rawHeader = this.repositoryService.getRawHeader()
          let uporabnik = data.find(x => x.id == id)
          let udelezba = uporabnik.udelezbe.find(x => x.datum.isSame(datum, 'day'))
          let uporabnikForIndex = (element) => element.id == id
          let datumForIndex = (element) => element == datum.format("D. M. YYYY")
          let uporabnikIndex = data.findIndex(uporabnikForIndex);
          let datumIndex = rawHeader.findIndex(datumForIndex);

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

          updated_data.unshift(header);

          this.repositoryService.updateSingleCell(`${this.formattingService.indexToColumn(datumIndex)}${uporabnikIndex+2}`, simbol)
            .then((odgovor) => {
              resolve(this.repositoryService.dataToObject(updated_data, false))
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
            let udelezba = uporabnik.udelezbe.find(x => x.datum.isSame(datum, 'day'))
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
                  if (udelezba.datum.isSame(moment(naslov, "D. M. YYYY"))) {
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

    for (let i = 0; i < header.length; i++) {
      var foo = moment(header[i], "D. M. YYYY")
      var fooBack = moment(header[i-1], "D. M. YYYY")

      if (foo.isValid() && foo.isAfter(datum)) {
        header.splice(i, 0, datum.format("D. M. YYYY"))
        break
      } else if (!foo.isValid() && fooBack.isValid() && fooBack.isBefore(datum)) {
        header.splice(i, 0, datum.format("D. M. YYYY"))
        break
      }
    }

    return new Promise((resolve, reject) => {
      this.repositoryService.getData()
        .then(data => {

          data.forEach(uporabnik => {
            uporabnik.prisotnost[datum.format("D. M. YYYY").toString()] = ""
            var novaUdelezba = new Udelezba
            novaUdelezba.datum = datum
            novaUdelezba.prisotnost = ""
            uporabnik.udelezbe.push( novaUdelezba )
          })


          let updated_data = [];
          data.forEach((element) => {
            let foo = [];
            header.forEach((naslov) => {
              if (element[naslov] != undefined) {                     // updejt informativnega polja
                foo.push(element[naslov])
              } else {
                element.udelezbe.some(udelezba => {
                  if (udelezba.datum.isSame(moment(naslov, "D. M. YYYY"), 'day')) {
                    foo.push(udelezba.prisotnost)
                  }
                  return udelezba.datum.isSame(moment(naslov, "D. M. YYYY"), 'day')
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
